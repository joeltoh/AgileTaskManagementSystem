export const SidebarMenuAdmin = {
  dashboard: {
    icon: "home",
    title: "Dashboard"
  },
  menus: [
    {
      sidebarHeader: "Management Menu",
      sidebarItems: [
        {
          icon: "adn",
          title: "User Management",
          route: "admin.user"
        }, {
          icon: "android",
          title: "Course Management",
          route: "admin.course"
        }, {
          icon: "android",
          title: "Group Management",
          route: "admin.group"
        }, {
          icon: "android",
          title: "Team Management",
          route: "admin.team"
        },
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
