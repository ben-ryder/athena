import { Observable } from "rxjs";
import {QUERY_LOADING, Query, QueryStatus} from "../control-flow";
import { useEffect, useState } from "react";
import {Logger} from "../../src/utils/logger";

/**
 * A helper hook which integrates a Localful observable query into React state,
 * automatically handling default state.
 *
 * @param observable
 */
export function useObservableQuery<Data>(observable: Observable<Query<Data>>|undefined) {
	const [state, setState] = useState<Query<Data>>(QUERY_LOADING)

	useEffect(() => {
		if (!observable) {
			console.warn('useObservableQuery called with no observable')
			return
		}

		const subscription = observable.subscribe((data) => {
			if (data.status === QueryStatus.SUCCESS) {
				Logger.debug(`[useObservableQuery] Received new data`, data.data)
			}
			setState(data)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return state
}
