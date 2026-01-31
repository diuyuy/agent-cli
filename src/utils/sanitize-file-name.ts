/**
 * 사용자 입력 query를 안전한 파일 이름으로 변환
 * @param query 사용자 입력 문자열
 * @param maxLength 최대 파일명 길이 (기본값: 255)
 * @returns 안전한 파일 이름
 */
export function sanitizeFileName(
  query: string,
  maxLength: number = 255,
): string {
  // 1. 앞뒤 공백 제거
  let fileName = query.trim();

  // 2. 파일 시스템에서 금지된 문자 제거/대체
  // Windows: < > : " / \ | ? *
  // Unix/Linux: /
  // 추가로 제어 문자(0x00-0x1f)도 제거
  fileName = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");

  // 3. 연속된 공백을 하나의 공백으로 변환
  fileName = fileName.replace(/\s+/g, " ");

  // 4. 마침표로 시작하는 파일명 처리 (숨김 파일 방지)
  if (fileName.startsWith(".")) {
    fileName = "_" + fileName;
  }

  // 5. 마침표로 끝나는 파일명 처리 (Windows에서 문제 발생)
  fileName = fileName.replace(/\.+$/, "");

  // 6. Windows 예약어 처리
  const reservedNames = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ];

  const nameWithoutExt = fileName.split(".")[0]?.toUpperCase() ?? "";
  if (reservedNames.includes(nameWithoutExt)) {
    fileName = "_" + fileName;
  }

  // 7. 최대 길이 제한 (확장자 고려)
  if (fileName.length > maxLength) {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex > 0) {
      // 확장자가 있는 경우
      const ext = fileName.substring(lastDotIndex);
      const name = fileName.substring(0, lastDotIndex);
      fileName = name.substring(0, maxLength - ext.length) + ext;
    } else {
      // 확장자가 없는 경우
      fileName = fileName.substring(0, maxLength);
    }
  }

  // 8. 빈 문자열 처리
  if (fileName.length === 0) {
    fileName = "untitled";
  }

  return fileName;
}
