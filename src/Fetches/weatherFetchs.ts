import { Location } from '../Types/Location'
import { LocationDetail } from '../Types/LocationDetails'

export const searchLocation = async (query: string): Promise<Location[]> => {
  const response = await fetch(`/api/location/search/?query=${encodeURIComponent(query)}`)
  if (response.ok) {
    return (await response.json()) as Location[]
  }

  return []
}

export const getLocationDetails = async (woeid: number): Promise<LocationDetail> => {
  const response = await fetch(`/api/location/${woeid}/`)
  if (response.ok) {
    return (await response.json()) as LocationDetail
  }

  throw await response.json()
}
