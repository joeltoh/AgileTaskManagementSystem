export const SidebarMenu = {
  dashboard: {
    icon: "home",
    title: "Dashboard",
    route: "user.dashboard"
  },
  menus: [
    {
      sidebarHeader: "Task Menu",
      sidebarItems: [
        {
          icon: "adn",
          title: "Your Task",
          route: "user.self"
        }, {
          icon: "android",
          title: "Team Progress",
          route: "user.team"
        }, {
          icon: "edit",
          title: "View #3"
        }
      ]
    }, {
      sidebarHeader: "Header #2",
      sidebarItems: [
        {
          icon: "archive",
          title: "Menu #1"
        }, {
          icon: "align-left",
          title: "Menu #2"
        }, {
          icon: "at",
          title: "Menu #3"
        }
      ]
    }
  ]
}