import './index.css'; // importa o arquivo que estiliza a página
import getCipher from './getCipher'; // importa a função 'getCipher' do arquivo 'getCipher.js'
import postCipher from './postCipher'; // importa a função 'postCipher' do arquivo 'postCipher.js'

const getButton = document.getElementById("get-button"); // botão para fazer a requisição à api do desafio
const postButton = document.getElementById("post-button");

const token = "2fa463a6cfe670651d81b56cafd38d2c36e392c3"; // token para fazer requisições à api

// chama a função "getCipher" ao clicar no botão "Get Cipher"
getButton.onclick = function(e) {
    getCipher(e, token);
}

// chama a função "postCipher" ao clicar no botão "Post" (inicialmente invisível)
postButton.onclick = function(e) {
    postCipher(e, token);
}