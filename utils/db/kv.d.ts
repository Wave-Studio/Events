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
export interface User {
  email: string;
  name: string;
  /** Stored as eventId-ticketId */
  tickets: string[];
  events: string[];
  authToken: string;
}