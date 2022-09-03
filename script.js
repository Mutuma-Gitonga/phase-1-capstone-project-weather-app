const getQueriedCityGpsCoordinates = (queriedCity) => {

  // Pass the queriedCity into the request URL
  fetch(`https://api.api-ninjas.com/v1/geocoding?city=${queriedCity}`, 
  {
    method: 'GET',
    headers: {
      'X-Api-Key': 'n0CwaZayigy3k6UpI8NF/g==41LYGmWHvAVCyauA',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(res => {
      // Check if HTTP response successful (res.ok)
      // res.ok returns true for success codes (200-299)
      // Throws errors on unsuccessful requests 400/500 status codes, whose status we would otherwise never know
      if(!res.ok) {
        // console.log(res);
        if(res.status>=400 && res.status<=499) {
          throw new Error(`Status ${res.status}. Browser/Client request can't be fulfilled!`);
        } else if(res.status>=500 && res.status<=599) {
          throw new Error(`Status ${res.status}. Server has encountered error!`);
        }
      }
      
      // NB: With Network errors, the .status property is never populated (since error ain't HTTP response) 
      // In addition, CORS error/misspelt URLs errors are caught by the .CATCH block chained to the fetch promise
      
      return res.json();
    })
      .then(coordinates => {

        // Check if city name is available or valid before extracting its coordinates
        // That is, the object/array is non-empty
        if(coordinates.length !== 0) {
          // Extracting city latitude and longitude from object
          // These coordinates are extracted from the first array entry as it's most relevant (internationally renowned)
          let lat = coordinates[0]["latitude"];
          let lon = coordinates[0]["longitude"];;
        }
          // Otherwise throw an error that city not found
          else {
            // throw new Error("City not found! Check spelling or try another.");
            throw new Error ("City not found in database! Check spelling or try another one.");
          }
        
        // Pass geo coordinates to weather info function
        // getQueriedCityWeatherInformation(lat,lon);
        console.log(coordinates);
      })
        .catch(err => {
          // Pop up the thrown error message alert
          alert(err);
        });
}



document.addEventListener('DOMContentLoaded', () => {

  // Select form object
  const cityQueryForm = document.querySelector('#cityQuery');

  // Listen for submit event & store typed value
  cityQueryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let queriedCity = e.target.searchByCityName.value;
    
    // *********************************************
    // ******* INPUT VALIDATION LOGIC START ********
    // *********************************************
    
    // CHECK IF NON-EMPTY STRING SUBMITTED (may have some white space & alphanumeric characters)  
    if(/[^ ]/.test(queriedCity) && queriedCity.length !== 0) {
      
        // Trim queriedCity of any white spaces on both sides then use REGEX to affirm it ONLY HAS ALPHA CHARACTERS
        if(!/[^a-zA-Z]/.test(queriedCity.trim())) { 
          //If warning exists, remove it since name is now valid 
          if(formHasWarningParagraph())
            removeWarningParagraph();
          
          // Clear input field
          clearTextField();

          // Input string valid, call the get gps coordinates function, passing in queriedCity parameter
          getQueriedCityGpsCoordinates(queriedCity); 
          
        } 
          // IF NON-ALPHA CHARS FOUND:
          else {
            clearTextField();

            if(formHasWarningParagraph()) {
              removeWarningParagraph();
            // Append warning if invalid input found a consecutive time 
            appendNonAlphaCharsWarning();
            } 
              else {
                // Append warning first time
                appendNonAlphaCharsWarning();
              }
          }
    } 
    // ELSE (EMPTY FIELD SUBMITTED)
    else {
        if(formHasWarningParagraph())
          removeWarningParagraph();
        // Append empty field warning
        appendEmptyFieldWarning();
    }
    
    // Clear text field before next input
    function clearTextField() {
      e.target.searchByCityName.value = '';
    }
    // *********************************************
    // ******* INPUT VALIDATION LOGIC END **********
    // *********************************************
    
  });
  
  // *************************************************
  // ******* INPUT VALIDATION FUNCTIONS START ********
  // *************************************************
  
  // Validation function 1
  // Return boolean if warning paragraph present
  function formHasWarningParagraph() {
    return cityQueryForm.contains(document.querySelector('p'));
  }
  
  // Validation function 2
  // Insert non-alphabetic character warning paragraph into DOM
  function appendNonAlphaCharsWarning() {
    const p = document.createElement('p');
    p.innerHTML = "Invalid! Only alphabets expected! <br> Re-enter a valid city name";
    p.className = "form#cityQuery p";
    cityQueryForm.appendChild(p);
  }

  // Validation function 3
  // Remove warning paragraph from DOM
  function removeWarningParagraph() {
    const createdPara = document.querySelector('form#cityQuery p');
    cityQueryForm.removeChild(createdPara);
  }

  // Validation function 4
  // Insert empty field warning paragraph into DOM
  function appendEmptyFieldWarning() {
    const p = document.createElement('p');
    p.innerHTML = "Field cannot be empty! <br> Please enter a city name";
    p.className = "form#cityQuery p";

    cityQueryForm.appendChild(p);
  }
  // *************************************************
  // ******* INPUT VALIDATION FUNCTIONS END **********
  // *************************************************

});
