export const routes = {
  home: "/",
  welcome: "/welcome",
  menu: "/menu",
  settings: "/settings",
  external: {
    github: "https://github.com/ben-ryder/athena",
    creator: "https://www.benryder.me",
    docs: "https://github.com/ben-ryder/athena",
  },
  tags: {
    create: "/tags/new",
    list: "/tags",
    edit: "/tags/:id/edit",
  },
  items: {
    create: "/item/new",
    list: "/items",
    edit: "/item/:id",
  },
  views: {
    create: "/views/new",
    list: "/views",
    edit: "/views/:id"
  },
  attachments: "/attachments"
};

export function replaceParam(
  route: string,
  paramName: string,
  paramValue: string,
) {
  return route.replaceAll(paramName, paramValue);
}
