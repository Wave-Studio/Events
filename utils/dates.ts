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
	minute: "2-digit"
});

export const happened = (startDate: string, startTime?: string) => {
	const date = new Date(startDate);

	if (startTime) {
		// 5 min buffer for tickets
		date.setMinutes(new Date(startTime).getMinutes() + 5);
	} else {
		date.setDate(date.getDate() + 1);
	}

	return date.valueOf() < Date.now();
};

export const fmtDate = (date: Date) => dateFmt.format(date);
export const fmtHour = (date: Date) => hourFmt.format(date);
export const fmtTime = (date: Date) => timeFmt.format(date);