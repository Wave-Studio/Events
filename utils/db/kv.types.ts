export interface Field {
  id: string;
  name: string;
  description: string;
  type: "text" | "email" | "number" | "toggle";
}

// ["event", eventId]
export interface Event {
  name: string;
  supportEmail: string;
  description?: string;
  banner: {
    path?: string;
    id?: string;
    fill: boolean,
    uploading: boolean
  };
  venue?: string;

  showTimes: {
    startDate: string;
    startTime?: string;
    endTime?: string;
    lastPurchaseDate?: string;
    id: string;
  }[];

  multiEntry: boolean;
  multiPurchase: boolean;
  maxTickets?: number;
  additionalFields: Field[];
  price: number;

  soldTickets: number;
  members: { email: string; role: Roles }[];
  published: boolean;
}

export const defaultEvent : Event= {
  name: "",
  supportEmail: "",
  description: "",
  banner: {
    fill: false,
    uploading: false,
  },
  published: false,
  multiEntry: true,

  maxTickets: 75,
  showTimes: [
    {
      startDate: new Date().toString(),
      startTime: undefined,
      endTime: undefined,
      lastPurchaseDate: undefined,
      id: crypto.randomUUID(),
    },
  ],

  multiPurchase: true,
  venue: undefined,
  soldTickets: 0,
  price: 0,

  additionalFields: [],
  members: [],
};

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

export const enum Roles {
  OWNER = 0,
  ADMIN = 1,
}

export const enum Plan {
  BASIC = "basic",
  PLUS = "plus",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export const PlanMaxEvents = {
  [Plan.BASIC]: 1,
  [Plan.PLUS]: 5,
  [Plan.PRO]: 10,
  [Plan.ENTERPRISE]: Infinity,
};

// ["authcode", email, code]
export interface AuthCode {
  existsSince: string; // as date
}
