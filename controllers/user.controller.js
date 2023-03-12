const userModel = require('../models/user.model')

const md5 = require('md5')

module.exports = {
    async create(request, h) { //Função para criar um usuário, como estamos trabalhando com hapi.dev tem que ter a estrutura dele: request, h
        if (request.payload === null) //Questiona se o payload é nulo
            return h.response({ message: 'Not json' }).code(400)

        // console.log(request.payload) //Pega o valor da requisição e exibe no console

        // console.log(!user.name) //O operador ! questiona se o objeto user.name é undefined e exibe no console

        if (!request.payload.email) //Verifica se o objeto user.name é undefined 
            return h.response({ message: 'E-mail is required.' }).code(409) //Se cair dentro desse if irá devolver o status code 409. Se cair nesse if o código é finalizado

        if (!request.payload.password)
            return h.response({ message: 'Password is required.' }).code(409)//Além de retornar o statuscode ele também devolve uma mensagem que é verificada no teste `post.test.js`

        // Guardado essa instancia (new userModel) em uma constante
        const user = new userModel({ //Feito uma nova instancia para userModel 
            email: request.payload.email,
            password: md5(request.payload.password) //Com a pacote do node MD5 é criptografado a senha do usuário
        })

        const dup = await userModel.findOne({ email: user.email }).exec(); //Essa função busca um registro no banco para saber se já existe

        if (dup)
            return h.response({ error: 'Duplicated user.' }).code(409) //Retorna mensagem se o numero de telefone que está tentando cadastrar é o mesmo de um já existente
        try {
            let result = await user.save() //Chamado o objeto user e invocado a função salvar. Desta forma será salvo as informações no banco de dados através do Mongoose
            return h.response(result).code(200); //Na `response` estamos enviando o resultado esperado. Chamado a função `code()` colocando o status 200
        } catch (error) {
            return h.response(error).code(500)
        }
    },
    async login(request, h) { //Função para fazer login

        if (request.payload === null) //Questiona se o payload é nulo
            return h.response({ message: 'Not json' }).code(400)

        const { email, password } = request.payload

        try {
            const user = await userModel.findOne({ email: email, password: md5(password) }).exec(); //Essa função busca um registro no banco para saber se já existe

            if (!user)
                return h.response({ error: 'Unauthorized' }).code(401)

            return h.response({ user_token: user._id }).code(200)
        } catch (error) {
            return h.response(error).code(500)
        }
    }
}