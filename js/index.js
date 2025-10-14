/*=====Message Form section interaction====== 
1.set variables by attaching to message-form and output which are the ID's listed in the html of homepage using getElementbyID*/

const messageForm =document.getElementById("message-form");
const outputDiv=document.getElementById("output");

if(messageForm && outputDiv) {
/* 2.add event listener to listen for Submit button being used using the form  element.addEventListener(type, (event)=>(){starts a function} */
  messageForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const userName = event.target.userName.value;
    const userMessage= event.target.userMessage.value;
  // Message for debugging 
    console.log("UserName:", userName);
    console.log("UserMessage:",userMessage);
// 3.Feedback to user with a message
    const newMessage =document.createElement("p");
    newMessage.classList.add("user-feedback-msg");
    outputDiv.innerHTML ="";

// 4.Create Username without potential  damage to html 
    const nameInSpan = document.createElement("span");
    nameInSpan.textContent = userName;
    
// 5. message paragraph with using span 
    newMessage.append("Thank you, ", nameInSpan,"!",document.createElement('br'), "Your message is :",`"${userMessage}"`); 
// 6. Remove button 
    const removeButton =document.createElement('button');
    removeButton.innerText="Remove Message";
    removeButton.type="button";
    removeButton.className="remove-button";

    removeButton.addEventListener("click",() => {
      outputDiv.innerHTML="";
    });
//7. Append message to output
    outputDiv.appendChild(newMessage);
    outputDiv.appendChild(removeButton);
  //8.reset form using reset()
    messageForm.reset();
  });

}
// use cache to store fetched data and avoid multiple API calls which saves time and money

let weatherDataCache = null; 
// store default coordinates after geo location

let currentLatitude = 39.4015;
let currentLongitude = -76.6019; 
let currentLocalName = "Towson"

function pickTempUnit() {
  const pickTempUnitButton = document.querySelector (`input[name="temperature_unit"]:checked`);
  if (pickTempUnitButton){
    return pickTempUnitButton.value;
  } else {
    return "fahrenheit";
  }
}
// set html property of disabled state because only disabled stated exists so we are try to say the buttons can't be clicked if the enable argument is true

function toggleTempUnitButtons(enable) {
  const buttons = document.querySelectorAll(`#weather-result button`);
  buttons.forEach( button => {
    button.disabled = !enable;
  });
}

async function updateWeatherDisplay(){
  const data= await fetchTempAndHumidityData();
    if(!data) return;

    displayWeather("max",data);
    displayWeather("min",data);
    displayWeather("humidity",data);

  }
// adding event listeners in JS since my JS was overwriting my HTML file when I tried to directly attach an onclick action 
function weatherButtonClickAction () {
  document.getElementById('max-temp')?.querySelector("button")?.addEventListener("click",() => displayWeather("max"));
  document.getElementById('min-temp')?.querySelector("button")?.addEventListener("click",() => displayWeather("min"));document.getElementById('humidity')?.querySelector("button")?.addEventListener("click",() => displayWeather("humidity"));
}

/*completely changed restartFetch with elimination onclick and display weather*/

function restartFetch() {
  weatherDataCache = null;
  document.getElementById('max-temp').innerHTML=`<button type = "button">Click here for Maximum Temperature</button>`;
  document.getElementById('min-temp').innerHTML=`<button type = "button">Click here for Minimum Temperature</button>`;
  document.getElementById('humidity').innerHTML=`<button type = "button">Click here for Relative Humidity</button>`;
  
  weatherButtonClickAction ();
  console.log("Unit changed or location updated. Cache cleared.");
}

/*====delete zipcode button===*/
function deleteZipcode(){
  const postcodeInput = document.getElementById("postcode-input").value = "";
  const statusElement = document.getElementById("location-status");
  if(statusElement) {
    statusElement.classList.remove("status-error", "status-loading", "status-success");
    statusElement.textContent = "Enter new zipcode";
  } else {
    console.error("ID location-status not found");
  }
  document.querySelector(".postcode-search-group button").disabled = false;
} 

