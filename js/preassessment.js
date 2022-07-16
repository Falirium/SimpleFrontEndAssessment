const textField = document.querySelector("#textField");
const inputId = document.querySelector("#input-id");
const btnAddNewCategory = document.querySelector("#btn-add-category");
const form_modal = document.querySelector("#form-modal");

let compteurHeaders = 1;


function parseToTable(json) {

    // const table = document.getElementsByClassName('table table-striped');
    // console.log(table);
    let tableHeader = document.querySelector("#thead");
    let tableBody = document.querySelector("#tbody");
    // let json = JSON.parse(jsonString);

    // let json = [
    //     {
    //         "Book ID": "1",
    //         "Book Name": "Computer Architecture",
    //         "Category": "Computers",
    //         "Price": "125.60"
    //     },
    //     {
    //         "Book ID": "2",
    //         "Book Name": "Asp.Net 4 Blue Book",
    //         "Category": "Programming",
    //         "Price": "56.00"
    //     },
    //     {
    //         "Book ID": "3",
    //         "Book Name": "Popular Science",
    //         "Category": "Science",
    //         "Price": "210.40"
    //     }
    // ]

    // EXTRACT VALUE FOR HTML HEADER. 

    var col = [];
    for (var i = 0; i < json.length; i++) {
        for (var key in json[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = tableHeader.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json.length; i++) {

        tr = tableBody.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json[i][col[j]];
        }
    }


    // Hide upload btn and show classify btn

    let btn_show = document.querySelector("#btn-show");
    let btn_hide = document.querySelector("#btn-classify");

    btn_show.className = "btn btn-primary hide";
    btn_hide.className = "btn btn-primary show";



}

async function fetchEmployeesData() {

    const id = inputId.value;

    let url = "http://localhost:8080/preassessment/api/v1/2json/" + id;
    try {
        let res = await fetch(url);
        let response = await res.json();
        parseToTable(response["Déjà dans l'emploi"]);
    } catch (error) {
        console.log(error);
    }
}


async function postExcelFile() {

    let input = document.getElementById('formFile');
    let file = input.files[0];

    let url = "http://localhost:8080/preassessment/api/v1/upload"

    let bodyFile = new FormData();

    bodyFile.append("file", file);
    console.log(bodyFile);
    fetch(url, { // Your POST endpoint
        method: 'POST',
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
        },
        body: bodyFile // This is your file object
    }).then(
        response => response.json() // if the response is a JSON object
    ).then(
        success => {
            textField.textContent = "ID du fichier : " + success["message"];
            console.log(success)
        } // Handle the success response object
    ).catch(
        error => console.log(error) // Handle the error response object
    );


}

// Select your input type file and store it in a variable
const input = document.getElementById('formFile');

// This will upload the file after having read it
// const upload = (file) => {
//   fetch('http://www.example.net', { // Your POST endpoint
//     method: 'POST',
//     headers: {
//       // Content-Type may need to be completely **omitted**
//       // or you may need something
//       "Content-Type": "You will perhaps need to define a content-type here"
//     },
//     body: file // This is your file object
//   }).then(
//     response => response.json() // if the response is a JSON object
//   ).then(
//     success => console.log(success) // Handle the success response object
//   ).catch(
//     error => console.log(error) // Handle the error response object
//   );
// };

// Event handler executed when a file is selected
const onSelectFile = () => postExcelFile();

// Add a listener on your input
// It will be triggered when a file will be selected
input.addEventListener('change', onSelectFile, false);



//FilterS the json

const manager1Columns = [
    "Matricule N1",
    "Nom N1",
    "PRENOM N1"
];
const manager2Columns = [
    "Matricule N2",
    "Nom N2",
    "PRENOM N2"
];
const employeeColumns = [
    "Matricule",
    "Nom",
    "Prénom",
    "affectation (Code)",
    "affectation (Libelle)",
    "Fonction (Libelle)",
    "Date fonction actuelle",
    "Date fonction avant "
];
const classificationColumns = [
    "AVNATGES THEORIQUES",
    "Ancienneté CPM (année)",
    "Ancienneté Emploi (Année)",
    "Perf. 2019",
    "Perf. 2018",
    "Perf. 2017",
    "MP Perf. Ind.",
    "NB. Mobilité Fonctionnel",
    "NB. Mobilité Géo"
];

populateWithClassificationColumns();



function populateWithClassificationColumns() {

    let lastCriteria = lastCriteriaContainer();

    let lastSelectField = lastCriteria.querySelector("#select-classification");

    classificationColumns.map(e => {
        var option = new Option(e, "");
        lastSelectField.appendChild(option);
    })
}


function addNewCategory() {
    let lastCategory = lastCategoryContainer();
    let parent = lastCategory.parentElement;
    let newCategory = document.createElement("div");

    parent.appendChild(newCategory);
    
    

    newCategory.outerHTML = `
    <div class="my-4 category-container">
                                    <h2 class="text-center" id="header-category">Catégorie numéro 1</h2>
                                    <label for="catgory-name" class="col-form-label">Nom de la catégorie</label>
                                    <input type="text" class="form-control" id="catgory-name">

                                    <div class="criteria-container mb-3">
                                        <label for="select-classification" class="col-form-label">Choisissez votre critière de classification</label>
                                        <select class="form-select" aria-label="Default select example" id="select-classification">
                                        
                                        </select>

                                        <div class="d-flex w-100 justify-content-around">
                                            <div >
                                                <label for="min-input">Valeur Min :</label>
                                                <input id="min-input" type="text" class="form-control mt-2">
                                            </div>
                                            <div>
                                                <label for="max-input">Valeur Max :</label>
                                                <input id="max-input" type="text" class="form-control mt-2">
                                            </div>
                                        </div>
                                    </div> 

                                </div> <hr>`;

    populateWithClassificationColumns();




    //console.log(div_container);
}
function addNewCriteria() {
    let lastCriteria = lastCriteriaContainer();
    let parent = lastCriteria.parentElement;
    let newCriteria = document.createElement("div");
    

    parent.appendChild(newCriteria);

    newCriteria.outerHTML = `
    <div class="criteria-container mb-3">
        <label for="select-classification" class="col-form-label">Choisissez votre critière de classification</label>
        <select class="form-select" aria-label="Default select example" id="select-classification">
        
        </select>

        <div class="d-flex w-100 justify-content-around">
            <div >
                <label for="min-input">Valeur Min :</label>
                <input id="min-input" type="text" class="form-control mt-2">
            </div>
            <div>
                <label for="max-input">Valeur Max :</label>
                <input id="max-input" type="text" class="form-control mt-2">
            </div>
        </div>
    </div>
    `;

    populateWithClassificationColumns();


}

btnAddNewCategory.addEventListener("click", () => {


    compteurHeaders++;
    let headersCategories = document.querySelectorAll("#header-category");
    //console.log(headersCategories);

    let lastHeaderCategory = headersCategories[headersCategories.length - 1];

    lastHeaderCategory.innerHTML = "Catégorie numéro " + compteurHeaders;
})


function lastCriteriaContainer() {
    let lastCategory = lastCategoryContainer();
    let allCriteriasContainers = lastCategory.querySelectorAll(".criteria-container");

    let lastCriteria = allCriteriasContainers[allCriteriasContainers.length - 1];

    return lastCriteria;
}

function lastCategoryContainer() {
    let allCategoriesContainers = form_modal.querySelectorAll(".category-container");

    let lastCategory = allCategoriesContainers[allCategoriesContainers.length - 1];

    return lastCategory;
}

function getFilters() {


}