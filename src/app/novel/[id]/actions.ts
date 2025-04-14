"use server";

export async function getNovelInfoData() {
  // mocks json 파일에서 데이터 가져오기
  const response = await import("@/mocks/novelinfo-novel-data.json");
  return response.default;
}
