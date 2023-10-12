const dateFmt = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
	hour12: true,
	hour: "numeric",
});

export const fmtDate = (date: Date) => dateFmt.format(date);
export const fmtTime = (date: Date) => timeFmt.format(date);