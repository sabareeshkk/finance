Meteor.publish('shares', function(){
    var currentUser = this.userId;
    return Shares.find({ createdBy: currentUser })
});

Meteor.publish('company', function(){
    var currentUser = this.userId;
    return Company.find({})
});
