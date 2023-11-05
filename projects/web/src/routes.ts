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
  notes: {
    create: "/notes/new",
    list: "/notes",
    edit: "/notes/:id",
  },
  noteLists: {
    create: "/lists/notes/new",
    list: "/lists/notes",
    edit: "/lists/notes/:id",
  },
  tasks: {
    create: "/tasks/new",
    list: "/tasks",
    edit: "/tasks/:id"
  },
  taskLists: {
    create: "/lists/tasks/new",
    list: "/lists/tasks",
    edit: "/lists/tasks/:id"
  },
  pages: {
    create: "/pages/new",
    list: "/pages",
    edit: "/pages/:id"
  },
};

export function replaceParam(
  route: string,
  paramName: string,
  paramValue: string,
) {
  return route.replaceAll(paramName, paramValue);
}
