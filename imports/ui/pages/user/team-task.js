import { Tasks } from '../../../api/tasks/tasks'
import { Links } from '../../../api/links/links'
import { Teams } from '../../../api/teams/teams'

import './team-task.html'
import '../../stylesheets/gantt.css'
import '../../stylesheets/team-task.css'

let isInitial = true

Tasks.find().observeChanges({
  added: function (id, fields) {
    if (!isInitial) {
      console.log('Notifying new task...')
      setTimeout(() => {
        Meteor.call('notifications.newTask', fields)
      }, 0)
    }
  },
  changed: function (id, fields) {
    const task = Tasks.findOne(id)
    switch (fields.progress) {
      case 1:
        console.log('Notifying completed task...')
        setTimeout(() => {
          Meteor.call('notifications.completedTask', task)
        }, 0)
        break
      case 2:
        console.log('Notifying reviewed task...')
        setTimeout(() => {
          Meteor.call('notifications.reviewedTask', task)
        }, 0)
        break
    }
  },
  removed: function (id) {
    console.log("task removed lol")
  }
});

Meteor.startup(() => {
  Meteor.subscribe('teams')
})

Template.teamTask.onCreated(function () {
  Meteor.subscribe('tasks')
  Meteor.subscribe('links')
  Meteor.subscribe('users', () => {
    const thisTeam = Teams.findOne()
    console.log(thisTeam)
    const opts = thisTeam.members.map((userId) => {
      const user = Meteor.users.findOne(userId)
      if (!user) {
        return {
          key: userId,
          label: 'Unknown'
        }
      }
      const label = user.profile.name ? user.profile.name : user.emails[0].address
      return {
        key: userId,
        label
      }
    })
    console.log(opts)
    gantt.config.lightbox.sections = [
      {
        name: "description",
        height: 38,
        map_to: "text",
        type: "textarea",
        focus: true
      }, {
        name: "priority",
        height: 22,
        map_to: "assignee",
        type: "select",
        options: opts
      }, {
        name: "time",
        height: 72,
        type: "duration",
        map_to: "auto"
      }
    ];
  })


})


Template.teamTask.onRendered(function () {
  const daysStyle = function (date) {
    const dateToStr = gantt.date.date_to_str("%D");
    if (dateToStr(date) == "Sun" || dateToStr(date) == "Sat") {
      return "weekend";
    }
    return "";
  };
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  gantt.config.start_date = new Date(year, month, day);
  $('[name="date-start"]').val(gantt.config.start_date.toLocaleDateString())
  gantt.config.end_date = new Date(year, month + 1, day);
  $('[name="date-end"]').val(gantt.config.end_date.toLocaleDateString())
  gantt.config.scale_height = 84;
  gantt.config.scale_unit = "month";
  gantt.config.date_scale = "%F, %Y";
  gantt.config.grid_width = 300;
  gantt.config.min_column_width = 20;
  gantt.config.buttons_left = ["dhx_save_btn", "dhx_cancel_btn", "completed_button", "reviewed_button"];
  gantt.locale.labels["completed_button"] = "Completed";
  gantt.locale.labels["reviewed_button"] = "Reviewed";
  gantt.locale.labels.section_priority = "Assignee";
  gantt.config.subscales = [
    { // {unit:"week", step:1, date:"Week %W"},
      unit: "day",
      step: 1,
      date: "%d",
      css: daysStyle
    }
  ];
  gantt.config.columns = [
    {
      name: "text",
      label: "Tasks",
      width: '*',
      tree: true
    }, {
      name: "add",
      label: "",
      width: 44
    }
  ];
  gantt.init("gantt-here");

  gantt.locale.labels.section_template = "Details";


  gantt.attachEvent("onLightboxButton", function (button_id, node, e) {
    console.log("insinde onLightboxButton")
    const id = gantt.getState().lightbox;
    if (button_id == "completed_button") {
      gantt.getTask(id).progress = 1;
      //To send sms
    } else if (button_id == "reviewed_button") {
      gantt.getTask(id).progress = 2;
    }
    gantt.updateTask(id);
    gantt.hideLightbox();
  });
  gantt.attachEvent('onTaskCreated', (task) => {
    // block create task api for team member
    console.log("inside on taskcreated")
    // console.log(process.env.TWILIO_NUMBER);
    // delete process.env.TWILIO_ACCOUNT_SID;
    // delete process.env.TWILIO_AUTH_TOKEN;
    // delete process.env.TWILIO_NUMBER;
    isInitial = false
    return true
  })
  gantt.attachEvent('onBeforeTaskAdd', (id, task) => {
    console.log("inside onBeforeTaskAdd")
    // if (button_id == "dhx_save_btn") {
    // console.log(thisTeam)
    // console.log("yolo")
    // }
    if (task.team && task.progress) {
      return false
    }
    if (!task.team) {
      const thisTeam = Teams.findOne()
      console.log(thisTeam)
      task.team = thisTeam._id
    }
    if (!task.progress) {
      task.progress = 0
    }
    return true
  })

  console.log('just before gantt.meteor')

  gantt.meteor({
    tasks: Tasks,
    links: Links
  })
  console.log('just after gantt.meteor')

})


Template.teamTask.events({
  'focus #date-start': function (e) {
    e.preventDefault()
    const dateStart = $('#date-start')
    dateStart.bootstrapMaterialDatePicker({ format: 'YYYY-MM-DD', time: false })
  },
  'focus #date-end': function (e) {
    e.preventDefault()
    const dateEnd = $('#date-end')
    dateEnd.bootstrapMaterialDatePicker({ format: 'YYYY-MM-DD', time: false })
  },
  'change #date-start': function (e, template) {
    const dateStart = $('[name="date-start"]').val().split("-")
    gantt.config.start_date = new Date(dateStart[0], dateStart[1] - 1, dateStart[2])
    gantt.render()
  },
  'change #date-end': function (e, template) {
    const dateEnd = $('[name="date-end"]').val().split("-")
    gantt.config.end_date = new Date(dateEnd[0], dateEnd[1] - 1, dateEnd[2])
    gantt.render()
  }
})