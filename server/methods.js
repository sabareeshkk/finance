Meteor.methods({
    'createNewList': function(companyname, quantity, price, total){
        var currentUser = Meteor.userId();
        var createduser = Meteor.user().profile.username;
        console.log(currentUser);
        var yahoo = YahooFinance.snapshot({symbols: [companyname], fields:['s', 'n', 'd1', 'l1', 'y', 'r']});
        console.log(yahoo[companyname].lastTradePriceOnly);
        var pretotal = parseFloat(yahoo[companyname].lastTradePriceOnly) * parseInt(quantity)
        var prediff = parseFloat(pretotal.toFixed(2)) - parseFloat(total)
        return Shares.insert({created: new Date(), 
            company: companyname, 
            quantity: parseInt(quantity), 
            price: parseFloat(price), 
            total: parseFloat(total), 
            createdBy: currentUser, 
            username: createduser,
            currenttotal: parseFloat(pretotal.toFixed(2)),
            currentdiff: parseFloat(prediff.toFixed(2)),
            currentprice: parseFloat(yahoo[companyname].lastTradePriceOnly)});
    },
    'getPrice': function(companyname){
    	var currentUser = Meteor.userId();
    	var yahoo = YahooFinance.snapshot({symbols:[companyname], fields:['s', 'n', 'd1', 'l1', 'y', 'r']});
    	return yahoo
    },
    'currentprice': function(company){
        var company = YahooFinance.snapshot({symbols: company, fields:['s', 'n', 'd1', 'l1', 'y', 'r']})
        Company.insert(company);
    },
    'shar': function(){
        var currentUser = Meteor.userId();
        console.log(currentUser);
        return Shares.find({createdBy: currentUser}).fetch();
    },
    'updated' : function(results){
        console.log(results);
        var currentUser = Meteor.userId();
        console.log('created', results.created);
        results = datediff(results);
        return Shares.update({
                    createdBy: currentUser, 
                    quantity: results.quantity, 
                    company: results.company,
                    total: results.total 
                    }, {$set: results});
    },
    'getPriceyes': function(companyname, quantity, price, total, created){

        console.log('price\n', price, 'company\n', companyname);
        var yahoo = YahooFinance.snapshot({symbols: [companyname], fields:['s', 'n', 'd1', 'l1', 'y', 'r']});
        console.log('yahoo', yahoo[companyname].lastTradePriceOnly);
        var currenttotal =  parseFloat(yahoo[companyname].lastTradePriceOnly) *  parseInt(quantity);
        console.log('price', currenttotal);
        var diff = parseFloat(currenttotal.toFixed(2)) - parseFloat(total);
        console.log('diff', diff);
        console.log(diff.toFixed(2));
        var yahoo = {currenttotal: parseFloat(currenttotal.toFixed(2)),
            total: parseFloat(total),
            price: parseFloat(price), 
            currentprice: yahoo[companyname].lastTradePriceOnly, 
            currentdiff: parseFloat(diff.toFixed(2)), 
            company: companyname, 
            quantity: parseInt(quantity),
            created: created};
        return yahoo
    },
    'realtime': function(results){
        console.log(results);
        results = datediff(results);
        return Shares.update({_id: results._id}, {$set: results});
    }
});

//finding the cagr value 
function datediff(results){
    var created  = results.created;
        var date = new Date();
        var a = moment(date);
        var b = moment(created);
        var diff = a.diff(b, 'years', true) //[days, years, months, seconds, ...]
        console.log('sadsad', diff); 
        if (diff >=1){
           /*a = p(1+ r/100)^n*/
           var a = results.currentprice / results.price;
           var r = (Math.pow(a.toFixed(2), diff.toFixed(2)) * 100) - 100;
           console.log('cagr annual', r); 
           results.annual = r;
        }
        else {
            var b = results.currentprice / results.price;
            console.log('das', b);
            var r = (Math.pow(b, diff * 12) * 1200) - 1200;
            console.log('cagr monthly', r);
            results.monthly = r;
        }
        return results;
}

/*function total_amount(){
    var yahoo = YahooFinance.snapshot({symbols: [companyname], fields:['s', 'n', 'd1', 'l1', 'y', 'r']});
    console.log(yahoo[companyname].lastTradePriceOnly);
    var pretotal = parseFloat(yahoo[companyname].lastTradePriceOnly) * parseInt(quantity)
    var prediff = parseFloat(pretotal.toFixed(2)) - parseFloat(total)
}*/

Meteor.setInterval(function(){
    var sahre = Shares.find().fetch();
    for (var i = 0; i < sahre.length; i++){
        /*console.log(sahre[i].company);*/
        Meteor.call('getPrice', sahre[i].company, function(err, res){
        sahre[i].currentprice = res[sahre[i].company].lastTradePriceOnly;
        sahre[i].currenttotal = (res[sahre[i].company].lastTradePriceOnly * sahre[i].quantity).toFixed(2);
        sahre[i].currentdiff = (sahre[i].currenttotal - sahre[i].total).toFixed(2);
        /*console.log('sahre', sahre[i]);*/
        Meteor.call('realtime', sahre[i], function(err, res){
            console.log('res', res);
        });

        });
    }
    
}, 10000000);