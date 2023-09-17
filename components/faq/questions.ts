export const faqs: FAQ[] = [
  {
    q: "How can I get beta access?",
    a: "DM quick007 on Discord for beta access",
  },
  {
    q: "Is reservations open source?",
    a: "Yes! We are open source with an Apache 2.0 licence.",
  },
  {
    q: "Is reservations free?",
    a: "We have a generous free teir that allows for a good amount of usage.",
  },
];

export interface FAQ {
  q: string;
  a: string;
}