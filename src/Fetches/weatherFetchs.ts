import { Location } from '@Types/Location'
import { Prediction } from '@Types/Prediction'
import { LocationDetail } from '@Types/LocationDetails'

const META_WEATHER_ROOT_API_URL = 'https://www.metaweather.com/api'

export const searchLocation = async (query: string): Promise<Location[]> => {
  const response = await fetch(`${META_WEATHER_ROOT_API_URL}/location/search/?query=${encodeURIComponent(query)}`)

  return (await response.json()) as Location[]
}

export const getPredition = async (woeid: string): Promise<LocationDetail> => {
  const response = await fetch(`${META_WEATHER_ROOT_API_URL}/location/woeid/`)

  return (await response.json()) as LocationDetail
}
