const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server') //Quando instanciado o servidor é feito um drop nos registros da tabela através do comando `process.env.NODE_ENV` do arquivo `server.js`

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('DELETE /contacts', () => {

    let userToken;

    before(async () => {

        const user = {email: 'joao@outlook.com', password: 'qa@123'}
        var server = await init();

        await server.inject({
            method: 'POST',
            url: '/user',
            payload: user //Informado null no objeto payload que é o json vazio
        })

        resp = await server.inject({
            method: 'POST',
            url: '/session',
            payload: user //Informado null no objeto payload que é o json vazio
        })

        // console.log(resp.result)

        userToken = resp.result.user_token
    })

    describe('Dado que tenho um contato indesejado', () => {

        const contact = { //Como os dados não vão ser alterados colocamos em uma constante ao invés de um let
            name: "Amanda Silva",
            number: "48 996561425",
            description: "Orçamento para aulas de Canto"
        }

        let server;
        let resp;
        let contactId; //Let porque sempre será alterado essa informação

        before(async () => {
            server = await init()

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })

            contactId = resp.result._id //Para pegar o ID do usuário a ser deletado
        })

        it('Quando apago este contato', async () => {
            resp = await server.inject({ //Aproveitando a conexão feita para fazer um inject do tipo delete
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 204', () => {
            expect(resp.statusCode).to.equal(204)
        })
    })

    describe('Dado que não tenho acesso', () => {

        const contact = { //Como os dados não vão ser alterados colocamos em uma constante ao invés de um let
            name: "Amanda Silva",
            number: "48 996561425",
            description: "Orçamento para aulas de Canto"
        }

        let server;
        let resp;
        let contactId; //Let porque sempre será alterado essa informação

        before(async () => {
            server = await init()

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })

            contactId = resp.result._id //Para pegar o ID do usuário a ser deletado
        })

        it('Quando tento apagar este contato', async () => {
            resp = await server.inject({ //Aproveitando a conexão feita para fazer um inject do tipo delete
                method: 'delete',
                url: '/contacts/' + contactId,
                headers: {'Authorization': '640382498946f24906b9abcd'}
            })
        })

        it('Deve retornar 401', () => {
            expect(resp.statusCode).to.equal(401)
        })
    })
})