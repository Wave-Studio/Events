import { getUser } from "../../utils/db/kv.ts";
import CTA from "@/components/buttons/cta.tsx";
import { Heading } from "@/routes/(public)/faq.tsx";
import { plans } from "@/components/faq/plans.ts";

const Pricing = async (req: Request) => {
  const user = await getUser(req);
  const loggedIn = user != undefined;

  return (
    <div class="px-4 max-w-screen-lg w-full mx-auto mb-20">
      <h1 class="text-center text-4xl font-bold">(proposed) Pricing</h1>
      <p class="max-w-xl w-full text-center mx-auto mt-4">
        To keep pricing simple, we've created 3 simple subscription plans. For
        enterprise use-cases, please contact us. reservations is currently free
        for beta testers. If you have any questions they might be in our{" "}
        <a href="/faq#pricing" class="font-medium underline">
          FAQ
        </a>
        .
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16">
        {plans.slice(0, 3).map((plan) => (
          <section
            className={`rounded-md p-4 flex flex-col relative ${
              plan.best // gradient border moment
                ? "md:-translate-y-6 h-[calc(100%+1.5rem)] border-2 border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(to_bottom,theme(colors.theme.normal),rgba(209,85,44,0)_97%)_border-box] "
                : "border-2 border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(to_bottom,theme(colors.gray.200),transparent)_border-box]"
            }`}
          >
            {plan.best && (
              <div className="absolute bg-theme-normal font-medium text-white rounded-full px-2 text-sm -top-3 left-0 right-0 w-max mx-auto">
                Best Value
              </div>
            )}
            <div className="flex">
              <div
                className={`rounded-full px-1 py-0.5 mr-2 ${plan.color} `}
              ></div>
              <h2 class="font-bold ">{plan.name}</h2>
              <p className="ml-auto text-gray-600 ">
                {plan.cost == 0 ? "0.00" : `${plan.cost}/mo`}
              </p>
            </div>
            <ul class="text-sm flex flex-col gap-2 mt-6 list-disc list-inside mb-8">
              {plan.features.map((feature) => (
                <li>{feature}</li>
              ))}
            </ul>
            <CTA
              btnType={plan.cost == 0 ? "secondary" : "cta"}
              className={`!w-full mt-auto ${plan.color} ${
                plan.cost == 0 && "!text-gray-900 !bg-gray-300"
              } ${plan.cost == 11.99 && "rffesfs"}`}
            >
              Select Plan
            </CTA>
          </section>
        ))}
      </div>
      <div className="grow rounded-md  p-4 pt-8">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <div className="flex">
              <div
                className={`rounded-full px-1 py-0.5 mr-2 ${plans[3].color} `}
              ></div>
              <h2 class="font-bold ">{plans[3].name}</h2>
            </div>
            <p className="text-sm mt-4">
              Contact us for a plan that suits your needs.
            </p>
          </div>
          <CTA
            btnType="secondary"
            size="sm"
            className="my-auto mx-auto mt-4 w-full sm:mr-0 sm:w-40 sm:mt-auto"
          >
            Contact Us
          </CTA>
        </div>
      </div>
      <div class="max-w-xl w-full mx-auto">
        <h2 class="text-center text-4xl font-bold mt-16">Paid Event Fees</h2>
        <p class=" text-center mx-auto mt-4">
          In order to run reservations, we have some basic fees that are
          applicable to event guests (guests) and event organizers (hosts).
          Guests have to pay fees that may be used for proccessing, handling,
          and delivery. All prices are in USD
        </p>
        <div>
          <Heading name="Host Applicable Fees" />
          {adminFees.map((u) => Fees(u))}
        </div>
        <details className="mt-6">
          <summary class="text-sm cursor-pointer list-none underline">
            Guest Applicable Fees
          </summary>
          <p className="mt-2 text-center">
            When checking out, guests will have to pay the fees listed below and
            may be subject to paying taxes. These help us cover the costs of the
            platform and things like transaction fees.
          </p>
          <div class="-translate-y-6">
            <Heading name="Guest Applicable Fees" />
            {userFees.map((u) => Fees(u))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default Pricing;

export const Fees = ({ name, description, cost }: Fee) => (
  <div class="mt-5 flex justify-between items-center">
    <div>
      <h3 class="mb-1 font-medium">{name}</h3>
      <p className="text-sm max-w-sm">{description}</p>
    </div>
    <p>{cost}</p>
  </div>
);

export const userFees: Fee[] = [
  {
    name: "Processing",
    description: "Payment proccessing and other costs",
    cost: "12% + 49¢",
  },
  {
    name: "Handling",
    description: "Cost of handling ticket and other costs",
    cost: "10¢",
  },
  {
    name: "Delivery",
    description: "Delivery and other costs",
    cost: "5¢",
  },
];

const adminFees: Fee[] = [
  {
    name: "Chargebacks",
    description:
      "We will be in touch with you and give a partial/full refund to you if the chargeback is denied",
    cost: "$15 + ticket cost",
  },
];

interface Fee {
  name: string;
  description: string;
  cost: string;
}
