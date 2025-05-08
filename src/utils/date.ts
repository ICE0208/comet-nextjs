/**
 * 날짜와 시간을 포맷팅하는 함수
 * @param date 포맷팅할 날짜
 * @returns 포맷팅된 날짜와 시간 문자열 (예: 2023.05.20)
 */
export function formatDateTime(date: Date): string {
  if (!date) return "없음";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

/**
 * 상대적인 시간을 계산하는 함수
 * @param date 계산할 날짜
 * @returns 상대적인 시간 문자열 (예: 3시간 전, 2일 전)
 */
export function formatRelativeTime(date: Date): string {
  if (!date) return "없음";

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSecs < 60) {
    return "방금 전";
  } else if (diffInMins < 60) {
    return `${diffInMins}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else if (diffInWeeks < 5) {
    return `${diffInWeeks}주 전`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  } else {
    return `${diffInYears}년 전`;
  }
}
