export function getPostAuthPath(from) {
  return from?.pathname?.startsWith("/account") ? from.pathname : "/account";
}
