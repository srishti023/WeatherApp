import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const currentDate = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      city: null,
      country: null,
      temperatureC: null,
      humidity: null,
      description: null,
      icon: "CLEAR_DAY",
      main: null,
      errorMsg: null,
    };
  }

  componentDidMount() {
    this.initializeWeatherData();
    this.timerID = setInterval(this.updateWeatherData, 600000); // Update every 10 minutes
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  initializeWeatherData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.fetchWeatherData,
        this.handleGeolocationError
      );
    } else {
      alert("Geolocation not available");
    }
  };

  handleGeolocationError = () => {
    alert(
      "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating real-time weather."
    );
    this.fetchWeatherData({ coords: { latitude: 28.67, longitude: 77.22 } }); // Default to Delhi, India
  };

  fetchWeatherData = async (position) => {
    const { latitude, longitude } = position.coords || position;
    try {
      const response = await fetch(
        `${apiKeys.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await response.json();

      this.setState({
        lat: latitude,
        lon: longitude,
        city: data.name,
        country: data.sys.country,
        temperatureC: Math.round(data.main.temp),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        icon: this.getWeatherIcon(data.weather[0].main),
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  updateWeatherData = () => {
    const { lat, lon } = this.state;
    if (lat && lon) {
      this.fetchWeatherData({ coords: { latitude: lat, longitude: lon } });
    }
  };

  getWeatherIcon = (weatherMain) => {
    const iconMapping = {
      Haze: "CLEAR_DAY",
      Clouds: "CLOUDY",
      Rain: "RAIN",
      Snow: "SNOW",
      Dust: "WIND",
      Drizzle: "SLEET",
      Fog: "FOG",
      Smoke: "FOG",
      Tornado: "WIND",
    };
    return iconMapping[weatherMain] || "CLEAR_DAY";
  };

  render() {
    const {
      city, country, temperatureC, main, icon,
    } = this.state;

    return temperatureC ? (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{city}</h2>
            <h3>{country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{currentDate(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast icon={icon} weather={main} />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="Loading..." />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App
          <br />
          & used for calculating real-time weather.
        </h3>
      </React.Fragment>
    );
  }
}

export default Weather;