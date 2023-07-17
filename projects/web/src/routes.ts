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
  notes: {
    create: "/notes/new",
    list: "/notes",
    edit: "/notes/:id",
    templates: {
      create: "/templates/notes/new",
      list: "/templates/notes",
      edit: "/templates/notes/:id",
    },
  },
  views: {
    create: "/views/new",
    list: "/views",
    edit: "/views/:id"
  },
  pages: {
    create: "/pages/new",
    list: "/pages",
    edit: "/pages/:id"
  },
  tags: {
    create: "/tags/new",
    list: "/tags",
    edit: "/tags/:id/edit",
  },
  tasks: {
    create: "/tasks/new",
    list: "/tasks",
    edit: "/tasks/:id"
  },
  journal: {
    create: "/journal/new",
    list: "/journal",
    edit: "/journal/:id/edit",
    view: "/journal/:id",
    templates: {
      create: "/templates/journal/new",
      list: "/templates/journal",
      edit: "/templates/journal/:id",
    },
  },
  reminders: {
    create: "/reminders/new",
    list: "/reminders",
    edit: "/reminders/:id",
  },
};

export function replaceParam(
  route: string,
  paramName: string,
  paramValue: string,
) {
  return route.replaceAll(paramName, paramValue);
}
