export const Permissions = {
  admin: [
    'admin',
    'users.create',
    'users.list',
    'users.read',
    'users.permission',
    'users.delete',
    'courses.create',
    'courses.list',
    'courses.edit',
    'courses.delete',
    'groups.create',
    'groups.list',
    'groups.edit',
    'groups.delete',
    'teams.create',
    'teams.list',
    'teams.edit',
    'teams.delete',
  ],
  coordinator: [
    'courses.edit',
    'groups.list',
    'groups.edit',
    'teams.list',
    'teams.edit',
    'tasks.list',
  ],
  teamLeader: [
    'tasks.create',
    'tasks.list',
    'tasks.assign',
    'tasks.update',
    'tasks.markCompleted',
    'tasks.edit',
    'tasks.delete',
  ],
  teamMember: [
    'tasks.list',
    'tasks.update',
    'tasks.edit'
  ]
}
