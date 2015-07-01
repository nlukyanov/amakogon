var mongoose = require('mongoose'),
	schema = {
		'avatar': String,
		'name': String,
		'info': Array,
		'phones': Array,
		'emails': Array,
		'skype': Array,
		'vk': Array,
		'facebook': Array,
		'twitter': Array,
		'pinterest': Array,
		'linkedin': Array
	},
	ContactModel = mongoose.model('contact', schema);

var Contact = function() {};
var removeHashKey = function(arr) {
	arr = arr.map(function(item) {
		delete item['$$hashKey'];
		return item;
	});
	return arr;
}

Contact.getContact = function(callback) {
	ContactModel.find({}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});

	/*ContactModel.find({}).remove().exec();
	var newContact = new ContactModel({'name': 'Анастасия Макогон', 'avatar': [], 'info': [], 'phones': [], 'emails': [], 'skype': [], 'vk': [], 'facebook': [], 'twitter': [], 'pinterest': [], 'linkedin': []});
	newContact.save();*/
}
Contact.updateContact = function(data, callback) {
	/*ContactModel.findOneAndUpdate({'name': data.name}, {''}, function(error, data) {
		callback(error, data);
	});*/
}
Contact.updatePartContact = function(data, callback) {
	ContactModel.findOneAndUpdate({'name': data.name}, {'phones': removeHashKey(data.phones), 'emails': removeHashKey(data.emails), 'skype': removeHashKey(data.skype), 'vk': removeHashKey(data.vk), 'facebook': removeHashKey(data.facebook), 'twitter': removeHashKey(data.twitter), 'pinterest': removeHashKey(data.pinterest), 'linkedin': removeHashKey(data.linkedin)}, function(error, data) {
		callback(error, data);
	});
}
module.exports = Contact;
