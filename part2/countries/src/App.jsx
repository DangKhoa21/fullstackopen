import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  console.log("rendering app")

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log("successfully fetched countries");
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = query
    ? countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()))
    : countries

  return (
    <div>
      <p>find countries <input value={query} onChange={e => setQuery(e.target.value)}/></p>
      <div>
      {countriesToShow.length > 10 && 'Too many matches, specify another filter'}
      {countriesToShow.length > 1 && countriesToShow.length < 10 
      && countriesToShow.map(country => {
        return (
          <div key={country.name.common}>
            <p key={country.name.common}>{country.name.common} 
            <button onClick={() => setQuery(country.name.common)}>show</button>
            </p>
          </div>
        )}
      )}
      {countriesToShow.length === 1 && <Country country={countriesToShow[0]}/>}
      {countriesToShow.length === 0 && 'No matches, specify another filter'}
      </div>
    </div>
  )
}

const Country = ({ country }) => {

  const [weather, setWeather] = useState(null)
  const [lat, lon] = country.capitalInfo.latlng
  const APIkey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`
  console.log("render a country")

  useEffect(() => {
    axios
      .get(weatherUrl)
      .then(response => {
        console.log("successfully fetched weather");
        console.log(response.data)
        setWeather(response.data)
      })  
  }, [])


  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} height="100" alt={country.flags.alt}/>
      {weather && 
      <>
        <h2>Weather in {country.capital}</h2>
        <p>temperature {weather.main.temp} Farenheit</p>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <p>wind {weather.wind.speed} mph direction {weather.wind.deg}</p>
      </>}
    </div>
  )
}

export default App
