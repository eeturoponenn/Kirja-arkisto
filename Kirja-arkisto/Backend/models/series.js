const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const seriesSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    name: { type: String, required: true },
    description: {type: String, required: true},
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }]

});

module.exports = mongoose.model('Series', seriesSchema)