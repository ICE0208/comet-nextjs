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

export async function getNovelInfoData() {
  // mocks json 파일에서 데이터 가져오기
  const response = await import("@/mocks/novelinfo-novel-data.json");
  return response.default;
}

export async function getNovelContentsData() {
  // mocks json 파일에서 데이터 가져오기
  const response = await import("@/mocks/novelcontents-novel-data.json");
  return response.default;
}
