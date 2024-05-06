const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const booksSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    name: { type: String },
    author: { type: String},
    condition: { type: Number},
    orderNum: { type: Number},
    etukansikuva: {type: String} ,
    takakansikuva: {type: String}, 
    lisakuva1: {type: String},
    hankintahinta: {type: Number},
    hankintaAika: {type: String},
    kuvausteksti: {type: String},
    piirtajat: {type: String},
    ensipainosvuosi: {type: Number},
    painos: {type: Number},
    series: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series'
    }
});

module.exports = mongoose.model('Books', booksSchema)