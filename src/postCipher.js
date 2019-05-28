function postDecipher(event, token) {
    event.target.innerHTML = 'Posting...'; // define o texto do botão "Post"
    event.target.disabled = true; // desabilita o botão "Post"

    // url para requisição "POST" da api do desafio
    const apiPostUrl = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=" + token;
    console.log(apiPostUrl);

    // requisição "GET" para o backend, que recebe o arquivo 'answer.json' como resposta
    const xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:3000/get-file');
    xhr.send();
    xhr.onload = function(e) {
        // se a resposta foi recebida e o seu código for "200"
        if(xhr.readyState == 4 && xhr.status == 200) {

            // cria um novo arquivo chamado 'answer.json', com o valor a ser submetido à api como seu conteúdo,
            // e salva-o numa constante
            const jsonFile = new File([xhr.responseText], 'answer.json', {
                type: 'application/json'
            })
            
            // cria um objeto do tipo "FormData",
            // que equivale à dados de um formulário
            // esse formulário possui um campo chamado 'answer'
            // e seu valor é o arquivo com o valor a ser submetido à api
            const formData = new FormData();
            formData.append('answer', jsonFile, 'answer.json');

            // requisição "POST" à api do desafio
            const xhr1 = new XMLHttpRequest();
            xhr1.open("POST", 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=2fa463a6cfe670651d81b56cafd38d2c36e392c3');
            // xhr1.setRequestHeader('Content-Type', 'multipart/form-data'); // define o cabeçalho 'Content-Type' da requisição
            xhr1.send(formData); // envia a requisição com a constante "formData" sendo o seu corpo

            xhr1.onload = function(e) {
                if(xhr1.readyState == 4 && xhr1.status == 200) {
                    console.log(xhr1.responseText);

                    // define o texto do botão "Post" como 'Posted!' se a requisição foi realizada com sucesso
                    event.target.innerHTML = 'Posted!';
                }

                if(xhr1.status != 200) {
                    console.log(xhr1.responseText);
                }
            }
        }
    }
}

export default postDecipher;