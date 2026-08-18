require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { GoogleGenAI } = require("@google/genai");
const cors = require("cors");

const app = express();
const port = 80;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 데이터베이스 커넥션 풀을 저장할 변수
let dbPool = null;

// Gemini AI 설정 (모델은 GEMINI_MODEL 환경 변수로 교체 가능)
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const configureGemini = () => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error("Gemini API 키가 설정되지 않았습니다.");
    return null;
  }
  return new GoogleGenAI({ apiKey: geminiKey });
};

// Gemini 초기화
const geminiClient = configureGemini();

// 데이터베이스 연결 함수
const connectToDatabase = async () => {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    console.error("데이터베이스 설정이 없습니다:", missingEnvVars.join(", "));
    return null;
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // 실제로 접속이 되는지 확인한다 (풀 생성만으로는 연결이 검증되지 않는다)
  const connection = await pool.getConnection();
  connection.release();
  console.log("데이터베이스 연결 성공");

  await createNotesTable(pool);

  dbPool = pool;
  return pool;
};

// notes 테이블 생성 함수
const createNotesTable = async (pool) => {
  const createTableQuery = `
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_note TEXT NOT NULL,
                ai_note TEXT,
                ai_type ENUM('gemini') DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

  await pool.query(createTableQuery);
  console.log("Notes 테이블 준비 완료");
};

// DB 연결 상태 체크 미들웨어
const checkDbConnection = (req, res, next) => {
  if (!dbPool) {
    return res.status(503).json({
      error: "데이터베이스 연결 실패",
      message:
        "현재 데이터베이스 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.",
    });
  }
  next();
};

// Gemini AI 설정 체크 미들웨어
const checkGeminiConfig = (req, res, next) => {
  if (!geminiClient) {
    return res.status(503).json({
      error: "Gemini AI 설정 실패",
      message:
        "AI 서비스를 현재 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
    });
  }
  next();
};

// Gemini에게 학습 조언을 요청한다
const generateAiNote = async (userMessage) => {
  const prompt = `You are an expert in AWS. Based on the data provided by the user, suggest one AWS service that the user can additionally learn. Ensure the response is at least three sentences long and in Korean.

사용자 입력: ${userMessage}`;

  const response = await geminiClient.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return response.text;
};

// 저장된 노트에 AI 응답을 채워 넣는다
const saveAiNote = async (id, aiNote) => {
  await dbPool.execute(
    "UPDATE notes SET ai_note = ?, ai_type = 'gemini' WHERE id = ?",
    [aiNote, id],
  );
};

// 기본 경로
app.get("/", (req, res) => {
  res.json({
    message: "서버 실행 중",
    status: {
      database: dbPool ? "연결됨" : "연결 안됨",
      gemini: geminiClient ? `설정됨 (${GEMINI_MODEL})` : "설정 안됨",
    },
  });
});

// 메모 추가 (저장을 먼저 끝내고, Gemini 분석은 응답 이후 백그라운드로 진행)
app.post("/notes", checkDbConnection, async (req, res) => {
  const userMessage = req.body?.content;

  if (!userMessage?.trim()) {
    return res.status(400).json({ error: "내용을 입력해주세요" });
  }

  let insertId;
  try {
    const [result] = await dbPool.execute(
      "INSERT INTO notes (user_note, ai_note, ai_type) VALUES (?, NULL, NULL)",
      [userMessage],
    );
    insertId = result.insertId;
  } catch (error) {
    console.error("데이터베이스 저장 중 오류:", error);
    return res.status(500).json({ error: "데이터베이스 저장 실패" });
  }

  // 노트는 이미 저장되었으므로 AI 호출 결과와 무관하게 성공을 먼저 알린다
  res.status(201).json({
    message: "기록이 저장되었습니다",
    id: insertId,
    ai_status: geminiClient ? "pending" : "unavailable",
  });

  if (!geminiClient) {
    console.error(
      `Gemini 미설정으로 AI 분석을 건너뜁니다 (note id: ${insertId})`,
    );
    return;
  }

  // 백그라운드 분석: 실패해도 사용자 노트는 그대로 남는다
  generateAiNote(userMessage)
    .then((aiNote) => saveAiNote(insertId, aiNote))
    .then(() => console.log(`AI 분석 완료 (note id: ${insertId})`))
    .catch((error) => {
      console.error(`AI 분석 실패 (note id: ${insertId}):`, error);
    });
});

// 기존 메모에 대한 AI 조언 (재)요청
app.post("/ainotes", checkDbConnection, checkGeminiConfig, async (req, res) => {
  const { id, content } = req.body ?? {};

  try {
    let note = null;

    if (id !== undefined && id !== null && id !== "") {
      const [rows] = await dbPool.execute(
        "SELECT id, user_note FROM notes WHERE id = ?",
        [id],
      );
      note = rows[0] ?? null;
    } else if (content?.trim()) {
      // id 없이 본문만 보내는 예전 클라이언트 호환: 같은 내용의 최신 노트를 찾는다
      const [rows] = await dbPool.execute(
        "SELECT id, user_note FROM notes WHERE user_note = ? ORDER BY created_at DESC, id DESC LIMIT 1",
        [content],
      );
      note = rows[0] ?? null;
    } else {
      return res
        .status(400)
        .json({ error: "노트 id 또는 content를 보내주세요" });
    }

    if (!note) {
      return res.status(404).json({ error: "해당 메모를 찾을 수 없습니다" });
    }

    const aiNote = await generateAiNote(note.user_note);
    await saveAiNote(note.id, aiNote);

    res.json({
      message: "AI 조언이 저장되었습니다",
      id: note.id,
      ai_note: aiNote,
      ai_type: "gemini",
    });
  } catch (error) {
    console.error("AI 조언 요청 처리 중 오류:", error);
    res.status(500).json({ error: "AI 서비스 응답 실패" });
  }
});

// 전체 메모 불러오기
app.get("/notes", checkDbConnection, async (req, res) => {
  try {
    const [rows] = await dbPool.query(
      "SELECT * FROM notes ORDER BY created_at DESC, id DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("데이터 조회 중 오류:", error);
    res.status(500).json({ error: "데이터 조회 실패" });
  }
});

// 특정 메모 삭제
app.delete("/notes/:id", checkDbConnection, async (req, res) => {
  try {
    const [result] = await dbPool.execute("DELETE FROM notes WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "해당 ID의 메모를 찾을 수 없습니다" });
    }

    res.json({ message: "메모가 삭제되었습니다" });
  } catch (error) {
    console.error("데이터 삭제 중 오류:", error);
    res.status(500).json({ error: "데이터 삭제 실패" });
  }
});

// 전체 메모 삭제
app.delete("/notes", checkDbConnection, async (req, res) => {
  try {
    const [result] = await dbPool.query("DELETE FROM notes");
    res.json({
      message: "모든 메모가 삭제되었습니다",
      deletedCount: result.affectedRows,
    });
  } catch (error) {
    console.error("전체 데이터 삭제 중 오류:", error);
    res.status(500).json({ error: "전체 데이터 삭제 실패" });
  }
});

// 서버 시작
const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log("\n=== 서버 상태 ===");
      console.log(`포트: ${port}`);
      console.log(`데이터베이스 연결: ${dbPool ? "성공 ✅" : "실패 ❌"}`);
      console.log(
        `Gemini AI 설정: ${geminiClient ? `성공 ✅ (${GEMINI_MODEL})` : "실패 ❌"}`,
      );
      console.log("=================\n");
    });
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exit(1);
  }
};

// 예상치 못한 에러 처리
process.on("uncaughtException", (error) => {
  console.error("처리되지 않은 에러:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("처리되지 않은 Promise 거부:", error);
  process.exit(1);
});

startServer();
