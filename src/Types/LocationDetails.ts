import { Prediction } from './Prediction'
import { Location } from './Location'

export interface LocationDetail extends Omit<Location, 'woeid'> {
  consolidated_weather: Prediction[]
}
