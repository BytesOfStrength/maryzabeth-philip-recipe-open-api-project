// ======fetch weather data===========
fetch(
  "https://api.open-meteo.com/v1/forecast?latitude=39.4015&longitude=-76.6019&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit"
)
  // GET the response
  .then((response) => {
    if (!response.ok) {
      throw new Error("Request Failed");
    }
    //Parse response as JSON don't use JSON.Parse
    return response.json();
  })
  // Get data as in the information from  html doc
  .then((weatherData) => {
    console.log("weatherData", weatherData);
    // exract weatherData temperature
    const maxTemp = weatherData.daily.temperature_2m_max[0];
    console.log(`Maximum Temperature Today is: ${maxTemp}°F`);
    const minTemp = weatherData.daily.temperature_2m_min[0];
    console.log(`Minimum Temperature Today is: ${minTemp}°F`);
    const maxTempListItem = document.getElementById("max-temp");
    if (maxTempListItem) {
      maxTempListItem.innerHTML = `Maximum Temperature Today is: ${maxTemp}°F`;
    }
    const minTempListItem = document.getElementById("min-temp");
    if (minTempListItem) {
      minTempListItem.innerHTML = `Minimum Temperature Today is: ${minTemp}°F`;
    }
  });
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
let footer = document.querySelector("footer");
let today = new Date().getFullYear();
let copyright = document.createElement("p");
copyright.innerHTML = `\u00A9 ${today} Maryzabeth Philip. All Rights Reserved. All Photos by Maryzabeth Philip`;
footer.appendChild(copyright);
footer.style.textAlign = "center";
