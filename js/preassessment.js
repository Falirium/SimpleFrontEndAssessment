// **************************************** DECLARATION PHASE **************************************** //

const textField = document.querySelector("#textField");
const inputId = document.querySelector("#input-id");

const btnAddNewCategory = document.querySelector("#btn-add-category");
const btnAddNewCriteria = document.querySelector("#btn-add-criteria");
const btnSubmit = document.querySelector("#btn-submit");

const btnDownload = document.querySelector("#btn-download");
const btnCategory = document.querySelector("#btn-category");
const btnClassify = document.querySelector("#btn-classify");


const form_modal = document.querySelector("#form-modal");

let compteurHeaders = 1;

// let lastCategory = lastCategoryContainer();
// let allInputs = lastCategory.querySelectorAll("input");

let jsonFinalPreassessment = {};


// Select your input type file and store it in a variable
const input = document.getElementById('formFile');

let categoriesRequestBody = [];



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
// const classificationColumns = [
//     "AVNATGES THEORIQUES",
//     "Ancienneté CPM (année)",
//     "Ancienneté Emploi (Année)",
//     "Perf. 2019",
//     "Perf. 2018",
//     "Perf. 2017",
//     "MP Perf. Ind.",
//     "NB. Mobilité Fonctionnel",
//     "NB. Mobilité Géo"
// ];

let classificationColumns = [];

// **************************************** END OF DECLARATION PHASE **************************************** //




// **************************************** INITIALIZATION PHASE **************************************** //



// **************************************** END OF INITIALIZATION PHASE **************************************** //






// **************************************** EVENT LISTENER **************************************** //

btnAddNewCategory.addEventListener("click", () => {
    // Validation of the form inputs : all required
    if (!checkCategoryInputs()) {

    } else {
        //Save values to categories json
        //addCategory2Json();

        // Add new div for category
        addNewCategory();

        compteurHeaders++;
        // Get the last header
        let lastHeaderCategory = lastCategoryContainer().querySelector("#header-category");

        lastHeaderCategory.innerHTML = "Catégorie numéro " + compteurHeaders;
    }
    
})


btnAddNewCriteria.addEventListener("click", () => {
    // Validation of the form inputs : all required
    if (!checkCriteriaInputs()) {

    } else {
        // Save values to criteria property
        //addCriteria2Json();

        //Add new div for criteria
        addNewCriteria();

        //console.log(categoriesRequestBody);
    }
    
})

btnSubmit.addEventListener("click", () => {
    
    // Clear empty json elements


    //get list of categories
    getListOfCategories();
    console.log(categoriesRequestBody);
    
    // Send post request to category api 
    //postCategory();

    //Hide category btn and show classify btn
    //btnCategory.classList.replace("show", "hide");
    btnClassify.classList.replace("hide", "show");
})

input.addEventListener("change", () => {postExcelFile()}, false);


btnDownload.addEventListener("click", () => {
    
    fetchEmployeesData();

    

    // Hide upload btn and show classify btn

    btnDownload.classList.replace("show","hide");
    btnCategory.classList.replace("hide","show");
})

btnClassify.addEventListener("click", () => {

    let jsonClassifiedPopulation =  classifyPopulation(jsonFinalPreassessment["Déjà dans l'emploi"],categoriesRequestBody);

    //Clear the content of the current table
    clearTable(document.querySelector("table"));

    jsonFinalPreassessment = jsonClassifiedPopulation;
    console.log(jsonFinalPreassessment);
    
    parseToTable(jsonClassifiedPopulation);
})

btnCategory.addEventListener("click",() => {
    // Add a new category

    addNewCategory();

   
})



// **************************************** END OF EVENT LISTENER **************************************** //






// **************************************** FUNCTION DECLARATIONS **************************************** //

