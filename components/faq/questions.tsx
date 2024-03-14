import { ComponentChildren } from "preact";

export const faqs: FAQ[] = [
  {
    q: "How do I contact Events?",
    a: (
      <>
        You can contact us at{" "}
        <a
          href="mailto:support@events-help.freshdesk.com"
          class="underline font-medium"
        >
          support@events-help.freshdesk.com
        </a>
      </>
    ),
  },
  {
    q: "How can I get alpha access?",
    a: "We are currently in a closed alpha and not accepting new clients",
  },
  {
    q: "Is Events open source?",
    a: "Yes! We are open source with an Apache 2.0 license.",
  },
  {
    q: "Is Events free?",
    a: "We have a generous free tier that allows for a decent amount of usage. You can easily run a small to medium sized event for free!",
  },
  {
    q: "Can users register after my event has started?",
    a: "By default, users can sign up before the event and a few minutes after it has started.",
  },
  {
    q: "How do timezones work for events without a time?",
    a: "Events without a specific time of day set will always have the same date, regardless of timezone. Note that the event settings page may display an incorrect date if you're in a different timezone than when the date was selected.",
  },
  {
    q: "How do timezones work for events with a time?",
    a: "Events with a time of day set will always convert to the user's timezone that is viewing the event. The event settings page will do it's best to convert to the user's local timezone.",
  },
];

export interface FAQ {
  q: string;
  a: ComponentChildren;
}
