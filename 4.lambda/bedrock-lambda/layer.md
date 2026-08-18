# pymysql 레이어

`pymysql_layer.zip`이 이미 저장소에 있다. 다시 만들어야 할 때만 아래를 실행한다.

```
mkdir python
pip install pymysql -t python/
zip -r pymysql_layer.zip python/
rm -rf python
```

Lambda 콘솔 > 계층(Layers)에서 이 zip을 업로드하고 함수에 연결한다.

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| `DB_HOST` | RDS 엔드포인트 |
| `DB_USER` | DB 사용자 |
| `DB_PASSWORD` | DB 비밀번호 |
| `DB_NAME` | DB 이름 |

네 개 모두 필수다. 하나라도 없으면 `KeyError`로 실패한다.

## 실행 역할 권한

실행 역할에 `bedrock:InvokeModel` 권한이 있어야 한다.

```json
{
  "Effect": "Allow",
  "Action": "bedrock:InvokeModel",
  "Resource": "*"
}
```

## 모델 액세스

Bedrock 콘솔에서 **us-east-1** 리전을 선택하고 Model access 메뉴에서
`amazon.nova-lite-v1:0`(Amazon Nova Lite) 액세스를 활성화해야 한다.
활성화하지 않으면 `AccessDeniedException`이 발생한다.
