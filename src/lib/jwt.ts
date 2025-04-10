import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// JWT 비밀키 체크 (없으면 에러 발생)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET 환경 변수가 설정되지 않았습니다. JWT 인증을 사용하려면 이 값이 필요합니다."
  );
}

// JWT가 가지고 있는 사용자의 정보
interface JWTPayload {
  id: number;
  userId: string;
}

// 사용자 정보에 따라 JWT 토큰 생성
export function generateToken(payload: JWTPayload): string {
  // 영구 토큰 생성 (만료 시간 없음)
  // 추후 토큰 만료시간 설정해야함!
  // 리프레시 토큰 기법 도입해야함!
  return jwt.sign(payload, JWT_SECRET!);
}

// JWT 토큰이 서버만 아는 값인 비밀키로 서명된 값인지 검증하는 과정
export function verifyToken(token: string): JWTPayload | null {
  try {
    // 검증에 실패(서버의 비밀키로 서명된 값이 아님)했을 때 에러를 발생시킴 -> catch로 이동
    return jwt.verify(token, JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}

// 쿠키에서 JWT 토큰 가져오기
export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// JWT 토큰으로 사용자 인증 확인
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies();
  // 토큰이 없으면 False,
  // 토큰이 있을 경우 검증한 뒤 True or False
  return token ? !!verifyToken(token) : false;
}
