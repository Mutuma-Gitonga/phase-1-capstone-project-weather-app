# phase-1-capstone-project-weather-app
This app furnishes a user with current weather of any city they key in as long as it's available in the database. 

## Features:
- A mobile responsive design. 
- Input validation i.e., throws warning if user attempts to submit an empty entry or an entry with illegal characters.
- Returns an error if a given city is not found in the reference api. 

## How it works:
- When a user keys in the city name, the name string is fed into api-ninjas.com's geocoding api to obtain the place's GPS coordinates i.e., latitude and longitude. 
- These GPS coordinates are then fed into a second API - openweathermap.org's current weather api. 
- It's from the returned openweathermap's api current weather object that the app extracts the relevant weather information to display, i.e., the icon, icon name and description, the temperature, and the prevailing humidity.  

## Extra Functionality I Want to Add
- Allowing user to set home location, then affixing it's current weather info on the app which refreshes periodically, say every 3 hours. 
- Adding a progress loading indicator as a user awaits the weather details to fetch and display. 

