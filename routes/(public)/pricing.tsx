const Pricing = async () => {

	const user = await getUser(req);
  const loggedIn = user != undefined;

  return (
    <div class="px-2 max-w-screen-lg w-full mx-auto">
      <h1 class="text-center text-4xl font-bold">(proposed) pricing</h1>
      <div className="grid grid-cols-3 gap-8 mt-16">
        {plans.slice(0, 3).map((plan) => (
          <section
            className={`rounded p-4  relative ${
              plan.best
                ? "-translate-y-4 border-theme-normal border-2"
                : "border-gray-300 border"
            }`}
          >
            {plan.best && (
              <div className="absolute bg-theme-normal font-medium text-white rounded-full px-2 text-sm -top-3 left-0 right-0 w-max mx-auto">
                Best Value
              </div>
            )}
            <div className="flex">
              <div className="rounded-full px-1 py-0.5 mr-2 bg-theme-normal"></div>
              <h2 class="font-bold ">{plan.name}</h2>
            </div>
          </section>
        ))}
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
}[] = [
  {
    name: "free forever",
    best: false,
    cost: 0.0,
    features: [
      "2 concurrent events",
      "2 additional team slots",
      "Up to 75 attendees per event",
    ],
  },
  {
    name: "plus",
    best: true,
    cost: 12.0,
    features: [
      "2 concurrent events",
      "Purchase additional concurrent event slots for $9 each",
      "10 additional team slots",
      "Up to 250 attendees per event",
      "Event color themes",
    ],
  },
  {
    name: "pro",
    cost: 25.0,
    best: false,
    features: [
      "4 concurrent events",
      "Purchase additional concurrent event slots for $5 each",
      "25 additional team slots",
      "Purchase additional team slots for $1 each",
      "Up to 500 attendees per event",
      "Event color themes",
    ],
  },
  {
    name: "One Time",
    cost: 20,
    best: false,
    features: ["only for one event", "up to 500 attendees", "25 team slots"],
  },
];