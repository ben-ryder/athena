import { Observable } from "rxjs";
import { QUERY_LOADING, Query } from "../control-flow";
import { useEffect, useState } from "react";

/**
 * A helper hook which integrates a Localful observable query into React state,
 * automatically handling default state.
 *
 * @param observable
 */
export function useObservableQuery<Data>(observable: Observable<Query<Data>>) {
	const [state, setState] = useState<Query<Data>>(QUERY_LOADING)

	useEffect(() => {
		const subscription = observable.subscribe((data) => {
			setState(data)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return state
}
