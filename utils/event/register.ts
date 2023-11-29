// Using codes means we can modify the error message without breaking anything if css is implemented for a specific error
export enum EventRegisterError {
  OTHER = 0,
  TO_HOMEPAGE = 1,
  RELOAD = 3,
  PREVIOUSLY_LOGGED_IN = 4,
  PURCHASED = 5,
  PURCHASED_NOT_LOGGED_IN = 6,
}
