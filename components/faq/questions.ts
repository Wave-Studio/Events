import { ComponentChildren } from "preact";

export const faqs: FAQ[] = [
  {
    q: "How can I get beta access?",
    a: "DM quick007 on Discord for beta access",
  },
  {
    q: "Is Events open source?",
    a: "Yes! We are open source with an Apache 2.0 licence.",
  },
  {
    q: "Is Events free?",
    a: "We have a generous free teir that allows for a good amount of usage.",
  },
  {
    q: "Can users register after my event has started?",
    a: "By default, users can sign up before the event and a few minutes into it. You can change this in your event settings.",
  },
];

export interface FAQ {
  q: string;
  a: ComponentChildren;
}
