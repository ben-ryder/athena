export const routes = {
  main: "/",
  welcome: "/welcome",
  policies: "/privacy-and-cookie-policy",
  about: "/",
  external: {
    github: "https://github.com/ben-ryder/athena",
    creator: "https://www.benryder.me",
    docs: "https://github.com/ben-ryder/athena",
  },
};

export function replaceParam(
  route: string,
  paramName: string,
  paramValue: string,
) {
  return route.replaceAll(paramName, paramValue);
}
