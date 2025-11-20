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

export const dtToDateTime = (dt = 1763301600) => {
  const date = new Date(parseInt(dt) * 1000);
  return date.toString();
};

export const dateTimeToDt = (date) => {
  const dt = Math.floor(date.getTime() / 1000);
  return dt;
};

export const spliceMinutesFromDateTime = (date) => {
  date.setMinutes(0, 0, 0);
  return date.getTime();
};

export const spliceMinutesFromDt = (dt) => {
  const date = new Date(dt);
  date.setMinutes(0, 0, 0);
  return dateTimeToDt(date);
};

export const spliceHoursFromDateTime = (date) => {
  date.setHours(0, 0, 0, 0);
  return dateTimeToDt(date);
};

export const spliceHoursFromDt = (dt) => {
  const date = new Date(dt);
  date.setHours(0, 0, 0, 0);
  return dateTimeToDt(date);
};

export const timeDiffInHours = (startTime, endTime) => {
  const diffInMs = endTime - startTime;
  return diffInMs / (1000 * 60 * 60);
};