// ======fetch weather data===========
/*1.asynch function about fetching geocode api  */ 
async function fetchLocalCoordinates(postcode){
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${postcode}&count=1&language=en&format=json&countryCode=US`;
  try {
    const response = await fetch(geocodeUrl);
    if(!response.ok) {
      throw new Error(`Network request for geocoding failed ${response.status}`);
    }
    const data = await response.json();
    /********consider changing usaResult to zipcodeResult */
    let usaResult =null;
    // since I only want only one postal code, I will only look for first index response of data network
    if(data.results && data.results.length>0) {
      usaResult = data.results[0];
    }

    if(usaResult) {
      console.log ("Successful response", usaResult)
      console.log("Zipcode is:", postcode);
      
      const name = `${usaResult.name || postcode}, ${usaResult.admin1 || "US"}`;
      return {
        latitude: usaResult.latitude,
        longitude: usaResult.longitude,
        name: name
      };
// if user enters an invalid zipcode, this will catch an error
    } else {
      return null;
    }

  } catch (error){
    console.error("Error Fetching coordinates", error)
    return null;
  }
}
/* function for search button for zipcode*/
async function zipcodeSearch() {
  const postcode = document.getElementById("postcode-input").value.trim();
  const statusElement = document.getElementById("location-status");
  const searchButton = document.querySelector(".postcode-search-group button");
  const clearStatusClasses = () => statusElement.classList.remove("status-error","status-loading", "status-success")
  /* eliminate invalid zips less than 5 digits long or not entered as a number*/ 
  if (postcode.length !== 5|| isNaN(postcode)) {
    statusElement.textContent = "The USA zipcode must be 5 digits total and only numbers."
    clearStatusClasses();
    statusElement.classList.add('status-error');
    toggleTempUnitButtons(false);
    return;
  }
  searchButton.disabled = true;
  clearStatusClasses();
  // disable the ability to change temp units so it doesn't interfere with API getting location
  toggleTempUnitButtons(false);  

  let location = null;
  // call function that will fetch geo api
  try {
    location = await fetchLocalCoordinates(postcode);
  } catch(err) {
    console.error("Unable to get coordinates for postal code:",err);

  }finally {
    searchButton.disabled = false;
    searchButton.textContent ="Find Location";
  }
// if location is valid based on zipcode then send console the coordinates or longitude and latitude, but end with clearing the cache using restartFetch() function 
  if(location) {
    currentLatitude = location.latitude;
    currentLongitude = location.longitude;
    currentLocalName = location.name; 

    // ask console.log(`Longitude: ${currentLongitude.toFixed(5)}, Latitude: ${currentLatitude.toFixed(5)}`);
    console.log(`Longitude: ${currentLongitude}, Latitude: ${currentLatitude}`);
    const weatherTitleId = document.getElementById("weather-title");
    if(weatherTitleId){
      weatherTitleId.textContent = `Current Weather for ${currentLocalName}`;
    }
    statusElement.textContent = `Location is ${currentLocalName}.Select a weather variable using buttons`;
    clearStatusClasses();
    statusElement.classList.add("status-success");

    const displayCoordinatesDiv = document.getElementById("display-coordinates");
    if(displayCoordinatesDiv){
      displayCoordinatesDiv.innerHTML ="";
      
      const longLatButton = document.createElement("button");
      longLatButton.textContent ="Coordinates";
      longLatButton.type ="button";
      longLatButton.classList.add("long-lat-button");

      longLatButton.addEventListener("click",()=>{
        const longCoord = currentLongitude.toFixed(5);
        const latCoord = currentLatitude.toFixed(5);
        longLatButton.textContent = `Longitude: ${longCoord},Latitude: ${latCoord}`;
        longLatButton.disabled=true;
      });
      displayCoordinatesDiv.appendChild(longLatButton);
    }
    // clear old weather data and clear cache for new fetch api with new coordinates
    restartFetch();
    toggleTempUnitButtons(true);
  } else {
    statusElement.textContent = `Unable to locate US location based on zipcode ${postcode}. Please try another zipcode`;
    clearStatusClasses();
    statusElement.classList.add("status-error")

    /*return to default settings if unable to use user's information to run function to get local temp and humidity*/
    currentLatitude = 39.4015;
    currentLongitude = -76.6019; 
    currentLocalName = "Towson";

    const weatherTitleId = document.getElementById("weather-title");
    if(weatherTitleId){
      weatherTitleId.textContent = `Current Weather for ${currentLocalName}`;
    }

    toggleTempUnitButtons(true);
    restartFetch();
  } 
}

// fetch weather data includes both temperatures and relative humidity using same fetch api but different parameters
async function fetchTempAndHumidityData() {
  // if data has been fetched at least once already, return data immediately
  if (weatherDataCache) {
    console.log(`Weather fetch Longitude=${currentLongitude}, Latitude =${currentLatitude}`);
    console.log("Daily weather data is using weatherDataCache");
    return weatherDataCache;
  }

  if (!currentLatitude||!currentLongitude) {
    console.error("Longitude and or Latitude coordinates have not been provided to run weather data for custom weather data information.")
    const statusElement = document.getElementById ("locations-status");
    statusElement.textContent = "Please Input zipcode";
    statusElement.classList.add("status-error");
    return null;
  }
  const temperatureUnit = pickTempUnit();
  try {
    console.log(`Fetch new weather data for ${currentLocalName} with temperature unit of ${temperatureUnit}`);

    // define the fetch forecast api based on the information for coordinates from prior api, include min temp, max temp, and relative humidity
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLatitude}&longitude=${currentLongitude}&daily=temperature_2m_max,temperature_2m_min&hourly=relative_humidity_2m&timezone=America%2FNew_York&forecast_days=1&temperature_unit=${temperatureUnit}`;
    
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Weather data for Temperature and Relative Humidity Failed : ${response.status}`);
    }

    /*variable to hold the data response sent over and parsed by json*/
    const data = await response.json(); 
    const maxTemp = data.daily.temperature_2m_max[0];
    const minTemp = data.daily.temperature_2m_min[0];
    const tempSymbol = (temperatureUnit === "fahrenheit")? "°F" : "°C";
    const relativeHumidityArray = data.hourly.relative_humidity_2m;
    const currentHour = new Date().getHours();
    let currentHumidity = "N/A"
    if (currentHour < relativeHumidityArray.length) {
        currentHumidity = relativeHumidityArray[currentHour];
    }
    
    /***********Get console.log for max temp, min temp and symbold */
    console.log("Temperatures and Relative Humidity data:", data);
    console.log(`Today's max temp: ${maxTemp.toFixed(1)}${tempSymbol}`);
    console.log(`Today's min temp: ${minTemp.toFixed(1)}${tempSymbol}`);
    console.log(`Today's hourly Relative Humidity: ${currentHumidity}%`);
    weatherDataCache = data;
    return data;

    //error in getting data back even though response to network occurred
  } catch (error) {
    console.error("Error fetching temperature and Relative Humidity data: ", error);
    return null;
  }
}  
 // display weather data for temps and relative humidity using the available cache if api has already been callsed once
