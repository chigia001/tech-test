import React, { ChangeEvent } from 'react'
import {
  BehaviorSubject,
  Observable,
  of,
  from,
  combineLatest,
  merge
} from 'rxjs'
import {
  distinctUntilChanged,
  shareReplay,
  switchMap,
  delay,
  mergeMap,
  map,
  startWith
} from 'rxjs/operators'

import { searchLocation } from '../../Fetches/weatherFetchs'

import { Action, ActionType } from './useSearchState'

const MIN_CHAR = 3

export const useHandler = (dispatch: React.Dispatch<Action>) => {
  const { input$, onChange } = React.useMemo(() => {
    const inputSub = new BehaviorSubject('')
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      inputSub.next(e.target.value)
    }
    const input$ = inputSub.pipe(distinctUntilChanged(), shareReplay(1))
    return {
      input$,
      onChange
    }
  }, [])

  const { toggleDropdownSub, open, close } = React.useMemo(() => {
    const toggleDropdownSub = new BehaviorSubject(false)
    return {
      toggleDropdownSub,
      open: () => toggleDropdownSub.next(true),
      close: () => toggleDropdownSub.next(false)
    }
  }, [])

  const action$ = React.useMemo(() => {
    const loadLocationAction$ = input$.pipe(
      switchMap(
        (input): Observable<Action> => {
          if (input.length < MIN_CHAR) {
            return of({
              type: ActionType.UPDATE_LOCATIONS,
              locations: []
            })
          }
          return of(null).pipe(
            delay(300),
            mergeMap(() => from(searchLocation(input))),
            map(
              (locations): Action => ({
                type: ActionType.UPDATE_LOCATIONS,
                locations
              })
            ),
            startWith<Action>({
              type: ActionType.START_LOADING
            })
          )
        }
      )
    )

    const inputAction$ = input$.pipe(
      map(
        (input): Action => ({
          type: ActionType.UPDATE_INPUT,
          input
        })
      )
    )

    const showHideAction$ = combineLatest(
      input$.pipe(
        map((val) => val.length >= MIN_CHAR),
        distinctUntilChanged()
      ),
      toggleDropdownSub
    ).pipe(
      map(
        ([minLength, show]): Action => ({
          type: minLength && show ? ActionType.SHOW : ActionType.HIDE
        })
      )
    )

    return merge(inputAction$, showHideAction$, loadLocationAction$)
  }, [input$, toggleDropdownSub])

  React.useEffect(() => {
    const sub = action$.subscribe(dispatch)
    return () => {
      sub.unsubscribe()
    }
  }, [action$, dispatch])

  return {
    onChange,
    open,
    close
  }
}
