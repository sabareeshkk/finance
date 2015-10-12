Template.login.events({
	'click #login-id': function(event){
		event.preventDefault();
		var email = $('[name=email]').val();
		var password = $('[name=password]').val();
		Meteor.loginWithPassword(email, password, function(error){
			if(error){
				var validator = $('.login-form').validate();
				if(error.reason == "User not found"){
					console.log('dasda', error.reason);
					validator.showErrors({
						email: "That email doesn't belong to a registered user."
					});
				}
				if(error.reason == "Incorrect password"){
					validator.showErrors({
						password: "You entered an incorrect password."
					});
				}
			}
			else {
				Router.go("home");
			}
		});
	}
})

Template.login.onRendered(function(){
	$('.login-form').validate();
});