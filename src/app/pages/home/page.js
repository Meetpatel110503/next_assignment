"use client"
import React, { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import Loader from "@/app/components/Loader"
import { API_URL } from "../config/Config"
import { ERROR } from "../config/Config"

const Home = ({ initialWeatherData, initialForecastData }) => {
  const { register, handleSubmit } = useForm()
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherData, setWeatherData] = useState(initialWeatherData)
  const [forecastData, setForecastData] = useState(initialForecastData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [unit, setUnit] = useState("metric")

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY
  const URL = `${API_URL}/weather?appid=${API_KEY}&units=${unit}&q=`
  const FORECAST_URL = `${API_URL}/forecast?appid=${API_KEY}&units=${unit}&q=`

  const fetchWeatherData = async (query) => {
    try {
      setLoading(true)
      setError("")
      const response = await axios.get(URL + query)
      setWeatherData(response.data)
      fetchForecastData(query)
    } catch (error) {
      setError(ERROR)
    }
    setLoading(false)
  }

  const fetchForecastData = async (query) => {
    try {
      const response = await axios.get(FORECAST_URL + query)
      setForecastData(response.data)
    } catch (error) {
      setError(ERROR)
    }
  }

  const handleFormSubmit = (data) => {
    const query = data.searchQuery.trim()
    if (query) {
      setSearchQuery(query)
      fetchWeatherData(query)
    }
  }

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric")
  }

  const convertTemperature = (temp) => {
    if (unit === "metric") {
      return temp
    } else {
      return ((temp * 9) / 5 + 32).toFixed(2)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div
      className='min-h-screen flex flex-col justify-center items-center'
      style={{
        backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Sky_over_Munich_02.jpg/1200px-Sky_over_Munich_02.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className='weather-card border border-blue-200 bg-white shadow-lg rounded-lg p-6 m-8 md:w-96 lg:w-120'>
        <h1 className='title text-4xl font-bold mb-8 text-center'>
          Weather App
        </h1>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='flex flex-col items-center'
        >
          <input
            type='text'
            {...register("searchQuery")}
            placeholder='Enter city name or ZIP code'
            className='input-box border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 mb-4 w-full'
            required
          />
          <button
            type='submit'
            className='bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-300 w-full'
          >
            Search
          </button>
        </form>

        {error ? <p className='text-red-600 mt-4'>{error}</p> : <></>}
        {loading ? (
          <Loader />
        ) : (
          weatherData && (
            <div className='mt-4'>
              <h2 className='text-2xl font-bold'>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className='text-lg'>
                Temperature: {convertTemperature(weatherData.main.temp)}°
                {unit === "metric" ? "C" : "F"}
              </p>
              <p className='text-lg'>Humidity: {weatherData.main.humidity}%</p>
              <p className='text-lg'>
                Wind Speed: {weatherData.wind.speed}{" "}
                {unit === "metric" ? "m/s" : "mph"}
              </p>
              <p className='text-lg'>
                Weather: {weatherData.weather[0].description}
              </p>
            </div>
          )
        )}
        <button
          onClick={toggleUnit}
          className='mt-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-300 w-full'
        >
          Toggle {unit === "metric" ? "Fahrenheit" : "Celsius"}
        </button>
      </div>
      <div className=''>
        {loading ? (
          <Loader />
        ) : (
          forecastData && (
            <div className=' mt-8'>
              <h2 className='text-2xl font-bold text-center'>5-Day Forecast</h2>
              <div className='flex flex-wrap md:flex-row justify-around'>
                {forecastData.list
                  .filter((item, index) => index % 8 === 0)
                  .slice(0, 7)
                  .map((item) => (
                    <div
                      key={item.dt}
                      className='flex flex-col items-center justify-between bg-white border border-blue-200 rounded-lg shadow-md p-4 m-3'
                    >
                      <div className='flex items-center'>
                        <div className='mr-4'>
                          <img
                            src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt={item.weather[0].description}
                          />
                        </div>
                        <div>
                          <p className='forecast-item  font-semibold'>
                            {formatDate(item.dt * 1000)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {item.weather[0].description}
                          </p>
                        </div>
                      </div>
                      <div className='text-right '>
                        <p className='forecast-item font-semibold'>
                          {convertTemperature(item.main.temp)}
                        </p>
                        <p className='text-sm text-gray-600 '>
                          Humidity: {item.main.humidity}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

Home.getStaticProps = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY
  const URL = `${API_URL}/weather?appid=${API_KEY}&q=Valsad`
  const FORECAST_URL = `${API_URL}/forecast?appid=${API_KEY}&q=Valsad`

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(URL),
      axios.get(FORECAST_URL),
    ])

    return {
      props: {
        initialWeatherData: weatherResponse.data,
        initialForecastData: forecastResponse.data,
      },
    }
  } catch (error) {
    return {
      initialWeatherData: null,
      initialForecastData: null,
    }
  }
}

export default Home
