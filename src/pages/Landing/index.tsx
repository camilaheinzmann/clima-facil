import { FormEvent, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import api from "../../services/api";

import "./styles.css";

import logoImg from "../../assets/logo.svg";
import cloudyImg from "../../assets/cloudy.svg";

interface WeatherData {
  current: {
    temp: number;
  };
  daily: [
    {
      temp: {
        min: number;
        max: number;
      };
      pop: number;
      rain: number;
    }
  ];
}

export default function Landing() {
  const [city, setCity] = useState("");
  const [locale, setLocale] = useState("");
  const [weatherCity, setWeatherCity] = useState<WeatherData>();

  async function searchCity(event: FormEvent) {
    event.preventDefault();

    const cityData = await api.get(
      `weather?q=${city},br&appid=${process.env.REACT_APP_OPENWEATHERMAP_KEY}`
    );

    setLocale(cityData.data.name);
    const [lat, lon] = [cityData.data.coord.lat, cityData.data.coord.lon];

    const response = await api.get(
      `onecall?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHERMAP_KEY}`
    );

    setWeatherCity(response.data);
  }

  return (
    <div id="page-landing">
      <div className="container">
        <img className="logo-img" src={logoImg} alt="Clima Fácil" />

        <div className="finder">
          <form onSubmit={searchCity}>
            <input
              type="search"
              placeholder="Digite o nome da sua cidade"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
              }}
            />
            <button type="button" onClick={searchCity}>
              <FaArrowRight color="#f5f2f2" />
            </button>
          </form>
          {weatherCity ? (
            <div className="result-container">
              <h1>{locale}</h1>

              <p>
                Temperatura atual:{" "}
                {(Number(weatherCity?.current.temp) - 273.15).toFixed(1)} ºC
              </p>
              <p>
                Máx:{" "}
                {(Number(weatherCity?.daily[0].temp.max) - 273.15).toFixed(1)}{" "}
                ºC
              </p>
              <p>
                Min:{" "}
                {(Number(weatherCity?.daily[0].temp.min) - 273.15).toFixed(1)}{" "}
                ºC
              </p>
              <p>Probabilidade: {Number(weatherCity?.daily[0].pop) * 100}%</p>
              <p>Precipitação: {weatherCity?.daily[0].rain || 0} mm</p>
            </div>
          ) : (
            <img
              className="cloudy-img"
              src={cloudyImg}
              alt="Sol entre nuvens"
            />
          )}
        </div>
        <div className="credits">
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
    </div>
  );
}
