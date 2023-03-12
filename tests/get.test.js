const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server') //Quando instanciado o servidor é feito um drop nos registros da tabela através do comando `process.env.NODE_ENV` do arquivo `server.js`

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('GET /contacts', () => {

    let resp; // res de resultado da requisição

    let userToken;

    before(async () => {

        const user = {email: 'jose@outlook.com', password: 'qa@123'}
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

    before (async () => {
        var server = await init();

        resp = await server.inject({
            method: 'GET',
            url: '/contacts',
            headers: {'Authorization': userToken}
        })
    })

    it('Deve retornar 200', async () => {
        expect(resp.statusCode).to.equal(200)
    })

    it('Deve retornar uma lista', async () => {
        expect(resp.result).to.be.array()
    })
})