const getQueriedCityGpsCoordinates = (queriedCity) => {

}


document.addEventListener('DOMContentLoaded', () => {

  const cityQueryForm = document.querySelector('#cityQuery');

  cityQueryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const queriedCity = e.target.searchByCityName.value;

    getQueriedCityGpsCoordinates(queriedCity);
  });

});
