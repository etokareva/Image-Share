Meteor.startup(function(){
  	if(Images.find().count() == 0){
  		for (var i = 1; i < 23; i++) {
  			Images.insert({ img_src:"img_"+ i +".jpg", img_alt:"image "+i });
  		} //end of for insert images

  		//count of images
  		console.log("Startup.js says: ");
  		console.log(Images.find().count());

  	} //end of if no images
});