function clearTable(table) {
    table.outerHTML = `<table class="table table-striped">
    <thead id="thead">

    </thead>
    <tbody id="tbody">

    </tbody>
</table>`;
}
function parseToTable(json) {

    console.log("from parseToTable method");
    console.log(json);
    // const table = document.getElementsByClassName('table table-striped');
    // console.log(table);
    let tableHeader = document.querySelector("#thead");
    let tableBody = document.querySelector("#tbody");
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


}


async function fetchEmployeesData() {

    const id = inputId.value;

    let url = "http://localhost:8080/preassessment/api/v1/file/2json/" + id;
    try {
        let res = await fetch(url);
        let response = await res.json();

        response["Déjà dans l'emploi"] = clearWhiteRows(response["Déjà dans l'emploi"])
        jsonFinalPreassessment = response;
        parseToTable(response["Déjà dans l'emploi"]);

        classificationColumns = getClassificationColumn(response["Déjà dans l'emploi"][0]);

    } catch (error) {
        console.log(error);
    }
}


async function postExcelFile() {

    let input = document.getElementById('formFile');
    let file = input.files[0];

    let url = "http://localhost:8080/preassessment/api/v1/file/upload"

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

async function postCategory() {
    let url = "http://localhost:8080/preassessment/api/v1/category/"

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(categoriesRequestBody)
    }).then (
        response => response.json()
    ).then (
        success => console.log(success)
    ).catch(
        error => console.log(error) // Handle the error response object
    );
}

function populateWithClassificationColumns() {

    let lastCriteria = lastCriteriaContainer();

    let lastSelectField = lastCriteria.querySelector("#select-classification");

    classificationColumns.map(e => {
        var option = new Option(e, e);
        lastSelectField.appendChild(option);
    })
}


