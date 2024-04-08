import { Ticket } from "@/utils/db/kv.types.ts";

export enum ScanningState {
  LOADING = "loading",
  READY = "ready",
  INVALID = "invalid",
  VALID = "valid",
  USED = "used",
  INACTIVE = "inactive",
}

export type TicketState =
  | { status: ScanningState.LOADING | ScanningState.INVALID; checkedAt: number }
  | {
    status: ScanningState.VALID | ScanningState.USED | ScanningState.INACTIVE;
    ticketData: Ticket;
    checkedAt: number;
  };
