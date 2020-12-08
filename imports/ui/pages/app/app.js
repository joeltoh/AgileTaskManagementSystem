
TasksCollection = new Mongo.Collection("tasks");
LinksCollection = new Mongo.Collection("links");



Router.configure({
    layoutTemplate: 'main'
});


//this is for the login route, linked with template name login
Router.route('/login', {
  name: 'login',
  template: 'login'
});

//for about page linked with template name about
Router.route('/about', {
  name: 'about',
  template: 'about'
});

//this is the default
Router.route('/', {
    name: 'home',
    template: 'home',
    data: function() {},
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.redirect('/login');
        }
    },
    onAfterAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
        setTimeout(function()
        {
          var daysStyle = function(date){
              var dateToStr = gantt.date.date_to_str("%D");
              if (dateToStr(date) == "Sun" || dateToStr(date) == "Sat") {
                return "weekend";
              }
              return "";
          };
          var today = new Date();
          var year = today.getFullYear();
          var month = today.getMonth();
          var day = today.getDate();
          gantt.config.start_date = new Date(year,month,day);
          gantt.config.end_date = new Date(year,month+2,day);
          gantt.config.scale_height = 84;
          gantt.config.scale_unit = "month";
          gantt.config.date_scale = "%F, %Y";
          gantt.config.grid_width = 300;
          gantt.config.min_column_width = 20;
          gantt.config.buttons_left=["dhx_save_btn","dhx_cancel_btn","completed_button","reviewed_button"];
          gantt.locale.labels["completed_button"] = "Completed";
          gantt.locale.labels["reviewed_button"] = "Reviewed";
          gantt.locale.labels.section_priority = "Assigned";
          gantt.config.subscales = [
              // {unit:"week", step:1, date:"Week %W"},
              {unit:"day", step:1, date:"%d", css:daysStyle}
          ];
          gantt.config.columns =  [
              {name: "text", label: "Tasks",  width: '*', tree: true },
              {name: "add", label:"", width: 44 }
          ];
          gantt.init("gantt_here");

          //To populate this with users in the group
          //Key would be the uid
          //Label would be the users name
          var opts = [
                  {key:"Joel", label: "Joel"},                                               
                  {key:"Jefferson", label: "Jefferson"},                                             
                  {key:"Vince", label: "Vince"},
                  {key:"Chao Jian", label: "Chao Jian"},
                  {key:"Brandon", label: "Brandon"},
                  {key:"Desmond", label: "Desmond"}                                        
          ];


          gantt.config.lightbox.sections = [
              {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
                  {name:"priority", height:22, map_to:"priority", type:"select", options: opts}, 
              {name:"time", height:72, type:"duration", map_to:"auto"}
          ];

          gantt.attachEvent("onLightboxButton", function(button_id, node, e){
            var id = gantt.getState().lightbox;
            if (button_id == "completed_button"){
                gantt.getTask(id).progress = 1;
                //To send sms
            }else if (button_id == "reviewed_button"){
                gantt.getTask(id).progress = 2;
            }
            gantt.updateTask(id);
            gantt.hideLightbox();
        });

          gantt.locale.labels.section_template = "Details";

          // Init dhtmlxGantt data adapter.
          gantt.meteor({tasks: TasksCollection, links: LinksCollection});
        }, 0);
      }
    },
});

if (Meteor.isServer) {

  Meteor.startup(function() {
    // create default user
    if (Meteor.users.find().count() == 0) {
      Accounts.createUser({
          email: 'admin@mail.com',
          password: 'admin'
      });
    }
  });

  Meteor.publish('tasks', function(){
      return TasksCollection.find();
  });
  Meteor.publish('links', function(){
      return LinksCollection.find();
  });

}

if (Meteor.isClient) {

    Meteor.subscribe('tasks');
    Meteor.subscribe('links');

    Template.navigation.events({
        'click .logout': function(event){
            event.preventDefault();
            Meteor.logout();
        }
    });

    Template.login.events({
        'submit form': function(event){
            event.preventDefault();
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Meteor.loginWithPassword(email, password, function(error){
                if(error){
                    console.log(error.reason);
                } else {
                    Router.go("/");
                }
            });
        }
    });

    Template.navigation.helpers({
      isActiveRoute:function(page){
        if (page == Router.current().route.getName()) {
          return 'active';
        }
      }
    });

    Template.home.events({
      'focus #date_start': function(e, template){
          var f = Template.instance().$('#date_start');
          f.bootstrapMaterialDatePicker({format:'YYYY-MM-DD', time: false});
      },
      'focus #date_end': function(e, template){
          var f = Template.instance().$('#date_end');
          f.bootstrapMaterialDatePicker({format:'YYYY-MM-DD', time: false});
      },
      'change #date_start': function(e, template){
          var date_start = $('[name="date_start"]').val().split("-");
          gantt.config.start_date = new Date(date_start[0], date_start[1], date_start[2]);
          gantt.render();
      },
      'change #date_end': function(e, template){
          var date_end = $('[name="date_end"]').val().split("-");
          gantt.config.end_date = new Date(date_end[0], date_end[1], date_end[2]);
          gantt.render();
      }
    });

}
