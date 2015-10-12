function add(result, index) {
    		result.index = index;
            return result;
    	}

Template.home.helpers({
    'names' : function(){
    	var name = [{'name': '-----'}, { 'name':'YHOO'}, {'name':'AAPL'}, {'name':'IBM'}, {'name':'NKE'}, {'name':'SBUX'}, {'name': 'DOW J'}, ] 
        return name
    },
    'share': function(){
    	var currentUser = Meteor.userId();
        var share = Shares.find({createdBy: currentUser}).fetch();
        for (var i = 0; i< share.length; i++){
        	share[i].index = i + 1;
        }
        console.log(share);
        return share;
    },
    /*'price': function(){
    	return Company.find({});
    },*/
    /*'holder': function(){
    	this.elephantDep.depend();
        return this.elephant;
    }*/
});

Template.list.helpers({

	/*'price': function(){
		console.log(Company.find({}));
    	return Company.find({});
    },*/
    'qwerty': function(){
    	return {AAPL:140, IBM: 120, YHOO: 100}
    }
});

/*Template.home.created = function(){
	var self = this;
    self.data.elephantDep = new Deps.Dependency();
    self.data.elephant = '';
            Meteor.call('shar', function (error, result) {
            	console.log('aasASAs', result);
                self.data.elephant = result;
                self.data.elephantDep.changed();
            } );
}*/