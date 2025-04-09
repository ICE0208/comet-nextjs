"use server";

export async function getMainPageNovelData() {
  // mocks json 파일에서 데이터 가져오기
  const response = await import("@/mocks/mainpage-novel-data.json");
  return response.default;
}

export async function getNovelData() {
  // mocks json 파일에서 데이터 가져오기
  const response = await import("@/mocks/novelpage-novel-data.json");
  return response.default;
}

export async function getBestsellersData() {
  // mocks json 파일에서 베스트셀러 데이터 가져오기
  const response = await import("@/mocks/bestsellers.json");
  return response.default;
}
