import { Event, Roles, User } from "@/utils/db/kv.ts";
import { happened,fmtDate,fmtTime } from "@/utils/dates.ts";
import { Avalibility } from "@/islands/events/viewing/availability.tsx";
import { EventContext } from "@/routes/events/[id]/_layout.tsx";

export const ShowTimes = ({event, user}: {event: Event, user: EventContext["data"]["user"]}) => {
	if (event.showTimes.length == 1) return null;

	return (
		<>
			<h2 class="font-bold text-xl mt-6 mb-2">Event Times</h2>
			<div class="flex overflow-x-auto snap-x gap-4 scrollbar-fancy">
				{event.showTimes
					.filter((time) => {
						if (user && user.role != undefined) return true;
						return !happened(time.startDate, time.startTime);
					})
					.sort((a, b) => new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf())
					.map((time) => (
						<div class="rounded-md border p-4 snap-start w-72 min-w-[18rem] select-none flex flex-col">
							<p class="font-medium">
								{fmtDate(new Date(time.startDate))}{" "}
								<span class="lowercase">
									{time.startTime &&
										`(${fmtTime(new Date(time.startTime))}${
											time.endTime
												? ` - ${fmtTime(new Date(time.endTime))}`
												: ""
										})`}
								</span>
							</p>
							<div class="flex flex-col gap-2 text-sm last:mt-auto">
								{time.lastPurchaseDate && (
									<p>
										<span class="text-gray-600">Sales end</span>{" "}
										{fmtDate(new Date(time.lastPurchaseDate))}
									</p>
								)}
								{
									<Avalibility
										maxTickets={time.maxTickets}
										tickets={time.soldTickets}
										happened={happened(time.startDate, time.startTime)}
										windowClosed={time.lastPurchaseDate != undefined ? happened(time.lastPurchaseDate!) : false}
									/>
								}
							</div>
						</div>
					))}
			</div>
			{user?.role != undefined && (
				<p class="text-center mt-2 italic text-sm">
					Event times that already occured aren't shown to users
				</p>
			)}
		</>
	);
};