const appendWeatherInfoToDOM = (weatherData,queriedCity) => {
  
  // Fetch icons and their descriptions from the weather data object 
  let icon = weatherData["weather"][0]["icon"];
  let iconName = weatherData["weather"][0]["main"]; // e.g. "Clouds"
  let iconDescription = weatherData["weather"][0]["description"]; // e.g. "scatterred clouds"

  let temp = weatherData["main"]["temp"]; // Degrees celcius
  let humidity = weatherData["main"]["humidity"]; // Relative %


  // Remove a weather section card if already existing
  if(document.querySelector('body').contains(document.querySelector('#container')))
    document.querySelector('#container').remove();
  
  // Create 'section' semantic element to hold weather information
  const weatherSectionCard = document.createElement('section');
  // Append section to the body element
  document.querySelector('body').appendChild(weatherSectionCard);
  
  // Create div flex container
  const divContainer = document.createElement('div');
  divContainer.id = "container";
  // Append flex container to section element
  weatherSectionCard.appendChild(divContainer);


  // Create flex container child 1
  const divElement1 = document.createElement('div');
  divElement1.className = "flex-item item-1";
  // Append Title to the card
  divElement1.innerHTML = `${queriedCity.charAt(0).toUpperCase()}${queriedCity.slice(1)} City Current Weather:`;
  // Append it to the flex container
  divContainer.appendChild(divElement1);

  // Create flex container child 2
  const divElement2 = document.createElement('div');
  divElement2.className = "flex-item item-2";
  // Append it to flex container
  divContainer.appendChild(divElement2);


  // Create image element with its requisite attributes
  const divElem2Image = document.createElement('img');
  const srcAttr = document.createAttribute("src");
  srcAttr.value = `http://openweathermap.org/img/wn/${icon}.png`;
  divElem2Image.setAttributeNode(srcAttr);
  const altAttr = document.createAttribute('alt');
  altAttr.value = `Current weather icon`;
  divElem2Image.setAttributeNode(altAttr);
  // Append image to the second flex child 
  divElement2.appendChild(divElem2Image);

  // Create 3 paragraph elements and append them to the 2nd flex child
  for (let i = 0; i < 3; i++) {
    let divElem2Paragraph = document.createElement('p');
    
    // Add logic to add elements to appropriate paragraph element
    if(i === 0)
    divElem2Paragraph.innerHTML = `<span>${iconName}:</span> ${iconDescription.charAt(0).toUpperCase()}${iconDescription.slice(1)}`;
    else if(i === 1)
    divElem2Paragraph.innerHTML = `<span>Temperature:</span> ${temp} &#176;C`;
    else if(i === 2)
    divElem2Paragraph.innerHTML = `<span>Humidity:</span> ${humidity}&#x25;`;
    
    divElement2.appendChild(divElem2Paragraph);
  }

}


const getQueriedCityWeatherInformation = (lat,lon,queriedCity) => {

  // Rounding latitude & Longitude to 2 decimal places
  let latFixed = parseFloat(lat).toFixed(2);
  let lonFixed = parseFloat(lon).toFixed(2);
  let apiKey = "830b9f0224e84c684aaf9fce329b4b91"; 
  let lang = "en";
  let units = "metric";
  let excludeTheseDataPoints = "current,minutely,hourly,alerts";
  let queryWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latFixed}&lon=${lonFixed}&exclude=${excludeTheseDataPoints}&units=${units}&appid=${apiKey}&lang=${lang}`;

  // Passing the queryWeatherUrl to the fetch API
  fetch(queryWeatherUrl) 
    .then(res => {
      // Check if HTTP response successful (res.ok)
      // res.ok returns true for success codes (200-299)
      // Throws errors on unsuccessful requests 400/500 status codes, whose status we would otherwise never know
      if(!res.ok) {
        // Call function to print the explicit HTTP Errors
        explicitHttpErrorDefinition(res);
      }
      
      // Convert the JSON data into an JS Object
      return res.json();
    })
      .then(weatherData => {

        // Pass weather data object to the DOM manipulation function
        appendWeatherInfoToDOM(weatherData,queriedCity);

      })
        .catch(err => {
          alert(err);
        });
}


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
        explicitHttpErrorDefinition(res);
      }
      
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

          // Pass geo coordinates to weather info function
          getQueriedCityWeatherInformation(lat,lon,queriedCity);
        }
          // Otherwise throw an error that city not found
          else {
            // throw new Error("City not found! Check spelling or try another.");
            throw new Error ("City not found in database! Check spelling or try another one.");
          }
        
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
    

    // CHECK IF NON-EMPTY STRING SUBMITTED (Has char other than space & length greater than 0)  
    if(/[^ ]/.test(queriedCity) && queriedCity.length !== 0) {
      
        // FIX: ADDED SUPPORT FOR CITIES WITH OTHER CHARS OTHER THAN ALPHAS i.e., NUMBERS, HYPHENS OR SPACES. The test first trims white spaces on both sides of a name
        // ANOTHER FIX: REJECT INPUTS WITH ONLY NUMBERS
        // EXAMPLES: City with number: "6th of October" || City with Hyphen: "Winston-Salem" || City with Space: "Dar es Salaam"
        if(/^[0-9a-zA-Z- ]+$/.test(queriedCity.trim()) && !/^[0-9]+$/.test(queriedCity.trim())) { 
          //If warning exists, remove it since name is now valid 
          if(formHasWarningParagraph())
            removeWarningParagraph();
          
          // Clear input field
          clearTextField();

          // Input string valid, call the get gps coordinates function, passing in queriedCity parameter
          getQueriedCityGpsCoordinates(queriedCity); 
          
        } 
          // FIX: RUNS FOR CITY NAMES WITH CHARS OTHER THAN ALPHA, NUMBER, HYPHEN, OR SPACE CHARS
          else {
            clearTextField();

            if(formHasWarningParagraph()) {
              removeWarningParagraph();
            // Append warning if invalid input found a consecutive time 
            appendNonAlphaNumSpaceHyphenCharsWarning();
            } 
              else {
                // Append warning first time
                appendNonAlphaNumSpaceHyphenCharsWarning();
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
  // Insert non-alphanumeric, non-space & non-hyphen character warning paragraph into DOM
  function appendNonAlphaNumSpaceHyphenCharsWarning() {
    const p = document.createElement('p');
    p.innerHTML = "Only names with alphanumerics, <br> spaces or hyphens allowed! <br> Re-enter a valid city name";
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

// Function holding the class 400 and class 500 errors thrown by any of the two fetch APIs
function explicitHttpErrorDefinition(res) {
  if(res.status>=400 && res.status<=499) {
    throw new Error(`Status ${res.status}. Client request can't be fulfilled!`);
  } else if(res.status>=500 && res.status<=599) {
    throw new Error(`Status ${res.status}. Server has encountered error!`);
  }
}