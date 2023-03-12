const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { init } = require('../server')

const { expect } = Code;
const { before, describe, it } = exports.lab = Lab.script();

describe('POST /contacts', () => {

    let resp; //resp de resposta da requisição
    let userToken;

    before(async () => {

        const user = {email: 'rafaelrabelodasilva@outlook.com', password: 'qa@123'}
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

    describe('Quando não tenho acesso', () => {
        before(async () => { //O describe não consegue fazer testes então é necessário colocar o gancho before como se fosse o background do teste
            var server = await init();

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: null, //Informado null no objeto payload que é o json vazio
                headers: {'Authorization': '640382498946f24906b9abcd'} //Token que não existe, precisa ter 24 caracteres que é o modelo padrão que temos no userID (objeto do MongoBD)
            })
        })

        it('Deve retornar 400', async () => {
            expect(resp.statusCode).to.equal(401)
        })
    })

    describe('Quando o payload é nulo', () => {
        before(async () => { //O describe não consegue fazer testes então é necessário colocar o gancho before como se fosse o background do teste
            var server = await init();

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: null, //Informado null no objeto payload que é o json vazio
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 400', async () => {
            expect(resp.statusCode).to.equal(400)
        })
    })

    describe('Quando o payload é bonitão', () => {
        before(async () => { //O describe não consegue fazer testes então é necessário colocar o gancho before como se fosse o background do teste
            var server = await init();

            let contact = {
                name: "Rosana Silva",
                number: "48 996561406",
                description: "Orçamento para aulas de Node.js"
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 200', async () => {
            expect(resp.statusCode).to.equal(200)
        })

        it('Deve retornar o ID do contato', async () => {
            // console.log(resp.result._id) //Exibe o resultado no console
            expect(resp.result._id).to.be.a.object() //Valida se o que foi salvo é um objeto (MongoDB trabalha com objetos não com string)
            expect(resp.result._id.toString().length).to.equal(24) //Validado a quantidade de caracteres do objeto já que os caracteres do ID sempre vão ter a mesma quantidade
        })
    })

    describe('Quando o contato já existe', () => {
        before(async () => { //O describe não consegue fazer testes então é necessário colocar o gancho before como se fosse o background do teste
            var server = await init();

            let contact = {
                name: "Fernando duplicado",
                number: "48996569999",
                description: "Teste contato duplicado"
            }

            await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })
    })

    describe('Quando o payload não tem o nome', () => {
        before(async () => {
            var server = await init();

            let contact = {
                // name: "Rosana Silva", //Tirado o objeto nome propositalmente para apresentar erro 409 que foi criado dentro do arquivo `contact.controller.js`
                number: "48 996561406",
                description: "Orçamento para aulas de Node.js"
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => { //Aqui testa quando não existe o objeto nome
            expect(resp.statusCode).to.equal(409)
        })

        it('Deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Name is required.')
        })
    })

    describe('Quando nome está em branco', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "", //Deixado o objeto vazio propositalmente
                number: "48 996561406",
                description: "Orçamento para aulas de Node.js"
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => { //Aqui testa quando o objeto nome está vazio
            expect(resp.statusCode).to.equal(409)
        })

        it('Deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Name is required.')
        })
    })

    describe('Quando o payload não tem WhatsApp', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Rosana Silva",
                // number: "48 996561406",
                description: "Orçamento para aulas de Node.js"
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('Deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Number is required.')
        })
    })

    describe('Quando número está em branco', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Rosana Silva",
                number: "",
                description: "Orçamento para aulas de Node.js"
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('Deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Number is required.')
        })
    })

    describe('Quando o payload não tem assunto', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Rosana Silva",
                number: "48 996561406"
                // description: "Orçamento para aulas de Node.js"
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('Deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Description is required.')
        })
    })

    describe('Quando o assunto está em branco', () => {
        before(async () => {
            var server = await init();

            let contact = {
                name: "Rosana Silva",
                number: "48 996561406",
                description: ""
            }

            resp = await server.inject({
                method: 'POST',
                url: '/contacts',
                payload: contact,
                headers: {'Authorization': userToken}
            })
        })

        it('Deve retornar 409', async () => {
            expect(resp.statusCode).to.equal(409)
        })

        it('Deve retornar uma mensagem', async () => {
            expect(resp.result.message).to.equal('Description is required.')
        })
    })
})

// Para executar o teste basta digitar no terminal no diretório do backend
// $ npm run test
// Esse script irá rodar o lab
// Função `toString()` transforma o objeto em string
// Os códigos de erro criados estão dentro do arquivo `contact.controller.js`