Template.register.events({
    'click #registration': function(event){
        event.preventDefault();
        $( ".register-form" ).validate();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        var firstname = $('[name=username]').val();
        var lastname = $('[name=lastname]').val();
        var username = firstname + lastname;
        console.log('register', email, password, firstname, lastname, username);
        Accounts.createUser({
            email: email,
            password: password,
            profile : {
                username: username
            }
        }, function (error){
           if(error){
            if(error.reason == "Email already exists."){
                validator.showErrors({
                    email: "That email already belongs to a registered user."
                });
            }
        }
        else {
            Router.go('home');
        }
    });
    }
});

Template.register.onRendered( function() {
    $( ".register-form" ).validate();
});
