"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type ForecastData = {
  list: Array<{
    dt: number
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
    dt_txt: string
  }>
}

type WeatherForecastProps = {
  city: string
}

export function WeatherForecast({ city }: WeatherForecastProps) {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!city) return

    const fetchForecast = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch forecast data")
        }

        const data = await response.json()
        setForecastData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [city])

  // Group forecast data by day
  const groupedForecast =
    forecastData?.list.reduce(
      (acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(item)
        return acc
      },
      {} as Record<string, typeof forecastData.list>,
    ) || {}

  // Get unique days
  const days = Object.keys(groupedForecast)

  if (!city) return null

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : forecastData ? (
          <Tabs defaultValue={days[0]}>
            <TabsList className="grid grid-cols-5 mb-4">
              {days.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
            {days.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {groupedForecast[day].map((item, index) => {
                    const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      hour12: true,
                    })
                    return (
                      <div key={index} className="flex flex-col items-center p-3 border rounded-md">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                          className="w-12 h-12"
                        />
                        <span className="font-medium">{Math.round(item.main.temp)}°C</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {item.weather[0].description}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  )
}
