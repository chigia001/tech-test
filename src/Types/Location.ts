export interface Location {
  title: string
  location_type: 'City'|'Region / State / Province'|'Country'|'Continent'
  latt_long: string
  woeid: number
}
