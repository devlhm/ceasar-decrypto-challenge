import request from './request';

const form = document.forms[0];

for(let elem of form.elements) {
    if(elem.type === "textarea") {
        elem.oninput = e => {
            const submitBtn = document.getElementById('submit');
            submitBtn.disabled = false;
            submitBtn.value = "Submit"
        }
    }

    if(elem.id === "bfa") {
        elem.onchange = e => {
            if(e.target.checked) {
                document.getElementById('shift').disabled = true;
            } else {
                document.getElementById('shift').removeAttribute('disabled');
            }
        }
    }

    if(elem.id === "with-shift") {
        elem.onchange = e => {
            if(e.target.checked) {
                document.getElementById('shift').removeAttribute('disabled');
            }
        }
    }
}

form.onsubmit = e => {
    e.preventDefault();
    document.getElementById('result').innerHTML = '';

    for(let elem of form.elements) {
        if(elem.type === "submit") {
            elem.value = "Processing...";
            elem.disabled = true;
        }
    }

    const formObject = formToObject(form);

    request(formObject);
}

function formToObject(form) {
    let text;
    let shift;
    let operation;
    let bfa;

    for(let elem of form.elements) {
        if(elem.name === "text") {
            text = elem.value;
        }

        if(elem.name === "shift") {
            shift = elem.value;
        }

        if(elem.name === "operation") {
            if(elem.checked) {
                operation = elem.value;
            }
        }

        if(elem.name === "bfa") {
            if(elem.checked) {
                bfa = elem.value;
            }
        }
    }

    const formObject = {
        text: text,
        shift: shift,
        operation: operation,
        bfa: bfa
    }

    return formObject;
}