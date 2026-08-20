export function shouldEnableMocks({ isDevelopment, flag }) {
  return isDevelopment && flag === "true";
}
