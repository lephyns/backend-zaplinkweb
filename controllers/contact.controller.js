const contactModel = require('../models/contact.model')
const userModel = require('../models/user.model')

const auth = async (userId) => {

    const foundUser = await userModel.findById(userId) //findById função do mongoose para buscar o usuário pelo ID

    if(!foundUser)
        throw {error: 'Unauthorized', code:401}
}

module.exports = {
    async create(request, h) { //cria um contato

        const userId = request.headers.authorization //Obtém o usuário do header

        try {
            await auth(userId)
        } catch (error) {
            return h.response(error).code(error.code)
        }

        if (request.payload === null) //Questiona se o payload é nulo
            return h.response({message:'Not json'}).code(400)

        // console.log(request.payload) //Pega o valor da requisição e exibe no console

        // Guardado essa instancia (new contactModel) em uma constante
        const contact = new contactModel({ //Feito uma nova instancia para contactModel 
            petName: request.payload.petName,
            petSpecies: request.payload.petSpecies,
            petGender: request.payload.petGender,
            petBirthday: request.payload.petBirthday,
            petBreed: request.payload.petBreed,
            petOwner: request.payload.petOwner,
            petAddress: request.payload.petAddress,
            petOwnerNumber: request.payload.petOwnerNumber,
            userId: userId
        })

        // console.log(contact.petName) //O operador ! questiona se o objeto contact.name é undefined e exibe no console

        if (!contact.petName) //Verifica se o objeto contact.name é undefined 
            return h.response({message:'Pet name is required.'}).code(409) //Se cair dentro desse if irá devolver o status code 409. Se cair nesse if o código é finalizado

        if (!contact.petOwnerNumber)
            return h.response({message:'Number is required.'}).code(409)//Além de retornar o statuscode ele também devolve uma mensagem que é verificada no teste `post.test.js`

        if (!contact.petOwner)
            return h.response({message:'Pet owner is required.'}).code(409)

        const dup = await contactModel.findOne({petOwnerNumber: contact.petOwnerNumber, userId: userId}).exec(); //Essa função busca um registro no banco

        if (dup)
        return h.response({error: 'Duplicated number.'}).code(409) //Retorna mensagem se o numero de telefone que está tentando cadastrar é o mesmo de um já existente
        try {
            let result = await contact.save() //Chamado o objeto contact e invocado a função salvar. Desta forma será salvo as informações no banco de dados através do Mongoose
            return h.response(result).code(200); //Na `response` estamos enviando o resultado esperado. Chamado a função `code()` colocando o status 200
        } catch (error) {
            return h.response(error).code(500)
        }
    },
    async remove(request, h) {

        const userId = request.headers.authorization //Obtém o usuário do header

        try {
            await auth(userId)
        } catch (error) {
            return h.response(error).code(error.code)
        }

        try {

            const user = await contactModel.findOne({ _id: request.params.contactId, userId: userId}) //Irá buscar um contato com o contato ID passado no parâmetro que no caso é o ID do contato que será deletado do banco

            if(!user)
                return h.response({}).code(404) //Se não encontrar um registro com o contatoId e UserId informado no header será exibido 404

            await contactModel.deleteOne({ _id: request.params.contactId, userId: userId}) //O campo precisa ser `_id` porque é a coluna do banco.
            return h.response({}).code(204) //Código 204 (no content)
        } catch (error) {
            return h.response(error).code(500) //Se algum erro ocorrer será visualizado
        }
    },
    async list(request, h) {

        const userId = request.headers.authorization //Obtém o usuário do header

        try {
            await auth(userId)
        } catch (error) {
            return h.response(error).code(error.code)
        }

        const contacts = await contactModel.find({userId: userId}).exec(); //Busca as modelagens no banco de dados
        return contacts;
    }
}

// async para ser assíncrona e ter uma promessa
// await entrega a promessa
// request é a requisição
// h é o retorno e pode ser manipulado como fizemos na constante contact (status code)
// Todos os métodos do mongoose trabalham com promessa. Então nossas funções `create(request, h)` precisam do async

// Adicionado autenticação e o cadastro de contatos só funcionará se o usuário tiver autorização o qual é passado no ID do headers que é o próprio token do usuário cadastrado no sistema
// Adicionado sistema de autenticação também dentro da função remove() para que seja deletado o contato apenas do usuário logado
// Adicionado sistema de autenticação para a função list() que só irá exibir os contatos relacionados ao ID do header