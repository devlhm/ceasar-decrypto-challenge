const express = require("express"); // importa o módulo 'express'
const app = express(); // cria uma instância do express e salva numa constante
const http = require('http'); // importa o módulo 'http', usado para criar o servidor
const bodyParser = require('body-parser');

const server = http.createServer(app); // cria o servidor http

// porta onde o servidor vai rodar
const port = 3000;

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

    // envia o arquivo html da página, que vai ser renderizado
    res.sendFile(__dirname + '/index.html');
});

// requisição "POST" à rota "http://localhost:{numero-da-porta}/decipher"
// rota usada para decifrar o texto enviado no corpo da requisição no campo "cifrado"
// e criar um resumo criptográfico sha1, retornando-o junto com o texto descifrado
app.post('/receive-text', bodyParser.json(), (req, res, next) => {
    const body = req.body; // corpo da requisição

    const text = body.text;
    let shiftKey = parseInt(body.shift, 10);
    const operation = body.operation;
    const bfa = body.bfa;

    let processedText = '';

    if(bfa === "true") {
        for(let shift = 1; shift < 26; shift++) {
            shiftKey = shift;
            const possibility = shift.toString() + ' - ' + process(text, shiftKey, operation) + '<br/>';
            processedText += possibility;
        }
    } else {
        processedText = process(text, shiftKey, operation);
    }

    res.header('Content-Type', 'text/plain');

    if(processedText === 'unknown character') {
        res.send('err: unknown character').status(400);
    }

    res.send(processedText).status(200);
});

function process(text, shiftKey, operation) {
    const textChars = text.split("");

    const chars = {
        alphabet: [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
            'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
            'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
            'y', 'z'
        ],

        capsAlphabet: [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z'
        ],

        specialChars: [
            '1', '2', '3', '4', '5', '6', '7', '8',
            '8', '9', '0', '-', '=', '!', '@', '#',
            '$', '%', '¨', '&', '*', '(', ')', '_',
            '+', "'", '"', '¹', '²', '³', '£', '¢',
            '¬', '´', '`', '[', ']', '{', '}', '~',
            'ª', 'º', ':', ';', '.', ',', '<', '>',
            '/', '?', '°', '|', '§', ' ', '\n'
        ]
    }

    const processedTextChars = textChars.map(char => {
        const otherChar = otherChars(char, chars);
        if(otherChar === 'unknown character') {
            return 'error';
        } else if(otherChar != null) {
            return otherChar
        }

        const isCaps = char.toUpperCase() === char;

        let charIndex;

        if(!isCaps) {
            charIndex = chars.alphabet.indexOf(char);
        } else {
            charIndex = chars.capsAlphabet.indexOf(char);
        }

        let processedCharIndex;
        if(operation === 'cipher') {
            processedCharIndex = charIndex + shiftKey;

            while(processedCharIndex > 25) {
                processedCharIndex -= 26;
            }

        } else {
            processedCharIndex = charIndex - shiftKey;

            while(processedCharIndex < 0) {
                processedCharIndex += 26;
            }
        }

        console.log(processedCharIndex)

        if(!isCaps) {
            return chars.alphabet[processedCharIndex];
        } else {
            return chars.capsAlphabet[processedCharIndex];
        }
    });

    if(processedTextChars.length !== textChars.length) {
        return 'unknown character'
    }

    console.log(processedTextChars);

    const processedText = processedTextChars.join("");
    return processedText;
}

function otherChars(char, alphabets) {
    if(alphabets.specialChars.find(e => e === char)) {
        if(char === '\n') {
            return '<br/>'
        }

        return char;
    }

    if(!alphabets.alphabet.find(e => e === char) && !alphabets.capsAlphabet.find(e => e === char)) {
        return 'unknown character';
    }

    return null
}

// middleware executado quando o servidor sobe
server.listen(port, () => {

    // loga o url do servidor no console
    console.log("The server is on at http://localhost:" + port + " !");
});