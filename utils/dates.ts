const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const hourFmt = new Intl.DateTimeFormat("en-US", {
  hour12: true,
  hour: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour12: true,
  hour: "numeric",
  minute: "2-digit",
});
const timezoneFmt = new Intl.DateTimeFormat("en-US", {
  timeZoneName: "short",
});

export const happened = (startDate: string, startTime?: string) => {
  const date = new Date(startDate);

  if (startTime) {
    // 5 min buffer for tickets if someone arrives late
    date.setMinutes(new Date(startTime).getMinutes() + 5);
  } else {
    date.setDate(date.getDate() + 1);
  }

  return date.valueOf() < Date.now();
};

export const fmtDate = (date: Date) => dateFmt.format(date);
export const fmtHour = (date: Date) => hourFmt.format(date);
export const fmtTime = (date: Date) => timeFmt.format(date);
// not an ideal solution
export const getTimeZone = (date: Date) =>
  date.toString().split("(")[1].slice(undefined, date.toString().split("(")[1].length - 1);
