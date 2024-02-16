import { ShowTime } from "@/utils/db/kv.ts";

export const fixDate = (showTimes: ShowTime[]) => showTimes.map((showTime) => {
	if (!showTime.startTime) return showTime;
	const date = new Date(showTime.startDate);
	const time = new Date(showTime.startTime);

	if (time) {
		date.setHours(time.getHours());
		date.setMinutes(time.getMinutes());
	} else {
		// remove the hours and just display as normal if user doesn't add a start date
		date.setHours(0);
		date.setMinutes(0);
	}

	return {
		...showTime,
		startDate: date.toString(),
	};
})