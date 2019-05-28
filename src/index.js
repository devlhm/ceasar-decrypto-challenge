import './index.css'; // importa o arquivo que estiliza a página

const button = document.getElementById("get-button"); // botão para fazer a requisição para a api do desafio
const port = process.env.port || 3000; // porta onde o servidor está rodando

const backendUrl = 'http://localhost:' + port; // url para fazer requisições ao backend

function getCipher(e) {
    e.target.innerHTML = "Loading..."; // define o texto do botão

    const token = "2fa463a6cfe670651d81b56cafd38d2c36e392c3";
    const apiUrl = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=" + token; // url da api do desafio

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true); 
    xhr.send(); // envia uma requisição GET para a api do desafio

    xhr.onload = function(e) {

        // se a requisição foi enviada e a resposta tem o código http '200'
        if(xhr.readyState == 4 && xhr.status == 200) { 

            // resposta da api
            const response = JSON.parse(xhr.responseText);

            const cipheredText = response.cifrado;
            const shiftKey = response.numero_casas;

            button.style.display = "none"; // tira o botão "Get Cipher" da página

            document.getElementById("cipher").style.display = "table"; // mostra a tabela "Cipher"

            // valores temporários para elementos da tabela
            document.getElementById('deciphered').innerHTML = 'Deciphering...';
            document.getElementById('resume').innerHTML = 'Generating...';

            // função que faz a requisição ao backend, retornando um resumo sha1 e um texto descriptografado
            // recebe a resposta da api do desafio como parâmetro
            reqDecipher(response);

            // define valores da tabela
            document.getElementById("ciphered").innerHTML = cipheredText;
            document.getElementById("shift").innerHTML = shiftKey;
        }
    }
}

function reqDecipher(apiResponse) {

    // requisição ao backend
    const xhr = new XMLHttpRequest();
    xhr.open("POST", backendUrl + '/decipher', true);

    xhr.setRequestHeader('Content-Type' ,'application/json'); // define o cabeçalho 'Content-Type' da requisição
    xhr.send(JSON.stringify(apiResponse), null, '\t'); // envia a requisição, com o corpo contendo a resposta da api do desafio

    xhr.onload = function(e) {
        // se a requisição foi enviada

        if(xhr.readyState == 4) {
            // se a resposta tem o código '200'

            if(xhr.status == 200) {
                console.log("YAY");
                const response = JSON.parse(xhr.responseText); // salva a resposta do backend

                // define os valores restantes da tabela
                document.getElementById('deciphered').innerHTML = response.deciphered;
                document.getElementById('resume').innerHTML = response.sha1Resume;

            // se a resposta não tem o código '200'
            } else {
                console.log("Error :(");
            }
        }
    }
}

// chama a função "getCipher" ao clicar no botão "Get Cipher"
button.onclick = function(e) {
    getCipher(e);
}