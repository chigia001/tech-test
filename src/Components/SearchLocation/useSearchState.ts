import React from 'react'

import { Location } from '../../Types/Location'

interface SearchLocationState {
  input: string
  showLocations: boolean
  isLoading: boolean
  locations: Location[]
}

const searchLocationInitState: SearchLocationState = {
  input: '',
  showLocations: false,
  isLoading: false,
  locations: []
}

export enum ActionType {
  START_LOADING = 'START_LOADING',
  UPDATE_LOCATIONS = 'UPDATE_LOCATIONS',
  HIDE = 'HIDE',
  SHOW = 'SHOW',
  UPDATE_INPUT = 'UPDATE_INPUT',
}

export type Action =
  | {
    type: ActionType.UPDATE_LOCATIONS
    locations: Location[]
  }
  | {
    type: ActionType.UPDATE_INPUT
    input: string
  }
  | {
    type: ActionType.HIDE
  }
  | {
    type: ActionType.SHOW
  }
  | {
    type: ActionType.START_LOADING
  }

const locationSearchReducer = (
  state: SearchLocationState,
  action: Action
): SearchLocationState => {
  switch (action.type) {
    case ActionType.UPDATE_INPUT: {
      return {
        ...state,
        input: action.input
      }
    }
    case ActionType.START_LOADING: {
      return {
        ...state,
        isLoading: true
      }
    }
    case ActionType.UPDATE_LOCATIONS: {
      return {
        ...state,
        isLoading: false,
        locations: action.locations
      }
    }
    case ActionType.HIDE: {
      return {
        ...state,
        isLoading: false,
        showLocations: false
      }
    }
    case ActionType.SHOW: {
      return {
        ...state,
        showLocations: true
      }
    }
    default: {
      return state
    }
  }
}

export const useSearchState = (location: Location | null): [SearchLocationState, React.Dispatch<Action>] => {
  const [
    { input, showLocations, isLoading, locations },
    dispatch
  ] = React.useReducer(locationSearchReducer, searchLocationInitState)
  const locationTitle = location?.title ?? ''
  React.useEffect(() => {
    dispatch({
      type: ActionType.UPDATE_INPUT,
      input: locationTitle
    })
  }, [locationTitle, dispatch])
  return [{
    input,
    showLocations,
    isLoading,
    locations: isLoading ? [] : locations
  }, dispatch]
}
