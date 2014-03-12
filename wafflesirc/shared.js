var FeelingLucky = require("./lib/feelinglucky");
var rest = require('./plugins/rest');
var redis = require("redis");
var rclient = redis.createClient(6379, 'localhost');

var sprintf = require('sprintf').sprintf;

var PRICES_CACHE = 'bitcoinPrices';
var PRICES_CACHE_SECONDS = 60 * 30; // 30 minutes
var pricesOptions = {
    host : 'api.bitcoincharts.com',
    port : 80,
    path: '/v1/weighted_prices.json',
    method : 'GET',
    headers : {
        'Content-Type' : 'application/json'
    }
};

var Shared = module.exports = {

	convert_btc : function(context, text) {
        var btcArgs = text.split(' ');
        
        var bitcoin = 1;
        var currency = 'USD';

        if (btcArgs.length === 1) {
            bitcoin = +btcArgs[0];
        } else if (btcArgs.length > 1) {
            currency = btcArgs[1].toUpperCase();
        }

        if (isNaN(bitcoin) || bitcoin === 0) {
            bitcoin = 1;
        }
        
        getBitcoinValue(bitcoin, currency, function(err, value) {
            if (err) {
                return context.channel.send_reply(context.sender, err);
            }

            var reply = sprintf("%.8f BTC = %.2f %s", bitcoin, value, currency);

            context.channel.send_reply(context.sender, reply);
        });
    },

    get_currencies : function(context, text) {
        getCurrencies(function(err, currencies) {
            if (err) {
                return context.channel.send_reply(context.sender, err);
            }

            var reply = sprintf("Current currencies: %s", currencies);

            context.channel.send_reply(context.sender, reply);
        });
    },

	google : function(context, text) {
		FeelingLucky(text + " -site:w3schools.com", function(data) {
			if (data) {
				context.channel.send_reply(context.intent, "\x02" + data.title + "\x0F \x032<" + data.url + ">\x0F", {
					color : true
				});
			} else {
				context.channel.send_reply(context.sender,
						"No search results found.");
			}
		});
	}
};

function getBitcoinValue(bitcoin, currency, callback) {
    rclient.get(PRICES_CACHE, function (err, result) {
        if (result) {
            var prices = JSON.parse(result);
            return convertPrices(prices, bitcoin, currency, callback);
        }
        
        getCurrentPrices(function (err, prices) {
            if (err) {
                return callback(err, null);
            }
            
            convertPrices(prices, bitcoin, currency, callback);
            callback(null, Object.keys(prices));
        });
    });
}

function getCurrencies(callback) {
    rclient.get(PRICES_CACHE, function (err, result) {
        if (result) {
            var prices = JSON.parse(result);
            
            return callback(null, convertPricesToCurrencies(prices));
        }
        
        getCurrentPrices(function (err, prices) {
            if (err) {
                return callback(err, null);
            }
            
            callback(null, convertPricesToCurrencies(prices));
        });
    });
}

function convertPricesToCurrencies(prices) {
    var currencies = [];
    for (var key in prices) {
        if (prices.hasOwnProperty(key) && key.length === 3) {
            currencies.push(key);
        }
    }
    
    return currencies;
}

function getCurrentPrices(callback) {
    rest.getJSON(pricesOptions, function(statusCode, result) {
        result.statusCode = statusCode;

        if (statusCode == 200) {
            cachePrices(result);
            callback(null, result);
        } else {
            callback("Remote API unreachable, please try again later.", null);
        }
    }, function(err) {
        callback(err, null);
    });
}

function cachePrices(result) {
    rclient.set(PRICES_CACHE, JSON.stringify(result));
    rclient.expire(PRICES_CACHE, PRICES_CACHE_SECONDS);
}

function convertPrices(prices, bitcoin, currency, callback) {
    if (currency in prices) {
        var value = 0.0;
        
        if ('24h' in prices[currency]) {
            value = prices[currency]['24h'];
        } else if ('7d' in prices[currency]) {
            value = prices[currency]['7d'];
        } else if ('30d' in prices[currency]) {
            value = prices[currency]['30d'];
        } else {
            return callback(sprintf("Currency '%s' has no recent trades to determine value.", currency), null);
        }
        
        var currencyValue = bitcoin * value;
        
        callback(null, currencyValue);
    } else {
        return callback(sprintf("Currency '%s' is not supported. Please use !currencies to see a list of valid currencies.", currency), null);
    }
}
