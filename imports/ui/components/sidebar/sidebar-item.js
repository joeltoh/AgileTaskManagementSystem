import {Template} from 'meteor/templating'

import './sidebar-item.html'

Template
  .sidebarItem
  .events({
    'click .nav-item' (e) {
      FlowRouter.go(this.route)
    }
  })
