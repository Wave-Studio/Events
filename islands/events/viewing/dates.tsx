import { fmtDate } from "@/utils/dates.ts";

// bit of a hack, bassiclly just takes the date, chops off the timezone, and gets the date wherever the user is
export const ClientDate = ({ date }: { date: string }) => (
  <>{fmtDate(new Date(date.split("GMT")[0]))}</>
);

export const ClientDateTimezone = ({ date }: { date: string }) => (
  <>{fmtDate(new Date(date))}</>
);
