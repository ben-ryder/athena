export const routes = {
  home: "/",
  users: {
    login: "/user/login",
    register: "/user/register",
    password: {
      forgotten: "/user/forgotten-password",
      reset: "/user/reset-password"
    },
    verification: {
      request: "/user/verify",
      submit: "/user/verify/submit"
    },
    logout: "/user/logout",
    settings: "/user/settings"
  },
  external: {
    github: "https://github.com/ben-ryder/athena",
    creator: "https://www.benryder.me"
  },
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
    journal: {
      create: "/journal/new",
      list: "/journal",
      edit: "/journal/:id/edit",
      view: "/journal/:id"
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
    },
    journal: {
      create: "/templates/journal/new",
      list: "/templates/journal",
      edit: "/templates/journal/:id",
    }
  }
}

export function replaceParam(route: string, paramName: string, paramValue: string) {
  return route.replaceAll(paramName, paramValue);
}
