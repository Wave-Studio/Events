import { FAQ } from "@/components/faq/questions.ts";

export const pricingfaqs: FAQ[] = [
  {
    q: "How do I get more of...?",
    a: "To get more of a specific feature, you can upgrade your plan. Contact us if you have requierments outside of our pricing teirs. ",
  },
  {
    q: "What counts as a concurrent event?",
    a: "Concurrent events are events that are currently open for registration and have not ended. You need at least one concurrent event slot to create a new event.",
  },
  {
    q: "When do I get more concurrent event slots?",
    a: "You obtain concurrent event slots when an event you were hosting has ended or you have purchased a slot or plan.",
  },
  {
    q: "What is a team slot?",
    a: "Team slots are used for people who are part of managing the event, this role would be given to people who check in attendees, manage the event, or manage the event's registration.",
  },
  {
    q: "What is post-event persistance?",
    a: "Post-event persistance is the amount of time an event stays on your account after the date of the event before it gets auto deleted. Pro plan users will gave their events archived instead of deleted.",
  },
  {
    q: "What does it mean to have my event archived?",
    a: "Your event will no longer show up for event team members or event attendees.",
  },
  {
    q: "How much customization do I get with 'Basic email customization'",
    a: "You'll be able to customize the email sender name, subject like, and provide a short message to attendes.",
  },
  {
    q: "How much customization do I get with 'Full event and email customization'",
    a: (
      <>
        You'll have all the customization from the Plus plan along with:
        <ul class="list-inside list-disc text-sm">
          <li>Custom theme color for email</li>
          <li>
            Upload event logo to use in emails and on the bottom of our event
          </li>
          <li>
            Ability to remove some of our marketing and branding from emails
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "What additional fees are there with paid tickets?",
    a: (
      <>
        You can see all fees on our <a href="/pricing">Pricing Page</a>
      </>
    ),
  },
  {
    q: "What happends when I downgrade my plan?",
    a: "Your events will be downgraded to your new plan's limits. You will be asked to select which events to keep if you exceed your new plan's limits. The maximum number of attendees for each event will also be reduced to your new plan's max attendee limit.",
  },
  {
    q: "How can I change permissions of my team?",
    a: "Currently there is no way to change user permissions other than removing and adding a user.",
  },
  {
    q: "What are 'Event color themes'",
    a: "We provide a diverse set of hand crafted color palletes that can be used to change the look and feel of your event page.",
  },
  {
    q: "Are any charges refundable?",
    a: "If you would like to enquire if you could obtain a refund please contact us. Attempting to chargeback a payment will result in a permanant ban of your account and blacklist of your email from all Wave Studios services.",
  },
];
