Meteor.methods({
    'createNewList': function(companyname, number, price, total){
        var currentUser = Meteor.userId();
        var createduser = Meteor.user().profile.username;
        console.log(currentUser);
       /* var today = new Date();
        var to = new Date();
        today.setDate(today.getDate() -1); 
        var yahoo = YahooFinance.historical({symbols: [companyname],
                                            from: today.toISOString().slice(0, 10),
                                            to: to.toISOString().slice(0, 10)});*/
        var yahoo = YahooFinance.snapshot({symbols: [companyname], fields:['s', 'n', 'd1', 'l1', 'y', 'r']});
        console.log(yahoo[companyname].lastTradePriceOnly);
        var pretotal = parseFloat(yahoo[companyname].lastTradePriceOnly) * parseInt(number)
        var prediff = parseFloat(pretotal.toFixed(2)) - parseFloat(total)
        return Shares.insert({created: new Date(), 
            company: companyname, 
            quantity: parseInt(number), 
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
        var created  = results.created;
        var date = new Date();
        var a = moment(date);
        var b = moment(created);
        var diff = a.diff(b, 'years', true) //[days, years, months, seconds, ...]
        //Result 1
        console.log('sadsad', diff); 
        if (diff >=1){
           /*a = p(1+ r/100)^n*/
           //
           var a = results.currentprice / results.price;
           var r = (Math.pow(a.toFixed(2), diff.toFixed(2)) * 100) - 100;
           console.log('cagr annual', r); 
           results.annual = r;
        }
        else {
            var b = results.currentprice / results.price;
            console.log('das', b);
            var r = (Math.pow(b, diff * 12) * 1200) - 1200;
            console.log('sadas', r);
            console.log('cagr maonthly', r);
            results.monthly = r;
        }
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
    'generation':function (){
        var currentUser = Meteor.userId();
    }
});

