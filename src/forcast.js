import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [filteredCities, setFilteredCities] = useState([]);
  const [cities, setCities] = useState([]); // List of cities for dropdown

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: city });
      });
  };

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    // Filter cities based on input
    if (input.length > 0) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleCityClick = (city) => {
    setQuery(city);
    setFilteredCities([]);
    search(city);
  };

  useEffect(() => {
    // Example cities list, replace with real data or API if needed
    setCities([
      "New York, USA",
      "Tokyo, Japan",
      "London, UK",
      "Paris, France",
      "Los Angeles, USA",
      "Shanghai, China",
      "Beijing, China",
      "Moscow, Russia",
      "Sydney, Australia",
      "Mumbai, India",
      "São Paulo, Brazil",
      "Toronto, Canada",
      "Hong Kong, China",
      "Dubai, UAE",
      "Berlin, Germany",
      "Mexico City, Mexico",
      "Bangkok, Thailand",
      "Singapore, Singapore",
      "Istanbul, Turkey",
      "Buenos Aires, Argentina",
      "Madrid, Spain",
      "Seoul, South Korea",
      "Jakarta, Indonesia",
      "Cairo, Egypt",
      "Rio de Janeiro, Brazil",
      "Rome, Italy",
      "Chicago, USA",
      "Kuala Lumpur, Malaysia",
      "Manila, Philippines",
      "Johannesburg, South Africa",
      "Barcelona, Spain",
      "Athens, Greece",
      "Vancouver, Canada",
      "Melbourne, Australia",
      "Lisbon, Portugal",
      "Washington, D.C., USA",
      "New Delhi, India",
      "Lima, Peru",
      "Santiago, Chile",
      "Nairobi, Kenya",
      "Zurich, Switzerland",
      "Budapest, Hungary",
      "Oslo, Norway",
      "Helsinki, Finland",
      "Prague, Czech Republic",
      "Vienna, Austria",
      "Stockholm, Sweden",
      "Warsaw, Poland",
      "Dublin, Ireland",
      "Brussels, Belgium",
    ]);
    search("Delhi");
  }, []);

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  return (
    
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box" style={{ position: 'relative' }}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={handleSearchChange}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => search(query)}
              alt="Search Icon"
            />
          </div>

          {/* Dropdown List */}
          {filteredCities.length > 0 && (
            <ul>
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul>
          {typeof weather.main != "undefined" ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°C ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forcast;