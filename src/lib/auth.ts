import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

// 사용자 정보 타입
export type UserInfo = {
  id: number;
  userId: string;
};

// 현재 로그인된 사용자 정보 가져오기
export async function getCurrentUser(): Promise<UserInfo | null> {
  // 쿠키 저장소를 가져와서
  const cookieStore = await cookies();
  // token의 value를 빼온다
  const token = cookieStore.get("token")?.value;

  // token이 없다면 로그인이 되지 않은 상태이므로 null을 반환한다.
  if (!token) {
    return null;
  }

  // 토큰이 있다면 토큰이 맞는지 검증하고 그 정보(Payload)를 반환한다.
  // Payload에 유저의 아이디와 이메일 등이 있음.
  return verifyToken(token);
}
