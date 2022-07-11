// api url
const api_url = "";

// Defining async function
async function getapi(url, header) {
    // Storing response
    const response = await fetch(url, header);

    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    if (response) {
        hideloader();
    }
    //show(data);
    return data;
}

function sendRequest(fname, lname, mat, pwd) {
    const data = {
        firstName: fname,
        lastName: lname,
        email: mat,
        password: pwd,
    };
    console.log(data);
    const header = {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
    };

    return getapi("http://localhost:8080/api/v1/registration", header);
}

// Calling that async function
//getapi(api_url);

// Function to hide the loader
function hideloader() {
    document.getElementById("loading").style.display = "none";
}

let form = document.getElementById("form");
let nom = document.getElementById("nom");
let prenom = document.getElementById("prenom");
let email = document.getElementById("email");
let matricule = document.getElementById("matricule");
let type = document.getElementById("type");
let bpr = document.getElementById("region");
let password = document.getElementById("password");
let password2 = document.getElementById("password2");

let nomValue = nom.value.trim();
let prenomValue = prenom.value.trim();
let emailValue = email.value.trim();
let matriculeValue = matricule.value.trim();
let typeValue = type.value.trim();

console.log(password);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("ssqdq");

    checkInputs();
});

function checkInputs() {
    //get values of inputs

    if (nomValue === "") {
        //Show error message on nom input
        setErrorFor(nom, "Ce champ ne doit pas être vide");
    } else {
        // add success class to nom input
        setSuccessFor(nom);
    }

    if (prenomValue === "") {
        //Show error message on nom input
        setErrorFor(prenom, "Ce champ ne doit pas être vide");
    } else {
        // add success class to nom input
        setSuccessFor(prenom);
    }

    if (emailValue === "") {
        //Show error message on nom input
        setErrorFor(email, "Ce champ ne doit pas être vide");
    } else if (!isEmail(email)) {
        //Show error message on nom input
        setErrorFor(
            email,
            "Ce champ doit contenir une adresse email valide de GBP."
        );
    } else {
        setSuccessFor(email);
    }

    if (matriculeValue === "") {
        //Show error message on nom input
        setErrorFor(matricule, "Ce champ ne doit pas être vide"); //TODO: add a regex to the matricule field
    } else {
        // add success class to nom input
        setSuccessFor(matricule);
    }
    if (matriculeValue === "") {
        //Show error message on nom input
        setErrorFor(prenom, "Ce champ ne doit pas être v, password2Value)ide"); //TODO: add a regex to the matricule field
    } else {
        // add success class to nom input
        setSuccessFor(matricule);
    }
}

password.addEventListener("input", () => {
    if (password.value !== "") {
        let parent = password.parentElement;

        parent.className = "form-control";
    }
});
password2.addEventListener("input", () => {
    if (password.value === "") {
        setErrorFor(password, "Ce champ ne doit pas être vide");
    } else if (password.value === password2.value) {
        setSuccessFor(password2);
    } else {
        setErrorFor(password2, "Les mots de passe ne sont pas identiques");
    }
});

function setErrorFor(input, message) {
    //Select the parent element
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");

    small.innerHTML = message;

    formControl.className = "form-control error";
}

function setSuccessFor(input) {
    //Select the parent element
    const formControl = input.parentElement;
    formControl.className = "form-control success";
}
function isEmail(email) {
    let emailRegex = "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/";
    return email.match(emailRegex);
}
