var fs = require('fs');
var mailgunConfig = fs.readFileSync(__dirname + '/config.json', 'utf8');
var mailgun = require('mailgun-js')(JSON.parse(mailgunConfig));

/**
 * b = [{"John": "john@doe.ca"}, {"June": "june@april.com"}, "jane@joe.co.uk"]
 * -> this.value = "John <john@doe.ca>,June <june@april.com>,jane@joe.co.uk"
 * NOTE: if you're using as a from field, there should only be one item in the array
 */
function MailToOrFromField(b) {
	if (!Array.isArray(b)) {
		throw new Error("Invalid parameter: " + b);
	};
	this.value = b.reduce(function(accum, current) {
		if (typeof current == "string") { // assume it's an email address
			return (accum ? accum + "," : "") + current;
		} else {
			var Name = Object.keys(current)[0];
			var Email = current[Name];
			return (accum ? accum + "," : "") + Name + " <" + Email + ">";
		};
	}, false);
}

module.exports = {
	/**
	 *  @param data:
	 *	from: MailToOrFromField
	 *	to: MailToOrFromField
	 *	subject: string
	 *  html: string
	 */
	create: function(data) {
		var from = data.from,
			to = data.to,
			subject = data.subject,
			html = data.html;
		if (!from || !to || !subject || !html) {
			return;
		};
		if (!(from instanceof MailToOrFromField)
			|| !from.value.length
			|| (from.value.split(',').length != 1)
			|| !(to instanceof MailToOrFromField)
			|| !to.value.length)
		{
			return;
		};
		return {
			send: function(callback) {
				data.from = data.from.value;
				data.to = data.to.value;
				mailgun.messages().send(data, callback);
			},
		};
	},
	builders: {
		MailToOrFromField,
	},
}