const DUST_SIDO = {
  ALL_COUNTRY: "전국",
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  GYEONGGI: "경기",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
  SEJONG: "세종",
};

export const getDustAddress = (address) => {
  if (address.includes("서울특별시")) return DUST_SIDO.SEOUL;
  if (address.includes("부산광역시")) return DUST_SIDO.BUSAN;
  if (address.includes("대구광역시")) return DUST_SIDO.DAEGU;
  if (address.includes("인천광역시")) return DUST_SIDO.INCHEON;
  if (address.includes("광주광역시")) return DUST_SIDO.GWANGJU;
  if (address.includes("대전광역시")) return DUST_SIDO.DAEJEON;
  if (address.includes("울산광역시")) return DUST_SIDO.ULSAN;
  if (address.includes("경기도")) return DUST_SIDO.GYEONGGI;
  if (address.includes("강원특별자치도")) return DUST_SIDO.GANGWON;
  if (address.includes("충청북도")) return DUST_SIDO.CHUNGBUK;
  if (address.includes("충청남도")) return DUST_SIDO.CHUNGNAM;
  if (address.includes("전북특별자치도")) return DUST_SIDO.JEONBUK;
  if (address.includes("전라남도")) return DUST_SIDO.JEONNAM;
  if (address.includes("경상북도")) return DUST_SIDO.GYEONGBUK;
  if (address.includes("경상남도")) return DUST_SIDO.GYEONGNAM;
  if (address.includes("제주특별자치도")) return DUST_SIDO.JEJU;
  if (address.includes("세종특별자치시")) return DUST_SIDO.SEJONG;
  return DUST_SIDO.ALL_COUNTRY;
};
