"use server";

export async function getMainPageNovelData() {
  // mocks json 파일에서 데이터 가져오기
  const response = await import("@/mocks/mainpage-novel-data.json");
  return response.default;
}
