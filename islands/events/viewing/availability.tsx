import { JSX } from "preact";
import CalenderOff from "$tabler/calendar-off.tsx";
import Check from "$tabler/circle-check.tsx";
import Warn from "$tabler/alert-circle.tsx";
import Urgent from "$tabler/urgent.tsx";

export const Availability = ({
  maxTickets,
  tickets,
  happened,
  windowClosed,
  acquired,
}: {
  acquired?: boolean;
  tickets: number;
  maxTickets: number;
  happened: boolean;
  windowClosed: boolean;
}): JSX.Element => {
  // semi-jank solution
  const className = "flex items-center [&>svg]:w-5 [&>svg]:mr-2";
  const messages: JSX.Element[] = [
    <p class={`text-green-500 ${className}`}>
      <Check /> Tickets Available
    </p>,
    <p class={`text-amber-500 flex ${className}`}>
      <Warn /> Some Tickets Available
    </p>,
    <p class={`text-orange-600 flex ${className}`}>
      <Warn /> Few Tickets Left
    </p>,
    <p class={`text-red-500 flex ${className}`}>
      <Urgent /> {maxTickets - tickets} Tickets Left
    </p>,
    <p class={`text-red-500 flex ${className}`}>
      <CalenderOff /> Already occurred
    </p>,
    <p class={`text-red-500 flex ${className}`}>
      <CalenderOff /> Purchase window closed
    </p>,
    <p class={`text-blue-500 ${className}`}>
      <Check /> Tickets Acquired
    </p>,
  ];

  if (happened) return messages[4];

  if (acquired) return messages[6];

  if (windowClosed) return messages[5];

  if (maxTickets - tickets < 10) return messages[3];

  const divisor = tickets / maxTickets;

  if (divisor < 0.6) return messages[0];
  if (divisor < 0.7) return messages[1];
  return messages[2];
};
