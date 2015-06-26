var mongoose = require('mongoose'),
	schema = {
		'avatar': String,
		'name': String,
		'info': Array,
		'phones': Array,
		'emails': Array,
		'vk': Array,
		'facebook': Array,
		'twitter': Array,
		'pinterest': Array
	},
	ContactModel = mongoose.model('contact', schema);

var Contact = function() {};

Contact.getContact = function(callback) {
	ContactModel.find({}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Contact.updateContact = function(data, callback) {
	ContactModel.find({}).remove().exec();

	var newContact = new ContactModel({'avatar': data.avatar, 'name': data.name, 'info': data.info, 'phones': data.phones, 'emails': data.emails, 'vk': data.vk, 'facebook': data.facebook, 'twitter': data.twitter, 'pinterest': data.pinterest});

	newContact.save(function(error, data) {
		callback(error, data);
	});
}
Contact.updatePartContact = function(contact, callback) {
	ContactModel.find({}, function(error, data) {
		data[0].phones = contact.phones;
		data[0].emails = contact.emails;
		data[0].vk = contact.vk;
		data[0].facebook = contact.facebook;
		data[0].twitter = contact.twitter;
		data[0].pinterest = contact.pinterest;
		data[0].save(function(error, data) {
			callback(error, data);
		});
	});
}
module.exports = Contact;
