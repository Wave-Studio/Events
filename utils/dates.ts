const dateFmt = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
	hour12: true,
	hour: "numeric",
});

export const happened = (startDate: string, startTime?: string) => {
	const date = new Date(startDate);
	if (startTime) {
		// 5 min buffer for tickets
		date.setMinutes(new Date(startTime).getMinutes() + 5);
	} else {
		date.setDate(date.getDate() + 1);
	}
	return date.getTime() < Date.now();
};

export const fmtDate = (date: Date) => dateFmt.format(date);
export const fmtTime = (date: Date) => timeFmt.format(date);