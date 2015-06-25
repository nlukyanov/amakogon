var mongoose = require('mongoose'),
	schema = {
		'tag': String
	},
	TagsModel = mongoose.model('tags', schema);

var Tags = function() {};

Tags.getTags = function(callback) {
	TagsModel.find({}, function(error, data) {
		if ( error ) {
			callback(error);
		}
		else {
			callback(null, data);
		}
	});
}
Tags.validateTag = function(tag, callback) {
	TagsModel.findOne({'tag': tag}, function(error, data) {
		if ( data == null ) {
			callback(true);
		}
		else {
			callback(false);
		}
	});
}
Tags.addTag = function(tagItem, callback) {
	var self = this,
		index = 0;

	validateAndAdd(tagItem.length);
	function validateAndAdd(length) {
		if ( index < length ) {
			self.validateTag(tagItem[index], function(resp) {
				if ( resp ) {
					var tag = new TagsModel({tag: tagItem[index]});

					tag.save(function() {
						index ++;
						validateAndAdd(length);
					});
				}
				else {
					index ++;
					validateAndAdd(length);
				}
			});
		}
		if ( index == tagItem.length - 1 ) {
			callback();
		}
	}
}
Tags.removeTag = function(tag, callback) {
	TagsModel.findOne({'tag': tag}).remove().exec();
	callback();
}
module.exports = Tags;
