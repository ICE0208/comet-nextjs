import { getCurrentUser } from "@/lib/auth";
import { HeaderClient } from "./header-client";
import { redirect } from "next/navigation";
export default async function Header() {
  // 현재 로그인된 사용자 정보 가져오기
  // 서버 컴포넌트라 await으로 가져올 수 있다.
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  // 서버 컴포넌트(현재 컴포넌트)에서 가져온 user의 정보와 함께
  // 클라이언트 컴포넌트인 HeaderClient로 넘겨준다.
  // 실질적인 렌더링은 HeaderClient가 담당한다.
  return <HeaderClient user={user} />;
}