// the function for display weather data does the actual fetch of the temp and humidity 

async function displayWeather(type) {
  let data = await fetchTempAndHumidityData();
  if(!data) {
    // if there is not data, then exit out
    return;
  }
  let resultValue = null;
  let listItemId = "";
  let label = "";
  let unit = "";
  // added oct 11th after radio buttons temp added
  // let unit = "°F";

  // Pick Fahrenheit or celsius
  const tempUnitString = pickTempUnit ();
  const tempSymbol = (tempUnitString=== "fahrenheit")? "°F" : "°C";

  if (type === "max" || type === "min") {
    // daily is an part of the properties listed in the api
    const daily = data.daily;
    listItemId = `${type}-temp`;
    unit = tempSymbol;
    
    if (type === "max") {
      resultValue = daily.temperature_2m_max[0];
      label = `Maximum Temperature Today is:`;
    } else {
      resultValue = daily.temperature_2m_min[0];
      label = `Minimum Temperature Today is:`;
    }
    //  account for type that is humidity
    } else if (type === "humidity") {
      const relativeHumidityArray = data.hourly.relative_humidity_2m;
      const todayTime = new Date();
      const currentHour = todayTime.getHours();
      // get time object to use for index of getHours and display by converting to string using built in JS method toLocaleTimeString

      if (currentHour < relativeHumidityArray.length) {
        resultValue = relativeHumidityArray[currentHour];
        listItemId = "humidity";
        unit = `%`; 

        const timeString = todayTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        label = `Relative Humidity at ${timeString} is:`;
        // need to assign variable to a different value
        
      } else {
        //just in case the Api data delays sending the new hourly measurement have a error message
        console.log(
          "Relative Humidity data for the hour is unavailable at this time. Please try again later. "
        );
        return;
      }
    //  exit program if type is not max, min, or humidity
  } else {
    return;
  }

  const listItem = document.getElementById(listItemId);
  // i need to insert into HTML using DOM if the resultValue is not empty and listItemId is not empty
  if (listItem && resultValue !== null) {
    listItem.innerHTML = `${label}<span class = "temp-value">${resultValue.toFixed(1)}${unit}</span>`;
  }
}
/*******define the function to begin the application when you load the page ***/
function initializeApp () {
  const currentYear = document.getElementById("current-year");
  if(currentYear){
    currentYear.textContent = new Date().getFullYear();
  }

  const weatherTitleId=document.getElementById("weather-title");
  if(weatherTitleId) {
    weatherTitleId.textContent =  `Current Weather for ${currentLocalName}`;
    document.getElementById("location-status").textContent = `Location is defaulted to ${currentLocalName}.For your USA zipcode, enter your own zipcode.`;
    restartFetch();
// want towson data immediately
    toggleTempUnitButtons (true); 
  } else {

  }
}
// put in an event handler to load all pages then start function initializeApp after all pages have loaded. Do not say window.onload = initializeApp(); because the function will load before all pages have loaded

