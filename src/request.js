function request(formObject) {
    const port = 3000;
    const backendUrl = 'http://localhost:' + port;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", backendUrl + '/receive-text', true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(formObject));

    xhr.onload = function(e) {

        if(xhr.readyState == 4) {

            if(xhr.status == 200) {
                const response = xhr.responseText;

                document.getElementById('result').innerHTML = response;
                document.getElementById('submit').value = "Processed!";
                document.getElementById('unknown-character').setAttribute('hidden', true);

            } else if (xhr.status === 400) {
                document.getElementById('unknown-character').removeAttribute('hidden');
                document.getElementById('submit').value = "Error :(";
            }
        }
    }
}

export default request;