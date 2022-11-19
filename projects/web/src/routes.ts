export const routes = {
  home: "/",
  content: {
    notes: {
      create: "/notes/new",
      list: "/notes",
      edit: "/notes/:noteId",
    },
    tasks: {
      create: "/tasks/new",
      list: "/tasks",
      edit: "/tasks/:taskId",
    },
    views: {
      create: "/views/new",
      view: "/views/:viewId",
      edit: "/views/:viewId/edit",
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