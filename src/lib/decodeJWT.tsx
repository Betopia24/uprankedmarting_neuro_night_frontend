function decodeJWT(token: string) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0." +
  "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

console.log(decodeJWT(token));
// { sub: "1234567890", name: "John Doe", admin: true, iat: 1516239022 }
