export const getFormattedToday = (type = "none") => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return type === "none" ? `${year}${month}${day}` : `${year}-${month}-${day}`;
};

export const getFormattedYesterday = (type = "none") => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");
  return type === "none" ? `${year}${month}${day}` : `${year}-${month}-${day}`;
};

export const getFormattedDate = (date, type = "none") => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return type === "none" ? `${year}${month}${day}` : `${year}-${month}-${day}`;
};

export const getFormattedTime = (date, type = "none") => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return type === "none" ? `${hours}${minutes}` : `${hours}:${minutes}`;
};
