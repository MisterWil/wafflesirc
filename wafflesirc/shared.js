var FeelingLucky = require("./lib/feelinglucky");

var Shared = module.exports = {

	convert_btc : function(context, text) {
		context.channel.send_reply(context.sender, "Not implemented :(");
	},
	
	get_currencies : function(context, text) {
		context.channel.send_reply(context.sender, "Not implemented :(");
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
