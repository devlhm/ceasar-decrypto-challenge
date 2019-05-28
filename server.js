const express = require("express"); // importa o módulo 'express'
const bodyParser = require('body-parser'); // módulo que foi usado para passar o corpo das requisições de JSON para objeto JS
const app = express(); // cria uma instância do express e salva numa constante
const http = require('http'); // importa o módulo 'http', usado para criar o servidor
const fs = require('fs'); // importa o módulo 'fs' (File System), usado para criar e manipular o arquivo 'answer.json'
const sha1 = require('js-sha1'); // importa o módulo 'js-sha1', utilizado para criar o resumo criptográfico sha-1

const server = http.createServer(app); // cria o servidor http

// porta onde o servidor vai rodar
const port = process.env.port || 3000;

// subindo diretórios estáticos para o servidor
app.use(express.static('src'));
app.use(express.static('dist'));

const jsonPath = './src/answer.json'; // caminho para o arquivo 'answer.json'

// middleware que loga no console o verbo da requisição recebida e o caminho
app.use((req, res, next) => {
    const requestMethod = req.method;
    const requestPath = req.path;

    console.log(requestMethod + ' request received at "' + requestPath + '"');

    next();
});

// requisição "GET" à rota-raiz (é realizada quando o cliente acessa o URL "http://localhost:{numero-da-porta}")
app.get('/', (req, res, next) => {
    res.header('Content-Type', 'text/html') // define o cabeçalho 'Content-Type'

    // deleta o arquivo answer.json se ele existir
    if(fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath);
    }

    // envia o arquivo html da página, que vai ser renderizado
    res.sendFile(__dirname + '/index.html');
});

// requisição "POST" à rota "http://localhost:{numero-da-porta}/decipher"
// rota usada para decifrar o texto enviado no corpo da requisição no campo "cifrado"
// e criar um resumo criptográfico sha1, retornando-o junto com o texto descifrado
app.post('/decipher', bodyParser.json(), (req, res, next) => {
    const body = req.body; // corpo da requisição

    // cria o arquivo 'answer.json' em './src/',
    // e coloca um objeto JSON contendo a resposta da api do desafio nele
    fs.writeFileSync(jsonPath, JSON.stringify(body, null, '\t'));

    res.header('Content-Type', 'text/plain'); // define o cabeçalho 'Content-Type'

    const cipheredText = body.cifrado;
    const shiftKey = body.numero_casas;

    // constante contendo uma array com todos os caracteres do texto enviado no corpo da requisição
    const cipheredTextChars = cipheredText.split("");

    // array contendo o alfabeto
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; 

    // função que é executada uma vez para cada elemento da array "cipheredTextChars",
    // recebendo tal elemento como parâmetro e retornando-o descriptografado,
    // salvando-o na array "decipheredTextChars"
    const decipheredTextChars = cipheredTextChars.map(char => {

        // se o elemento for um espaço em branco ou um ponto, será retornado sem modificações,
        // e o próximo elemento da array começa a ser processado
        if(char === " " || char === ".") {
            return char;
        }

        // verifica a posição do elemento atual na array "alphabet",
        // que seria equivalente à posição de tal elemento (letra) no alfabeto
        const charIndex = alphabet.indexOf(char);

        // posição da letra {numero de posições avançadas na criptografia. no caso, 12} posições atrás no alfabeto,
        // que seria equivalente à posição da letra descriptografada
        let shiftedCharIndex = charIndex - shiftKey;

        // se a posição da letra descriptografada for um número negativo,
        // somá-la com o numero de elementos na array "alphabet",
        // para que ela fique positiva, e na posição correta
        if(shiftedCharIndex < 0) {
            shiftedCharIndex += alphabet.length;
        }

        // retorna o elemento da array "alphabet" na posição da letra descriptografada,
        // que seria equivalente à letra descriptografada
        return alphabet[shiftedCharIndex];
    });
    
    // junta todos os caracteres da array "decipheredTextChars", em uma única string
    // que seria equivalente ao texto descriptografado
    const decipheredText = decipheredTextChars.join("");

    // atualiza o campo "decifrado" do corpo da requisição com o texto descriptografado
    body.decifrado = decipheredText;

    // sobscreve o arquivo 'answer.json' com o corpo atualizado da requisição atualizado, em formato JSON
    fs.writeFileSync(jsonPath, JSON.stringify(body, null, '\t'));

    // chama a função que cria um resumo sha1 do texto descriptografado,
    // atualiza o arquivo 'answer.json'
    // e salva o valor retornado numa constante
    const cryptoResume = resumeSha1(body)
    
    // envia um objeto JSON como resposta para o frontend,
    // com o texto decriptografado e o seu resumo sha1 no corpo
    // da resposta
    res.send(JSON.stringify({
        deciphered: decipheredText,
        sha1Resume: cryptoResume
    }, null, '\t')).status(200);
});

// função que cria um resumo sha1 do texto descriptografado e atualiza o arquivo 'answer.json'
function resumeSha1(reqBody) {

    // atualiza o campo "resumo_criptografico" do corpo da requisição com o resumo sha1
    // (feito chamando o método "sha1") do texto decifrado
    reqBody.resumo_criptografico = sha1(reqBody.decifrado);

    // atualiza o arquivo 'answer.json' com o corpo da requisição, em formato JSON,
    // que contém o campo "resumo_criptografico" preenchido
    fs.writeFileSync(jsonPath, JSON.stringify(reqBody, null, '\t'));

    // retorna o campo "resumo_criptografico" do corpo da requisição
    return reqBody.resumo_criptografico;
}

// envia o arquivo 'answer.json' como resposta
app.get('/get-file', (req, res, next) => {
    res.sendFile(__dirname + '/src/answer.json');
});

// middleware executado quando o servidor sobe
server.listen(port, () => {

    // loga o url do servidor no console
    console.log("The server is on at http://localhost:" + port + " !");
});