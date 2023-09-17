import { getUser } from "../../utils/db/kv.ts";
import CTA from "@/components/buttons/cta.tsx";

const Pricing = async (req: Request) => {
  const user = await getUser(req);
  const loggedIn = user != undefined;

  return (
    <div class="px-2 max-w-screen-lg w-full mx-auto mb-20">
      <h1 class="text-center text-4xl font-bold">(proposed) pricing</h1>
      <p class="max-w-xl w-full text-center mx-auto mt-4">
        To keep pricing simple, we've created 3 simple subscription plans. For
        enterprise use-cases, please contact us. reservations is currently free
        for beta testers. If you have any questions they might be in our{" "}
        <a href="/faq#pricing" class="font-medium underline">FAQ</a>.
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
              >
              </div>
              <h2 class="font-bold ">{plan.name}</h2>
              <p className="ml-auto text-gray-600 ">
                {plan.cost == 0 ? "0.00" : `${plan.cost}.00/mo`}
              </p>
            </div>
            <ul class="text-sm flex flex-col gap-2 mt-6 list-disc list-inside mb-8">
              {plan.features.map((feature) => <li>{feature}</li>)}
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
              >
              </div>
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
    </div>
  );
};

export default Pricing;

const plans: {
  name: string;
  cost: number;
  features: string[];
  best: boolean;
  color: string;
}[] = [
  {
    name: "Free Forever",
    best: false,
    cost: 0.0,
    features: [
      "1 concurrent event",
      "2 team slots",
      "Up to 75 attendees per event",
      "Host free and paid events",
      "10 day post-event persistance",
    ],
    color: "bg-gray-300",
  },
  {
    name: "Plus",
    best: true,
    cost: 12.0,
    features: [
      "2 concurrent events",
      "Purchase additional concurrent event slots for $9 each",
      "10 team slots",
      "30 day post-event persistance",
      "Up to 250 attendees per event",
      "Host free and paid events",
      "Basic email customization",
      "Event color themes",
    ],
    color: "bg-theme-normal",
  },
  {
    name: "Pro",
    cost: 25.0,
    best: false,
    features: [
      "4 concurrent events",
      "Purchase additional concurrent event slots for $5 each",
      "25 team slots",
      "60 day post-event persistance",
      "Purchase additional team slots for $1 each",
      "Up to 500 attendees per event",
      "Host free and paid events",
      "Full event and email customization",
      "Event color themes",
    ],
    color: "bg-gradient-to-br from-purple-500 to-purple-700",
  },
  {
    name: "Enterprise",
    cost: -1,
    best: false,
    features: ["only for one event", "up to 500 attendees", "25 team slots"],
    color: "bg-blue-800",
  },
];
