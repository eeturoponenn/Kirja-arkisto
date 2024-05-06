const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const librarySchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
    series: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series'
    }]

});

module.exports = mongoose.model('Library', librarySchema)
