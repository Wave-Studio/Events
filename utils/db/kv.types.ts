export interface Field {
  id: string;
  name: string;
  description: string;
  type: "text" | "email" | "number" | "checkbox";
}

// ["event", eventId]
export interface Event {
  name: string;
  supportEmail: string;
  description?: string;
  bannerImage?: string;
  venue?: string;

  showTimes: {
    startDate: string;
    startTime?: string;
    endTime?: string;
    lastPurchaseDate?: string;
  }[];

  multiEntry: boolean;
  maxTickets?: number;
  additionalFields: Field[];

  soldTickets: number;
  price: number;
  owner: string;
  published: boolean;
}

export const defaultEvent = (email: string): Event => ({
  name: "",
  supportEmail: "",
  description: "",
  bannerImage: undefined,
  published: false,
  multiEntry: true,

  maxTickets: 75,
  showTimes: [
    {
      startDate: new Date().toString(),
      startTime: new Date().toString(),
      endTime: undefined,
      lastPurchaseDate: undefined,
    },
  ],

  venue: undefined,
  soldTickets: 0,
  price: 0,

  additionalFields: [],
  owner: email,
});

export interface FieldEntry
  extends Omit<Field, "type" | "name" | "description"> {
  value: string;
}

// ["ticket", eventId, ticketId]
export interface Ticket {
  hasBeenUsed: boolean;
  userEmail: string;
  userName: string;

  fieldData: FieldEntry[];
}

// ["user", email]
export type User = OnboardedUser | UnonboardedUser;

export interface OnboardedUser extends UserPartial {
  name: string;
  onboarded: true;
}

export interface UnonboardedUser extends UserPartial {
  name?: string;
  onboarded: false;
}

export interface UserPartial {
  email: string;
  /** Stored as eventId-ticketId */
  tickets: string[];
  events: string[];
  authToken: string;
  plan: Plan;
  joinedAt: string;
}

export const enum Plan {
  BASIC = "basic",
  PLUS = "plus",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

// ["authcode", email, code]
export interface AuthCode {
  existsSince: string; // as date
}
