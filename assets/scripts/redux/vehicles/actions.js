import {createAsyncAction} from '../actions'
import {fetch} from '../../core/http'
import {ERROR} from '../notifications/actions'

const fetchVehicles = createAsyncAction('FETCH_VEHICLES', function() {
	return (dispatch) => {
		return fetch(`/api/vehicles`)
			.catch((err) => {
				dispatch(ERROR(...err.errors))
				dispatch(this.failed(err))
				throw err
			})
			.then((res) => {				
				const out = {vehicles: res}
				dispatch(this.success(out))
				return res
			})
	}
})

export default {
	...fetchVehicles
}

