export interface Field {
  id: string;
  name: string;
  description: string;
  type: "text" | "email" | "number" | "toggle";
}

/** ["event", eventId] */
export interface Event {
  name: string;
  supportEmail: string;
  summary?: string;
  description?: string;
  banner: {
    path?: string;
    id?: string;
    fill: boolean;
    uploading: boolean;
  };
  venue?: string;

  showTimes: ShowTime[];

  multiEntry: boolean;
  additionalFields: Field[];
  price: number;

  members: { email: string; role: Roles }[];
  published: boolean;
}

export interface ShowTime {
  startDate: string;
  startTime?: string;
  endTime?: string;
  lastPurchaseDate?: string;
  id: string;
  soldTickets: number;
  maxTickets: number;
  multiPurchase: boolean;
}

export const defaultEvent: Event = {
  name: "",
  supportEmail: "",
  summary: "",
  description: "",
  banner: {
    fill: false,
    uploading: false,
  },
  published: false,
  multiEntry: true,

  showTimes: [
    {
      startDate: new Date().toString(),
      startTime: undefined,
      endTime: undefined,
      lastPurchaseDate: undefined,
      id: crypto.randomUUID(),
      soldTickets: 0,
      maxTickets: 75,
      multiPurchase: true,
    },
  ],

  venue: undefined,
  price: 0,

  additionalFields: [],
  members: [],
};

export interface FieldEntry
  extends Omit<Field, "type" | "name" | "description"> {
  value: string;
}

/** ["ticket", eventId, showtimeId, ticketId] */
export interface Ticket {
  hasBeenUsed: boolean;
  userEmail: string;
  firstName: string;
  lastName: string;
  fieldData: FieldEntry[];
}

/** ["user", email] */
export type User = UserPartial | UnonboardedUser;

export interface UnonboardedUser {
  /** Stored as eventId_showtimeId_ticketId */
  tickets: string[];
  onboarded: false;
  email: string;
}

export interface UserPartial {
  email: string;
  /** Stored as eventId_showtimeId_ticketId */
  tickets: string[];
  events: string[];
  authToken: string;
  plan: Plan;
  joinedAt: string;
  onboarded: true;
}

export const enum Roles {
  OWNER = 0, // all perms
  ADMIN = 1, // all perms
  MANAGER = 2, // all perms besides deletion
  SCANNER = 3, // can scan people in and add people in terms of tickets
  //ACCOUNTING = 4 // can manage billing only
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

/** ["authcode", email, code] */
export interface AuthCode {
  existsSince: string; // as date
}
