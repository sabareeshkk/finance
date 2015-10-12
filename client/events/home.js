Meteor.subscribe('shares');
Meteor.subscribe('company');
Template.home.events({
	'click #finance': function(event){
		event.preventDefault();
		var companyname = $('[name=suku]').val()
		var number = $('#number').val();
		var price = $('#price').val();
		var total = $('#total').val();
		console.log(companyname);
		Meteor.call('createNewList', companyname, number, price, total, function(error, result){
			if (error){
				console.log(error.reason);
			}
			else{
				console.log('yahoo-finance', result);
			}
		});
		$('#number').val(' ');
		$('#price').val(' ');
		$('#total').val(' ');
	},
	'change #sel1': function(event){
		event.preventDefault();
		var companyname = $('[name=suku]').val();
		console.log(companyname);
		Meteor.call('getPrice', companyname, function(error, result){
			/*console.log("result", result[companyname])*/
			if (error){
				console.log(error.reason);
			}
			else{
				/*console.log('yahoo-finance', result[companyname].lastTradePriceOnly);*/
				$('#price').val(result[companyname].lastTradePriceOnly);
			}
		});
	},
	'change #number': function(event){
		event.preventDefault();
		var number = $('#number').val();
		var price = $('#price').val();
		var total = parseFloat(price) * parseFloat(number)
		$('#total').val(total.toFixed(2));
	},
	'click #refresh': function(event){
        event.preventDefault();
        Meteor.call('shar', function(error, result) {
        	if(error){
        		console.log('result', error.reason);
        	}
        	else{
        		console.log('result', result);
        		
		    for (var i=0; i< result.length; i++){
              /*  console.log(result[i]['company']);*/
		    	Meteor.call('getPriceyes', result[i]['company'], result[i]['quantity'], result[i]['price'], result[i]['total'], result[i]['created'], function(error, results){
			     console.log("result", results)
			        if (error){
				console.log(error.reason);
			    }
			       else{
				     /*console.log('yahoo-finance', results);*/
				     Meteor.call('updated', results, function(err, res){
				     	console.log(res);
				     })
				    
			   }
		       });
		    }
        	}
        });
	}
});