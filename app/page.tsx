"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, RefreshCw, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

type WeatherData = {
  name: string
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

export default function WeatherDashboard() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Load search history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`,
      )

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "City not found. Please check the spelling and try again."
            : "Failed to fetch weather data. Please try again later.",
        )
      }

      const data = await response.json()
      setWeatherData(data)

      // Update search history
      const updatedHistory = [cityName, ...searchHistory.filter((item) => item !== cityName)].slice(0, 5)
      setSearchHistory(updatedHistory)
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeather(city)
  }

  const handleHistoryClick = (cityName: string) => {
    setCity(cityName)
    fetchWeather(cityName)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Weather Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} id="dark-mode" />
            <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Search
          </Button>
        </form>

        {searchHistory.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : weatherData ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex justify-between items-center">
                <span>{weatherData.name}</span>
                <Button variant="ghost" size="icon" onClick={() => fetchWeather(weatherData.name)} title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-20 h-20"
                  />
                  <div className="ml-2">
                    <h2 className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</h2>
                    <p className="text-gray-500 dark:text-gray-400 capitalize">{weatherData.weather[0].description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="font-medium">{weatherData.main.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Wind Speed</p>
                    <p className="font-medium">{weatherData.wind.speed} km/h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Search for a city to see the weather information
          </div>
        )}
      </div>
    </div>
  )
}
