import './index.css';

const button = document.getElementById("get-button");
const port = process.env.port || 3000;

const backendUrl = 'http://localhost:' + port;

function getCipher(e) {
    e.target.innerHTML = "Loading...";

    const token = "2fa463a6cfe670651d81b56cafd38d2c36e392c3";
    const apiUrl = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=" + token;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.send();

    xhr.onload = function(e) {
        if(xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);

            const cipheredText = response.cifrado;
            const shiftKey = response.numero_casas;

            button.style.display = "none";

            document.getElementById("cipher").style.display = "table";

            document.getElementById('deciphered').innerHTML = 'Deciphering...';
            document.getElementById('resume').innerHTML = 'Generating...';
            reqDecipher(response);
            document.getElementById("ciphered").innerHTML = cipheredText;
            document.getElementById("shift").innerHTML = shiftKey;
        }
    }
}

function reqDecipher(apiResponse) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", backendUrl + '/decipher', true);

    xhr.setRequestHeader('Content-Type' ,'application/json');
    xhr.send(JSON.stringify(apiResponse), null, '\t');

    xhr.onload = function(e) {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                console.log("YAY");
                const response = JSON.parse(xhr.responseText);

                console.log(response);

                document.getElementById('deciphered').innerHTML = response.deciphered;
                document.getElementById('resume').innerHTML = response.sha1Resume;
            } else {
                console.log("Error :(");
            }
        }
    }
}

button.onclick = function(e) {
    getCipher(e);
}