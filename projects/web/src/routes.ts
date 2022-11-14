export const routes = {
  home: "/",
  content: {
    notes: {
      list: "/notes",
      create: "/notes/new",
      edit: "/notes/:noteId",
    }
  },
  user: {
    callback: "/user/callback",
    logout: "/user/logout"
  },
  external: {
    github: "https://github.com/Ben-Ryder/athena",
    creator: "https://www.benryder.me"
  }
}

export function replaceParam(route: string, paramName: string, paramValue: string) {
  return route.replaceAll(paramName, paramValue);
}