export const routes = {
  home: "/",
  users: {
    login: "/user/login",
    register: "/user/register",
    password: {
      forgotten: "/user/forgotten-password",
      reset: "/user/reset-password"
    },
    logout: "/user/logout",
    settings: "/user/settings"
  },
  app:  {
    home: "/app/:userId"
  },
  vaults: {
    list: "/vaults",
    view: "/vaults/:vaultId",
    edit: "/vaults/:vaultId/edit",
    delete: "/vaults/:vaultId/delete"
  },
  external: {
    github: "https://github.com/Ben-Ryder/athena",
    creator: "https://www,benryder.me"
  }
}