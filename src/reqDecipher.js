function reqDecipher(apiResponse) {
    const port = process.env.port || 3000; // porta onde o servidor está rodando
    const backendUrl = 'http://localhost:' + port; // url para fazer requisições ao backend

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

export default reqDecipher;