function addNewCategory() {
   if (typeof(lastCategoryContainer()) != 'undefined') {
    let lastCategory = lastCategoryContainer();
    let parent = lastCategory.parentElement;
    let newCategory = document.createElement("div");

    parent.appendChild(newCategory);
    
    newCategory.outerHTML = `<div class="my-4 category-container">
                                    <h2 class="text-center" id="header-category">Catégorie numéro 1</h2>
                                    
                                    <label for="catgory-name" class="col-form-label">Nom de la catégorie</label>
                                    <input type="text" class="form-control" id="catgory-name">
                                    <small>Message d'erreur</small>

                                    <div class="criteria-container mb-3">
                                        <label for="select-classification" class="col-form-label">Choisissez votre critière de classification</label>
                                        <select class="form-select" aria-label="Default select example" id="select-classification">
                                        
                                        </select>

                                        <div class="d-flex w-100 justify-content-around">
                                            <div class="criteria-form-container">
                                                <label for="min-input">Valeur Min :</label>
                                                <input id="min-input" type="text" class="form-control mt-2">
                                                <small>Message d'erreur</small>
                                            </div>
                                            <div class="criteria-form-container">
                                                <label for="max-input">Valeur Max :</label>
                                                <input id="max-input" type="text" class="form-control mt-2">
                                                <small>Message d'erreur</small>
                                            </div>
                                        </div>
                                    </div> 

                                </div> <hr>`;

   } else {
    let formModal = document.querySelector("#form-modal");

    formModal.innerHTML = `
            <div class="my-4 category-container">
            <h2 class="text-center" id="header-category">Catégorie numéro 1</h2>
            
            <label for="catgory-name" class="col-form-label">Nom de la catégorie</label>
            <input type="text" class="form-control" id="catgory-name">
            <small>Message d'erreur</small>

            <div class="criteria-container mb-3">
                <label for="select-classification" class="col-form-label">Choisissez votre critière de classification</label>
                <select class="form-select" aria-label="Default select example" id="select-classification">
                
                </select>

                <div class="d-flex w-100 justify-content-around">
                    <div class="criteria-form-container">
                        <label for="min-input">Valeur Min :</label>
                        <input id="min-input" type="text" class="form-control mt-2">
                        <small>Message d'erreur</small>
                    </div>
                    <div class="criteria-form-container">
                        <label for="max-input">Valeur Max :</label>
                        <input id="max-input" type="text" class="form-control mt-2">
                        <small>Message d'erreur</small>
                    </div>
                </div>
            </div> 

        </div> <hr>`;
   }    
    
   let lastCategory = lastCategoryContainer();

    let allInputs = lastCategory.querySelectorAll("input");
    allInputs.forEach(function(input){
    input.addEventListener("input", () => {
            cleanError(input);
        })
    })

    populateWithClassificationColumns();
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
            <div class="criteria-form-container">
                <label for="min-input">Valeur Min :</label>
                <input id="min-input" type="text" class="form-control mt-2">
                <small>Message d'erreur</small>
            </div>
            <div class="criteria-form-container">
                <label for="max-input">Valeur Max :</label>
                <input id="max-input" type="text" class="form-control mt-2">
                <small>Message d'erreur</small>
            </div>
        </div>
    </div>
    `;

    populateWithClassificationColumns();
}



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

function addCriteria2Json() {
    let lastCriteria = lastCriteriaContainer();
    let criteriaJson = {
        "name" : lastCriteria.querySelector("#select-classification").value,
        "min" : lastCriteria.querySelector("#min-input").value,
        "max" : lastCriteria.querySelector("#max-input").value
    }
    categoriesRequestBody.at(-1).criterias.push(criteriaJson)
    
}

function addCategory2Json() {
    let lastCategory = lastCategoryContainer();
     
    // populate name property
    categoriesRequestBody.at(-1).name = lastCategory.querySelector("#catgory-name").value;

    // push another category object
    let newCategoryJsonNode = {
        "name" : "",
        "criterias" : []
    };
  
    categoriesRequestBody.push(newCategoryJsonNode);

}

function checkCriteriaInputs() {
    let lastCriteria = lastCriteriaContainer();

    let minInput = lastCriteria.querySelector("#min-input");
    let maxInput = lastCriteria.querySelector("#max-input");

    if (minInput.value === "" && maxInput.value === "") {
        setErrorFor(minInput,"Ce champ ne doit pas être vide");
        setErrorFor(maxInput,"Ce champ ne doit pas être vide");
        return false;
    }  else if(minInput.value != "" && maxInput.value != "" && minInput.value > maxInput.value) { //Logic validation
        setErrorFor(maxInput,"Ce champ doit être supérieure à la valeur minimale ");
        setErrorFor(minInput, "");

        return false;
    } else {
        return true;
    }
   
}

function checkCategoryInputs() {
    let lastCategory = lastCategoryContainer();

    let nameInput = lastCategory.querySelector("#catgory-name");

    if (nameInput.value === "") {
        let parent = nameInput.parentElement;
        parent.classList.add("error");
        // parent.className = "my-4 category-container error";
        return false;
    } else {
        return true;
    }

}

function setErrorFor(input, message) {
    //Select the parent element
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");

    small.innerHTML = message;

    formControl.className = "criteria-form-container error";
}

function cleanError(element) {
    let parent = element.parentElement;
    parent.classList.remove("error")

}

function classifyPopulation(jsonPopulation, jsonCategories) {

    Object.entries(jsonPopulation).forEach(([key,row]) => {
        let shouldStop = false;

        let i = 0;
        while (i < jsonCategories.length) {
            let category = jsonCategories[i];
            let acceptedCriterias = 0;

            for (let j =0; j < category.criterias.length; j++) {
                let criteria = category.criterias[j];

                let nameCriteria = criteria.name;
                let minValue = criteria.min;
                let maxValue = criteria.max;

                if ( (minValue === "" && row[nameCriteria] <= maxValue) || (maxValue === "" && row[nameCriteria] >= minValue) || (row[nameCriteria] < maxValue && row[nameCriteria] > minValue)) {
                    acceptedCriterias++;
                    //row["category"] = category.name;
                } else if (row[nameCriteria] === "" && row[nameCriteria] === "") {
                    
                }
            }
            i++;

            if (acceptedCriterias === category.criterias.length) {
                row["category"] = category.name;
                console.log('HEEERREE');
                
                break;
            }


        }
        // Object.entries(jsonCategories).forEach(([key, category]) => {
        //     let acceptedCriterias = 0;
        //     Object.entries(category.criterias).forEach(([key, criteria]) => {
        //         let nameCriteria = criteria.name;
        //         let minValue = criteria.min;
        //         let maxValue = criteria.max;
        //         // let value = criteria.value;
        //         console.log(minValue + " " + maxValue);
        //         console.log(row[nameCriteria]);
        //         // console.log(maxValue === "" && row[nameCriteria] > minValue);
        //             if ( (minValue === "" && row[nameCriteria] <= maxValue) || (maxValue === "" && row[nameCriteria] >= minValue) || (row[nameCriteria] < maxValue && row[nameCriteria] > minValue)) {
        //                 acceptedCriterias++;
        //                 //row["category"] = category.name;
        //             } else if (row[nameCriteria] === "" && row[nameCriteria] === "") {
        //                 //row["category"] = "";
        //             }

                    
                
        //         // if (criteria.type === "numeric") {
        //         //     name , minValue, maxValue = criteria.name , criteria.min, criteria.max;

        //         //     if ( (minValue === "" && row.name <= maxValue) || (maxValue === "" && row.name > minValue) || (row.name <= maxValue && row.name > minValue)) {
        //         //         row["category"] = category.name;
        //         //     } else {
        //         //         row["category"] = "";
        //         //     }
        //         // } else {
        //         //     value = criteria.value;

        //         //     if (row.name === value) {
        //         //         row["category"] = category.name;
        //         //     } else {
        //         //         row["category"] = "";
        //         //     }
        //         // }
                
        //     })
        //     if (acceptedCriterias === category.criterias.length) {
        //         row["category"] = category.name;
        //         console.log('HEEERREE');
        //         return;
        //     }
        
        // })
    }); 

    return jsonPopulation;

}

function clearWhiteRows(jsonArray) {
    return jsonArray.filter((json) => {
        let compteur = 0;
        let jsonLength = Object.keys(json).length;
        console.log(jsonLength);
        Object.entries(json).forEach(([key, value]) => {
            if (value === "") {
                compteur++;
            }
        })

        if (compteur != jsonLength) {
            return true;
        } 
    })
}

function getClassificationColumn(json) {
    let classificationColumns = []
    Object.entries(json).forEach(([key, value]) => {
        if (!(manager1Columns.includes(key) || manager2Columns.includes(key) || employeeColumns.includes(key))) {
            classificationColumns.push(key);
        }
    })

    return classificationColumns;
}


function getListOfCategories() {
    // Get divs of category
    let categories = document.querySelectorAll(".category-container");

    [...categories].forEach( (category) => {
        let cat = {
            "name" : "",
            "criterias": []
        }

        let categoryName = category.querySelector("#catgory-name");

        cat.name = categoryName.value;

        let listCriterias = category.querySelectorAll(".criteria-container");

        [...listCriterias].forEach ( (criteria) => {
            let c = {
                "name" : ""
            }
            let nameCriteria = criteria.querySelector("#select-classification").value;

            c.name = nameCriteria;

            if (typeOfSelection(nameCriteria) === "string") {
                let valueCriteria = criteria.querySelector("#criteria-value").value ;
                c.value = valueCriteria;

            } else {
                c.min = criteria.querySelector("#min-input");
                c.max = criteria.querySelector("#max-input");
            }

            cat.criterias.push(c);
        })

        // Push the category to the global variable
        categoriesRequestBody.push(cat);
    })
    
}

function typeOfSelection(selection) {
    return typeof(jsonFinalPreassessment["Déjà dans l'emploi"][0][selection]);
}

// **************************************** END OF FUNCTION DECLARATIONS **************************************** //














