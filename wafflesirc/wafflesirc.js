var irc = require("irc-js");

var config = {
	// Should the bot crash and burn on errors?
	"die" : false,

	// Prevent sending lots of messages in rapid succession
	"flood-protection" : false,

	// Logging level, any combination of: debug, info, warn, error (or: all, none)
	"log" : "all",

	"nick" : "wafflesbro",

	// Server settings
	"server" : {
		// IRC server address
		"address" : "chat.freenode.net",

		// IRC server port
		"port" : 6667
	},

	// The bot's user details
	"user" : {
		"hostname" : "internet",
		"mode" : "+iw",
		"password" : null,
		"realname" : "Botty McIRC",
		"username" : "irc-js"
	}
};

irc.connect(config, function(bot) {
	/*
	 * This optional callback means the client has connected. It receives
	 * one argument: the Client instance. Use the `join()` method to join a
	 * channel:
	 */
	bot.join("#wafflestest", function(err, chan) {
		/* You get this callback when the client has joined the channel.
		 * The argument here is any eventual Error, and the Channel joined.
		 */
		if (err) {
			console.log("Could not join channel :(", err);
			return;
		}
		/*
		 * Channels also have some handy methods:
		 */
		chan.say("Hello!");
	});

	/* You can also access channels like this:
	 * `bot.channels.get("#irc-js").say("Hello!");`
	 */

	/* Often you want your bot to do something when it receives a specific type
	 * of message, or when a message contains something of interest.
	 * The `match()` method lets you do both.
	 * Look for INVITE messages and join channels:
	 */
	bot.match("MOO", function(msg) {
		/* Here the argument is a Message instance.
		 * You can look at the `from` property to see who sent it.
		 * The `reply()` method sends a message to the appropriate channel or person:
		 */
		msg.reply("MOOOOOO");
	});

	/* You can look for messages matching a regular expression.
	 * Each match group is passed as an argument to the callback function.
	 */
	bot.match(/\bsomecommand\s+([a-z]+)\s+([0-9]+)/, function(msg, letters,
			digits) {
		/* Here, the `letters` argument contains the text matched by the first group.
		 * And `digits` is the second match. More match groups means more arguments.
		 */
	});
});