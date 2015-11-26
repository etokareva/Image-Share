Images = new Mongo.Collection('images');

//set up security on Images collection
Images.allow({
	insert: function (userId, doc) {
		if (Meteor.user()) {
			doc.createdBy = userId;
			if (userId != doc.createdBy) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	},
	remove: function (userId, doc){
		if (Meteor.user()) {
			doc.createdBy = userId;
			if (userId != doc.createdBy) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
});