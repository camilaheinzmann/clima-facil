import { FormEvent, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import api from "../../services/api";

import "./styles.css";

import cloudsImg from "../../assets/049-clouds.svg";

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
      <header>
        <span className="credits">
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </span>
        <img className="weather-img" src={cloudsImg} alt="" />
      </header>
      <main className="container">
        <div className="finder">
          <form id="search-city" onSubmit={searchCity}>
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
          {weatherCity && (
            <section className="result-container">
              <h1>{locale}</h1>

              <p className="current-temp">
                {(Number(weatherCity?.current.temp) - 273.15).toFixed(1)} ºC
              </p>
              <ul className="max-min-temp">
                <li>
                  Máx{" "}
                  <strong>
                    {(Number(weatherCity?.daily[0].temp.max) - 273.15).toFixed(
                      1
                    )}{" "}
                    ºC
                  </strong>
                </li>
                <li>
                  Min{" "}
                  <strong>
                    {(Number(weatherCity?.daily[0].temp.min) - 273.15).toFixed(
                      1
                    )}{" "}
                    ºC
                  </strong>
                </li>
              </ul>
              <ul>
                <li>
                  Precip. <strong>{weatherCity?.daily[0].rain || 0} mm</strong>
                </li>
                <li>
                  Probab.{" "}
                  <strong>{Number(weatherCity?.daily[0].pop) * 100}%</strong>
                </li>
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
