const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const fs = require('fs');
const sha1 = require('js-sha1');

const server = http.createServer(app);
const port = process.env.port || 3000;

app.use(express.static('src'));
app.use(express.static('dist'));

// app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json');
    if(req.method == "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET, POST');
    }

    next();
});

app.use((req, res, next) => {
    const requestMethod = req.method;
    const requestPath = req.path;

    console.log(requestMethod + ' request received at "' + requestPath + '"');

    next();
});

app.get('/', (req, res, next) => {
    res.header('Content-Type', 'text/html')

    if(fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath);
    }

    res.sendFile(__dirname + '/index.html');
});

const jsonPath = './src/answer.json';

app.post('/decipher', bodyParser.json(), (req, res, next) => {
    const body = req.body;
    fs.writeFileSync(jsonPath, JSON.stringify(body, null, '\t'));

    res.header('Content-Type', 'text/plain');

    const cipheredText = body.cifrado;
    const shiftKey = body.numero_casas;

    const cipheredTextChars = cipheredText.split("");

    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const decipheredTextChars = cipheredTextChars.map(char => {
        if(char === " " || char === ".") {
            return char;
        }

        const charIndex = alphabet.indexOf(char);
        let shiftedCharIndex = charIndex - shiftKey;

        if(shiftedCharIndex < 0) {
            shiftedCharIndex += alphabet.length;
        }
        return alphabet[shiftedCharIndex];
    });
    
    const decipheredText = decipheredTextChars.join("");
    body.decifrado = decipheredText;

    fs.writeFileSync(jsonPath, JSON.stringify(body, null, '\t'));

    const cryptoResume = resumeSha1(body)
    
    res.send(JSON.stringify({
        deciphered: decipheredText,
        sha1Resume: cryptoResume
    }, null, '\t')).status(200);
});

function resumeSha1(reqBody) {
    reqBody.resumo_criptografico = sha1(reqBody.decifrado);
    fs.writeFileSync(jsonPath, JSON.stringify(reqBody, null, '\t'));

    return reqBody.resumo_criptografico;
}

server.listen(port, () => {
    console.log("The server is on at http://localhost:" + port + "!");
});