import { Teams } from '../teams/teams'
import { MailgunCredentials } from '../mailgun/mailgun-credentials'
import { TwilioCredentials } from './twilio-credentials'

const post_url = MailgunCredentials.url + MailgunCredentials.domain + '/messages'

const Sender = {
  send(userId, subject, message) {
    const user = Meteor.users.findOne(userId)
    const pref = user.profile.notificationPreference
    switch (pref) {
      case 'email':
        const email = user.emails[0].address
        console.log('sending email with to ' + email)
        this.sendEmail({ email, subject, message })
        break;
      case 'sms':
        const phone = user.profile.phone
        console.log('sending sms with to ' + phone)
        this.sendSms({ phone, message })
        break;
    }
  },
  sendSms(opts) {
    console.log('sending sms')
    const twilioClient = Twilio(TwilioCredentials.api, TwilioCredentials.key);
    console.log(opts.phone + " " + opts.message + " im in twillio.js confirm here")
    twilioClient.sendSms({
      to: opts.phone,
      from: TwilioCredentials.number,
      body: opts.message
    }, (err) => {
      if (err) {
        throw new Meteor.Error(err)
      } else {
        console.log('Email sent to ' + opts.email)
      }
    });
  },
  sendEmail(opts) {
    console.log(opts)
    const options = {
      auth: MailgunCredentials.api,
      params: {
        from: MailgunCredentials.from,
        to: opts.email,
        subject: opts.subject,
        html: opts.message
      }
    }
    Meteor.http.post(post_url, options, (err) => {
      if (err) {
        throw new Meteor.Error(err)
      } else {
        console.log('Email sent to ' + opts.email)
      }
    })
  }
}

Meteor.methods({
  'notifications.newTask'(task) {
    console.log('sending new task')
    const subject = 'Agile Mamangement System (SCSE): A new task has been assigned to you'
    const message = 'Your team leader has assigned the following task to you:'
      + '<br />Description: ' + task.text
      + '<br />Start: ' + task.start_date
      + '<br />Deadline: ' + task.end_date
    Sender.send(task.assignee, subject, message)
  },
  'notifications.completedTask'(task) {
    const assignee = Meteor.users.findOne(task.assignee)
    const subject = 'Agile Management System (SCSE): Your teammates has completed a task'
    const message = 'The following task has been completed by ' + (assignee.profile.name ? assignee.profile.name : assignee.emails[0].address)
      + '<br />'
      + '<br />Description: ' + task.text
      + '<br />'
      + '<br />Please log in to the application to review the task.'
    team.members.forEach((userId) => {
      Sender.send(userId, subject, message)
    })
  },
  'notifications.reviewedTask'(task) {
    const assignee = Meteor.users.findOne(task.assignee)
    const subject = 'Agile Management System (SCSE): Your teammates has completed a task'
    const message = 'The following task has been completed by ' + (assignee.profile.name ? assignee.profile.name : assignee.emails[0].address)
      + '<br />'
      + '<br />Description: ' + task.text
      + '<br />'
      + '<br />Please log in to the application to review the task.'
    const team = Teams.findOne(task.team)
    team.members.forEach((userId) => {
      Sender.send(userId, subject, message)
    })
  }
})