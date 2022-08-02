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
  app:  {
    main: "/main/:vaultId"
  },
  vaults: {
    list: "/vaults",
    create: "/vaults/create",
    view: "/vaults/:vaultId",
    edit: "/vaults/:vaultId/edit",
    delete: "/vaults/:vaultId/delete"
  },
  external: {
    github: "https://github.com/Ben-Ryder/athena",
    creator: "https://www,benryder.me"
  }
}

export function linkWithParam(route: string, param: string): string {
  if (
    route === routes.app.main ||
    route === routes.vaults.view ||
    route === routes.vaults.edit ||
    route === routes.vaults.delete
  ) {
    return route.replace(":vaultId", param);
  }

  return route;
}