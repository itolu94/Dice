'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var jobsSchema = new Schema ({
	title: {
		type: String,
		trim: true
	},
	description:{
		type: String,
		trim: true
	},
	link: {
		type: String,
	}
})

var Jobs = mongoose.model('Jobs', jobsSchema)

module.exports = Jobs