export const routes = {
  home: "/",
  content: {
    notes: {
      create: "/notes/new",
      list: "/notes",
      edit: "/notes/:id",
    },
    tasks: {
      create: "/tasks/new",
      list: "/tasks",
      edit: "/tasks/:id/edit",
      view: "/tasks/:id"
    },
    reminders: {
      create: "/reminders/new",
      list: "/reminders",
      edit: "/reminders/:id",
    }
  },
  organisation: {
    tags: {
      create: "/tags/new",
      list: "/tags",
      edit: "/tags/:id/edit",
    },
    views: {
      create: "/views/new",
      list: "/views",
      view: "/views/:id",
      edit: "/views/:id/edit",
    }
  },
  templates: {
    notes: {
      create: "/templates/notes/new",
      list: "/templates/notes",
      edit: "/templates/notes/:id",
    },
    tasks: {
      create: "/templates/tasks/new",
      list: "/templates/tasks",
      edit: "/templates/tasks/:id",
    }
  },
  user: {
    callback: "/user/callback"
  },
  external: {
    github: "https://github.com/Ben-Ryder/athena",
    creator: "https://www.benryder.me"
  }
}

export function replaceParam(route: string, paramName: string, paramValue: string) {
  return route.replaceAll(paramName, paramValue);
}