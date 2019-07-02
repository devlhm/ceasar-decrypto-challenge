function request(formObject) {
    const port = 3000; // porta onde o servidor está rodando
    const backendUrl = 'http://localhost:' + port; // url para fazer requisições ao backend

    // requisição ao backend
    const xhr = new XMLHttpRequest();
    xhr.open("POST", backendUrl + '/receive-text', true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(formObject));

    xhr.onload = function(e) {
        // se a requisição foi enviada

        if(xhr.readyState == 4) {
            // se a resposta tem o código '200'

            if(xhr.status == 200) {
                console.log("YAY");
                const response = xhr.responseText; // salva a resposta do backend
                console.log(response);

                document.getElementById('result').innerHTML = response;
                document.getElementById('submit').value = "Processed!";

            // se a resposta não tem o código '200'
            } else if (xhr.status === 400) {
                document.getElementById('unknown-character').removeAttribute('hidden');
            }
        }
    }
}

export default request;