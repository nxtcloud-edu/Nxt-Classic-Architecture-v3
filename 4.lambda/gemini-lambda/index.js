const { GoogleGenAI } = require("@google/genai");
const mysql = require('mysql2');

// Function URL로 들어온 요청(body가 JSON 문자열)과
// Lambda 콘솔 테스트 이벤트({"content": "...", "noteId": 1} 같은 평면 객체)를 모두 받는다.
const parseEvent = (event) => {
    if (!event || typeof event !== "object") {
        return null;
    }
    if (typeof event.body === "string") {
        return JSON.parse(event.body);
    }
    if (event.body && typeof event.body === "object") {
        return event.body;
    }
    return event;
};

exports.handler = async (event) => {
    // 환경 변수에서 Gemini API 키와 데이터베이스 연결 정보를 불러옵니다.
    // 모델은 GEMINI_MODEL 환경 변수로 교체 가능합니다.
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const geminiModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    let inputData;
    try {
        inputData = parseEvent(event);
    } catch (error) {
        console.error('JSON 파싱 오류:', error);
        return { statusCode: 400, body: `Invalid JSON format: ${error.message}` };
    }

    if (!inputData || !inputData.content || !inputData.noteId) {
        console.error('Invalid request: No content or noteId provided');
        return { statusCode: 400, body: 'No content or noteId provided' };
    }

    const userMessage = inputData.content;
    const noteId = inputData.noteId;
    console.log("EC2 -> Lambda로 전달된 데이터", inputData);
    console.log("ai한테 보낼 유저 메시지 내용", userMessage, typeof userMessage)

    try {
        // Gemini AI API 호출 (단순 텍스트 형태)
        const prompt = `You are an expert in AWS. Based on the data provided by the user, suggest one AWS service that the user can additionally learn. Ensure the response is at least three sentences long and in Korean.

User input: ${userMessage}`;

        const response = await genAI.models.generateContent({
            model: geminiModel,
            contents: prompt,
        });
        const aiResponse = response.text;

        console.log("ai 한테 받아왔어?", aiResponse)

        // 데이터베이스에 AI 응답 저장
        const dbConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        };
        const db = mysql.createConnection(dbConfig);
        db.connect();

        const sql = 'UPDATE notes SET ai_note = ?, ai_type = ? WHERE id = ?';
        const values = [aiResponse, 'gemini', noteId];
        await new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        db.end();

        return aiResponse;
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: `Lambda function error: ${error.message}` };
    }
};
