import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { TaskEngine } from '../../../utils/task-engine'

import './task-table.html'

Template.taskTable.onCreated(() => {
  Template.instance().state = new ReactiveDict()
})

Template.taskTable.helpers({
  columns() {
    return TaskEngine.columns
  },
  tableName() {
    const ctxData = Template.instance().data
    return TaskEngine.tableName(ctxData.progress)
  },
  taskRecords() {
    const ctxData = Template.instance().data
    const isPersonal = ctxData.for === 'personal'
    const instance = Template.instance()
    const sortField = instance.state.get('sortField')
    const order = instance.state.get('order')
    let opts = {}
    if (sortField) {
      opts.sort = {}
      opts.sort[sortField] = order
    } else {
      opts.sort = {
        end_date: 1
      }
    }
    const result = TaskEngine.taskRecords(ctxData.progress, isPersonal, opts)
    if (result.length === 0) {
      return null
    } else {
      return result
    }
  }
})

Template.taskTable.events({
  'click th'(e) {
    const instance = Template.instance()
    const sortField = $(e.target).find('i').attr('field')
    if (sortField === instance.state.get('sortField')) {
      const order = instance.state.get('order')
      instance.state.set('order', -order)
    } else {
      instance.state.set('sortField', sortField)
      instance.state.set('order', 1)
    }
  }
})