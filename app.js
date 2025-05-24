const API_KEY = "59170f08c7c847cfbe3135258250504";
const API_URL = "https://api.weatherapi.com/v1/forecast.json";
let pinLocation;

async function getWeather(location) {
  try {
    console.log("Fetching weather for:", location);
    const response = await fetch(
      `${API_URL}?key=${API_KEY}&q=${location}&days=1&aqi=no`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log("Weather data received:", data);
    updateWeatherDisplay(data);
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Error fetching weather data: " + error.message);
  }
}

function handleLocation() {
  const locationInput = document.getElementById("locationInput");
  const location = locationInput.value;

  if (!location) {
    alert("Please enter a location");
    return;
  }

  getWeather(location);
  locationInput.value = "";
}

function updateWeatherDisplay(data) {
  try {
    if (!data || !data.current) {
      throw new Error("Invalid weather data received");
    }

    console.log("Updating display with data:", data);
    document.getElementById("mainTemp").textContent = Math.round(
      data.current.temp_c
    );

    document.getElementById("location").textContent = data.location.name;
    pinLocation = data.location.name;

    document.getElementById("condition").textContent =
      data.current.condition.text;

    document.getElementById(
      "wind"
    ).textContent = `${data.current.wind_kph}km/h`;
    document.getElementById(
      "visibility"
    ).textContent = `${data.current.vis_km}km`;
    document.getElementById(
      "precipitation"
    ).textContent = `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;

    const astroData = data.forecast.forecastday[0].astro;
    document.getElementById("sunrise").textContent = astroData.sunrise;
    document.getElementById("sunset").textContent = astroData.sunset;
    document.getElementById("uv").textContent = `${data.current.uv}uv`;
  } catch (error) {
    console.error("Error updating weather display:", error);
    alert("Error displaying weather data: " + error.message);
  }
}

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationString = `${latitude},${longitude}`;
        getWeather(locationString);
      },
      (error) => {
        console.error("Geolocation Error:", error);
        alert("Error getting location: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

function addPin() {
  if (pinLocation) {
    const dropdownMenu = document.getElementById("dropdownMenu");

    // Create dropdown item button
    const dropdownItem = document.createElement("button");
    dropdownItem.classList.add("dropdown-item");

    // Create item content wrapper
    const itemContent = document.createElement("div");
    itemContent.classList.add("item-content");

    // Create star icon
    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("data-feather", "star");
    dropdownIcon.classList.add("dropdown-icon");

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button");

    const deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("data-feather", "x-circle");
    deleteIcon.classList.add("dropdown-icon");

    // Assemble the elements
    itemContent.appendChild(dropdownIcon);
    itemContent.appendChild(document.createTextNode(pinLocation));
    dropdownItem.appendChild(itemContent);
    deleteBtn.appendChild(deleteIcon);
    dropdownItem.appendChild(deleteBtn);
    dropdownMenu.appendChild(dropdownItem);

    deleteBtn.onclick = function (e) {
      e.stopPropagation();
      dropdownItem.remove();
    };

    dropdownItem.onclick = function (e) {
      e.stopPropagation();
      const itemContent = dropdownItem.firstChild;
      const itemContentTextNode = itemContent.lastChild;
      const itemLocation = itemContentTextNode.textContent;
      console.log(itemLocation);
      getWeather(itemLocation);
    };

    feather.replace();
  }
}

document.getElementById("geolocateBtn").addEventListener("click", getLocation);

document
  .getElementById("locationInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleLocation();
    }
  });

document.getElementById("searchBtn").addEventListener("click", function () {
  handleLocation();
});
