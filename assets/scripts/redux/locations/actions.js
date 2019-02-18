import {createAsyncAction} from '../actions'
import {fetch} from '../../core/http'
import {ERROR} from '../notifications/actions'

const fetchLocations = createAsyncAction('FETCH_LOCATIONS', function() {
	return (dispatch) => {
		return fetch(`/api/locations`)
			.catch((err) => {
				dispatch(ERROR(...err.errors))
				dispatch(this.failed(err))
				throw err
			})
			.then((res) => {				
				const out = {locations: res}
				dispatch(this.success(out))
				return res
			})
	}
})


export default {
	...fetchLocations
}

