var irc = require('irc');

var options = {
	    userName: 'wafflesbrobot',
	    realName: 'nodeJS IRC client',
	    port: 6667,
	    debug: true,
	    showErrors: true,
	    autoRejoin: true,
	    autoConnect: true,
	    channels: ['#wafflestest'],
	    secure: false,
	    selfSigned: false,
	    certExpired: true,
	    floodProtection: true,
	    floodProtectionDelay: 1000,
	}

var client = new irc.Client('chat.freenode.net', 'wafflesbrobot', options);

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
});