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
          //If warning exists, remove it before adding another 
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
    queriedCity = '';
  }
  // *************************************************
  // ******* INPUT VALIDATION FUNCTIONS END **********
  // *************************************************
});
