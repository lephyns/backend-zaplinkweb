const contactController = require('../controllers/contact.controller')

module.exports = [
    {
        method: 'GET',
        path: '/contacts',
        handler: contactController.list
    },
    {
        method: 'POST', 
        path: '/contacts',
        handler: contactController.create
    },
    {
        method: 'DELETE', 
        path: '/contacts/{contactId}',
        handler: contactController.remove
    }
]

// Method é o tipo da requisição
// Path é onde será feita essa requisição (endpoint)
// Handler é o que será feito nela
// Essas funções criadas (list, create) estão localizadas no arquivo `contact.controller.js`

