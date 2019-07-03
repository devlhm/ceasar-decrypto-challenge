const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require('body-parser');

const server = http.createServer(app);

const port = 3000;

app.use(express.static('src'));
app.use(express.static('dist'));

app.use((req, res, next) => {
    const requestMethod = req.method;
    const requestPath = req.path;

    console.log(requestMethod + ' request received at "' + requestPath + '"');

    next();
});

app.get('/', (req, res, next) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(__dirname + '/index.html');
});

app.post('/receive-text', bodyParser.json(), (req, res, next) => {
    const body = req.body;

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

    if(!processedText) {
        res.sendStatus(400);
    } else {
        res.send(processedText).status(200);
    }
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

    let processedTextChars = textChars.map(char => {
        const otherChar = otherChars(char, chars);
        if(otherChar === 'unknown character') {
            return ''
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

        if(!isCaps) {
            return chars.alphabet[processedCharIndex];
        } else {
            return chars.capsAlphabet[processedCharIndex];
        }
    });

    if(processedTextChars.length !== textChars.length) {
        return null
    } else {
        const processedText = processedTextChars.join("");
        return processedText;
    }
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

server.listen(port, () => {
    console.log("The server is on at http://localhost:" + port + " !");
});