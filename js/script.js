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
