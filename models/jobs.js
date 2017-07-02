'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var jobsSchema = new Schema ({
	title: {
		type: String,
		trim: true,
		require: true
	},
	description:{
		type: String,
		trim: true,
		require: true
	},
	link: {
		type: String,
		require: true,
		unique: true	
	},
	about: {
		type: String,
		require: true
	},
	notes: {
		type: [String],
	}
})

var Jobs = mongoose.model('Jobs', jobsSchema)

module.exports = Jobs