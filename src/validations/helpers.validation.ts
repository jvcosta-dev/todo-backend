export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidString = (value: string, minLength: number): boolean =>
  typeof value === "string" && value.length >= minLength;
