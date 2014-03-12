var Util = require("util");
var Bot = require("./lib/irc");

var Shared = require("./shared");

var WaffleBot = function(profile) {
	Bot.call(this, profile);
	this.set_log_level(this.LOG_ALL);
	this.set_trigger("!"); // Exclamation
};

Util.inherits(WaffleBot, Bot);

WaffleBot.prototype.init = function() {
	Bot.prototype.init.call(this);

	this.register_command("btc", Shared.convert_btc,  {
		help: "Convert btc to another currency. To get available currencies, use !cur. Usage: !btc 10 usd"
	});
	
	this.register_command("currencies", Shared.get_currencies, {
		help: "Returns a list of available currencies for use with !btc."
	});
	
	this.register_command("g", Shared.google, {
		help: "Run this command with a search query to return the first Google result. Usage: !g kitten images"
	});
	
	this.register_command("google", this.google, {
		help: "Returns a link to a Google search page of the search term. Usage: !google opencourseware computational complexity"
	});
	
	this.register_command("help", this.help);
	
	this.register_command("ping", this.ping);
	
	this.on('command_not_found', this.unrecognized);
};

WaffleBot.prototype.google = function(context, text) {
	if (!text) {
		context.channel.send_reply (context.sender, this.get_command_help("google"));
		return;
	}

	context.channel.send_reply (context.intent, "Google search: \""+text+"\" <http://www.google.com/search?q="+encodeURIComponent(text)+">");
};

WaffleBot.prototype.ping = function(cx, text) {
	cx.channel.send_reply (cx.sender, "Pong!");
};

WaffleBot.prototype.help = function(context, text) {
    try {
        if (!text) {
            return context.channel.send_reply(context.intent, "Available commands: " + this.get_commands());
        }

        context.channel.send_reply(context.intent, this.get_command_help(text));
    } catch(e) {
        context.channel.send_reply(context.sender, e);
    }
};

WaffleBot.prototype.unrecognized = function(cx, text) {
	cx.channel.send_reply(cx.sender, "There is no command '" + text + "'. Try !help.");
};

var profile = [{
	host: "orwell.freenode.net",
	port: 6667,
	nick: "Pancakes",
	password: "",
	user: "username",
	real: "Real Name",
	channels: ["##wafflepool"]
}];

(new WaffleBot(profile)).init();