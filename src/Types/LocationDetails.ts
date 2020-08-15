import { Prediction } from './Prediction'

export interface LocationDetail extends Omit<Location, 'woeid'> {
  consolidated_weather: Prediction[]
}
