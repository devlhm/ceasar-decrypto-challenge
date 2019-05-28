import reqDecipher from './reqDecipher'; // importa a função 'reqDecipher' do arquivo 'reqDecipher.js'

function getCipher(event, token) {
    event.target.innerHTML = "Loading..."; // define o texto do botão

    // url para requisições "GET" à api do desafio
    const apiGetUrl = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=" + token;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiGetUrl, true); 
    xhr.send(); // envia uma requisição GET para a api do desafio

    xhr.onload = function(e) {

        // se a requisição foi enviada e a resposta tem o código http '200'
        if(xhr.readyState == 4 && xhr.status == 200) { 

            // resposta da api
            const response = JSON.parse(xhr.responseText);

            const cipheredText = response.cifrado;
            const shiftKey = response.numero_casas;

            event.target.style.display = "none"; // tira o botão "Get Cipher" da página

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

            // torna o botão "Post" visível
            document.getElementById('post-button').style.display = 'block';
        }
    }
}

export default getCipher;