window.onload = initializeApp; 

   
// fetch(
//   "https://api.open-meteo.com/v1/forecast?latitude=39.4015&longitude=-76.6019&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit"
// )
  // // GET the response
  // .then((response) => {
  //   if (!response.ok) {
  //     throw new Error("Request Failed");
  //   }
  //   //Parse response as JSON don't use JSON.Parse
  //   return response.json();
  // })
  // // Get data as in the information from  html doc
  // .then((weatherData) => {
  //   console.log("weatherData", weatherData);
  //   // exract weatherData temperature
  //   const maxTemp = weatherData.daily.temperature_2m_max[0];
  //   console.log(`Maximum Temperature Today is: ${maxTemp}°F`);
  //   const minTemp = weatherData.daily.temperature_2m_min[0];
  //   console.log(`Minimum Temperature Today is: ${minTemp}°F`);
  //   const maxTempListItem = document.getElementById("max-temp");
  //   if (maxTempListItem) {
  //     maxTempListItem.innerHTML = `Maximum Temperature Today is: ${maxTemp}°F`;
  //   }
  //   const minTempListItem = document.getElementById("min-temp");
  //   if (minTempListItem) {
  //     minTempListItem.innerHTML = `Minimum Temperature Today is: ${minTemp}°F`;
  //   }
  // });
/* 1.TODO: run asyn and await to make asynchronous code run 
asynch function fetchRelativeHumiditydata() {
  console.log ('Fetching hourly relative humidity data');
  // set current hour since relative humidity is collected hourly

  const currentHour= new Date().getHours();
  try [ 
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=39.4015&longitude=-76.6019&hourly=relative_humidity_2m&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit");

  if (!response.ok) {
      throw new Error('Relative Humidity Request failed'$response.status);
    }
    
  const humidityData = await response.json();
  // when JSOn parses the data it looks like an array

  console.log("Hourly Humidity Data", humidityData);
  const relativeHumidityArray = humidityData.hourly.relative_humidity_2m;
  
  if(currentHour < relativeHumidityArray.length) {
    const relativHumidityNow = relativeHumidityArray[currentHour];

    const currentTime = humidityData.hourly.time[currentHour]
  }
  
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

fetch("https://api.open-meteo.com/v1/forecast?latitude=39.4015&longitude=-76.6019&hourly=relative_humidity_2m&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit")
  // GET the response
  .then((response) => {
    if (!response.ok) {
      throw new Error("Request Failed");
    }
    //Parse response as JSON don't use JSON.Parse
    return response.json();
  })
  // Get data as in the information from  html doc
  .then((weatherCodeData) => {
    console.log("weatherCodeData", weatherCodeData);
    const weatherCodeInfo = weatherCodeData.hourly.relative_humidity_2m[i];
    console.log(`Relative Humdity by Noon: ${weatherCodeInfo}%`);
    const weatherCodeInfoItem = document.getElementById("humidity");
    if (weatherCodeInfoItem) {
    weatherCodeInfoItem.innerHTML = `Relative Humidity by Noon: ${weatherCodeInfo}%`;
    }

  });*/
// exract weatherCodeData weather code
// let footer = document.querySelector("footer");
// let today = new Date().getFullYear();
// let copyright = document.createElement("p");
// copyright.innerHTML = `\u00A9 ${today} Maryzabeth Philip. All Rights Reserved. All Photos by Maryzabeth Philip`;
// footer.appendChild(copyright);
// footer.style.textAlign = "center";
