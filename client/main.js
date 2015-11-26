//Routing
Router.configure({
  layoutTemplate:"ApplicationLayout"
});
Router.route('/', function () {
  this.render('welcome', {
    to:"main"
  });
});
Router.route('/images', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('images', {
    to:"main"
  });
});
Router.route('/image/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('image', {
    to:"main",
    data: function(){
      return Images.findOne({_id:this.params._id});
    }
  });
});

//Infinite scroll
Session.set("imageLimit", 8);
var lastScrollTop = 0;
$(window).scroll(function(event){
        // test if we are near the bottom of the window
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // where are we in the page? 
      var scrollTop = $(this).scrollTop();
      // test if we are going down
      if (scrollTop > lastScrollTop){
        // yes we are heading down...
       Session.set("imageLimit", Session.get("imageLimit") + 4);
      }

      lastScrollTop = scrollTop;
  }
});

//Accounts config
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});



Template.images.helpers({
    images: function(){
      var userFilter = Session.get("userFilter");
      if (userFilter){
        return Images.find({createdBy: userFilter}, {sort:{createdOn:-1, rating:-1}});
      } else {
          return Images.find({}, {sort:{createdOn:-1, rating:-1}, limit:Session.get("imageLimit")})

      }
    },
    getUser: function(user_id){
      var user = Meteor.users.findOne({_id:user_id});
      if (user) {
        return user.username;
      } else {
        return "anon";
      }
    },
    getFilterUser: function(){
      var userFilter = Session.get("userFilter");
      if (userFilter){
        var user = Meteor.users.findOne({_id:userFilter});
        return user.username;
      } else {
        return false;
      }
    },
    filtering_images: function(){
      var userFilter = Session.get("userFilter");
      return userFilter;
    }
});
Template.body.helpers({
    username:function(){
      if(Meteor.user()){
        return Meteor.user().username;
        // return Meteor.user().emails[0].address;
      } else {
        return "Anonymous";
      }
    }
});
Template.images.events({
    'click .js-image': function(event){
      $(event.target).css("width", "50px");
    },
    'click .js-del-image': function(event){
      var image_id = this._id;
      $("#"+image_id).hide("slow", function(){
        Images.remove({"_id":image_id});
      });
    }, 
    'click .js-rate-image': function(event){
        var rating = $(event.currentTarget).data('userrating');
        var image_id = this.id;
        console.log(rating, image_id);
        Images.update({_id:image_id}, {$set:{rating:rating}});
    },
    'click .js-show-image-form': function(event){
      $("#image_add_form").modal("show");
    },
    'click .js-set-image-filter': function(event){
      Session.set("userFilter", this.createdBy);
    },
    'click .js-unset-image-filter': function(event){
      Session.set("userFilter", "");
    }
});
Template.image_add_form.events({
    'click .js-save-image': function(event){
      var img_src, img_alt, closest;
      closest = event.target.closest(".js-add-image");
      img_src = closest.img_src.value;
      img_alt = closest.img_alt.value;
      if (Meteor.user()){
        Images.insert({
          img_src: img_src,
          img_alt: img_alt,
          createdOn: new Date(),
          createdBy: Meteor.user()._id
        });
      }

      return false;
    }
});
