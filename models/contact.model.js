// const mongoose = require('mongoose');

// const Schema = mongoose.Schema

// const contactSchema = new Schema({
//     name: String,
//     number: String,
//     description: String,
//     userId: String
// });

// module.exports = mongoose.model('Contact', contactSchema);

// Criado o modelo de schema novo contato com nome, número, assunto e userId para que seja vinculado o contato a um usuário

const mongoose = require('mongoose');

const Schema = mongoose.Schema

const contactSchema = new Schema({
    petName: String,
    petSpecies: String,
    petGender: String,
    petBirthday: String,
    petBreed: String,
    petOwner: String,
    petAddress: String,
    petOwnerNumber: String,
    userId: String
});

module.exports = mongoose.model('Contact', contactSchema);