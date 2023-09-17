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
  description: string;
  bannerImage?: string;
  published: boolean;
  multiEntry: boolean;

  maxTickets?: number;
  startDate: string;
  startTime?: string;
  endTime?: string;
  lastPurchaseDate?: string;

  location?: string;
  soldTickets: number;
  price: number;

  additionalFields: Field[];
}

export interface FieldEntry extends Omit<Field, 'type' | 'name' | 'description'> {
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
}

// ["authcode", email, code] 
export interface AuthCode {
  existsSince: string // as date
}