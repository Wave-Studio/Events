import { JSX } from "preact";
import CalenderOff from "$tabler/calendar-off.tsx";
import Check from "$tabler/circle-check.tsx";
import Warn from "$tabler/alert-circle.tsx";
import Urgent from "$tabler/urgent.tsx";

export const Avalibility = ({
	maxTickets,
	tickets,
	happened,
	windowClosed
}: {
	tickets: number;
	maxTickets: number;
	happened: boolean;
	windowClosed: boolean;
}): JSX.Element => {
	// semi-jank solution
	const className = "flex items-center [&>svg]:w-5 [&>svg]:mr-2";
	const messages: JSX.Element[] = [
		<p class={`text-green-500 ${className}`}>
			<Check /> Tickets Avalible
		</p>,
		<p class={`text-amber-500 flex ${className}`}>
			<Warn /> Some Tickets Avalible
		</p>,
		<p class={`text-orange-600 flex ${className}`}>
			<Warn /> Few Tickets Left
		</p>,
		<p class={`text-red-500 flex ${className}`}>
			<Urgent /> {maxTickets - tickets} Tickets Left
		</p>,
		<p class={`text-red-500 flex ${className}`}>
			<CalenderOff /> Already occured
		</p>,
		<p class={`text-red-500 flex ${className}`}>
			<CalenderOff /> Purchase window closed
		</p>,
	];

	if (happened) return messages[4];

	if (windowClosed) return messages[5];

	if (maxTickets - tickets < 10) return messages[3];

	const diviser = tickets / maxTickets;

	if (diviser < 0.6) return messages[0];
	if (diviser < 0.7) return messages[1];
	return messages[2];
};