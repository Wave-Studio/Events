import * as Yup from "yup";

const dateTransformer = (_: undefined, originalValue: string) => {
  const date = new Date(originalValue);

  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

// temp set to 1 max showtime, will increase with pro plan and future updates
const YupShowtimeValidation = Yup.array()
  .min(1)
  .max(2)
  .required()
  .of(
    Yup.object({
      startDate: Yup.date().transform(dateTransformer).required(),
      startTime: Yup.date().transform(dateTransformer),
      endTime: Yup.date().transform(dateTransformer),
      lastPurchaseDate: Yup.date().transform(dateTransformer),
      id: Yup.string().uuid().required(),
    }),
  );

export const YupFirstPageEventValidation = {
  name: Yup.string()
    .min(3, "The name of your event must be at least 3 characters")
    .max(75, "The name of your event must be at least 3 characters")
    .required("Please add a name for your event"),
  supportEmail: Yup.string()
    .email("Enter a valid support email")
    .required("We require a support email for all events"),
  summary: Yup.string().max(200),
  description: Yup.string().max(2500),
  venue: Yup.string().max(150),
};

const YupSecondPageEventValidation = {
  ...YupFirstPageEventValidation,
  showTimes: YupShowtimeValidation,
};

const YupThirdPageEventValidation = {
  ...YupSecondPageEventValidation,
};

export const FirstPageEventValidation = Yup.object(YupFirstPageEventValidation);

export const SecondPageEventValidation = Yup.object(
  YupSecondPageEventValidation,
);

export const ThirdPageEventValidation = Yup.object(YupThirdPageEventValidation);

export const FullEventValidation = Yup.object({
  ...YupThirdPageEventValidation,

  multiEntry: Yup.boolean().required(),
  multiPurchase: Yup.boolean().required(),
  maxTickets: Yup.number(),
  additionalFields: Yup.array()
    .min(0)
    .max(12)
    .required()
    .of(
      Yup.object({
        id: Yup.string().uuid().required(),
        name: Yup.string().min(3).max(35),
        description: Yup.string().max(100),
        type: Yup.string().matches(/^(text|email|number|toggle)$/g),
      }),
    ),
  price: Yup.number().required(),

  soldTickets: Yup.number().required().min(0),
  owner: Yup.string().max(200),
  published: Yup.boolean().required(),
});