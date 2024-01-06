export const routes = {
  main: "/",
  welcome: "/welcome",
  policies: "/privacy-and-cookie-policy",
  external: {
    github: "https://github.com/ben-ryder/athena",
    selfHostDocs: "https://github.com/ben-ryder/athena",
    creator: "https://www.benryder.me",
  },
};

export function replaceParam(
  route: string,
  paramName: string,
  paramValue: string,
) {
  return route.replaceAll(paramName, paramValue);
}
