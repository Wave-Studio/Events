import { getUser } from "../../utils/db/kv.ts";
import CTA from "@/components/buttons/cta.tsx";
import { Heading } from "@/routes/(public)/faq.tsx";
import { plans } from "@/components/faq/plans.ts";

const Pricing = async (req: Request) => {
  const user = await getUser(req);
  const loggedIn = user != undefined;

  return (
    <div class="px-4 max-w-screen-lg w-full mx-auto mb-20">
      <h1 class="text-center text-4xl font-bold">(proposed) pricing</h1>
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
              plan.best
                ? "md:-translate-y-4 border-theme-normal border-2"
                : "border-gray-300 border"
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
              }`}
            >
              select plan
            </CTA>
          </section>
        ))}
      </div>
      <div className="grow border-gray-300 border rounded-md p-4 mt-8">
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
            contact us
          </CTA>
        </div>
      </div>
      <div class="max-w-xl w-full mx-auto">
        <h2 class="text-center text-4xl font-bold mt-16">paid event fees</h2>
        <p class=" text-center mx-auto mt-4">
          In order to run reservations, we have some basic fees that are
          applicable to event guests (guests) and event organizers (hosts). All
          prices are in USD
        </p>
        <div>
          <Heading name="Guest Applicable Fees" />
          {userFees.map((u) => Fees(u))}
        </div>
        <div>
          <Heading name="Host Applicable Fees" />
          {adminFees.map((u) => Fees(u))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

const Fees = ({ name, description, cost }: Fee) => (
  <div class="mt-5 flex justify-between items-center">
    <div>
      <h3 class="mb-1 font-medium">{name}</h3>
      <p className="text-sm max-w-sm">{description}</p>
    </div>
    <p>{cost}</p>
  </div>
);

const userFees: Fee[] = [
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
