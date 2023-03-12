const userController = require('../controllers/user.controller')

module.exports = [
    {
        method: 'POST',
        path: '/user', //Rota do usuário
        handler: userController.create
    },
    {
        method: 'POST', 
        path: '/session',
        handler: userController.login
    }
]