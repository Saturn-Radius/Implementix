import {createAsyncAction} from '../actions'
import {fetch} from '../../core/http'
import {ERROR} from '../notifications/actions'

const fetchPromos = createAsyncAction('FETCH_PROMOS', function() {
	return (dispatch) => {
		return fetch(`/api/promos`)
			.catch((err) => {
				dispatch(ERROR(...err.errors))
				dispatch(this.failed(err))
				throw err
			})
			.then((res) => {				
				const out = {promos: res}
				dispatch(this.success(out))
				return res
			})
	}
})


export default {
	...fetchPromos
}

