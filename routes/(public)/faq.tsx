import { FAQ, faqs } from "@/components/faq/questions.ts";
import { pricingfaqs } from "@/components/faq/pricing.tsx";

const FAQS = () => {
  return (
    <div class="px-2 max-w-xl w-full mx-auto mb-20 flex flex-col">
      <h1 class="text-center text-4xl font-bold">faq</h1>
      <p class=" text-center mt-4">frequently asked questions</p>
      <Heading name="General" />
      {faqs.map(({ a, q }) => <QA q={q} a={a} />)}
      <Heading name="Pricing" />
      {pricingfaqs.map(({ a, q }) => <QA q={q} a={a} />)}
    </div>
  );
};

export const Heading = ({ name }: { name: string }) => (
  <div className="flex mt-10 items-center">
    <div className="invisible -translate-y-20" id={name.toLowerCase()} />
    <h2 className="font-bold">
      {name}
    </h2>
    <div class="grow ml-6 h-0.5 bg-gray-300 rounded-full" />
  </div>
);

const QA = ({ q, a }: FAQ) => (
  <div class="mt-5 ">
    <h3 class="mb-1 font-medium">{q}</h3>
    <p className="text-sm">{a}</p>
  </div>
);

export default FAQS;
