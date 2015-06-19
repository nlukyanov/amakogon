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
Tags.addTag = function(tagItem, callback) {
	for ( i in tagItem ) {
		var tag = new TagsModel({tag: tagItem[i]});

		TagsModel.findOne({'tag': tagItem[i]}, function(error, data) {
			if ( data == null ) {
				tag.save(function() {
					callback();
				});
			}
		});
	}
}
module.exports = Tags;
