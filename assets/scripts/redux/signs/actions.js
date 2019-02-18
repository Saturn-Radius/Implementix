import {createAsyncAction} from '../actions'
import {fetch} from '../../core/http'
import {ERROR} from '../notifications/actions'

const fetchSigns = createAsyncAction('FETCH_SIGNS', function() {
	return (dispatch) => {
		return fetch(`/api/signs`)
			.catch((err) => {
				dispatch(ERROR(...err.errors))
				dispatch(this.failed(err))
				throw err
			})
			.then((res) => {				
				const out = {signs: res}
				dispatch(this.success(out))
				return res
			})
	}
})


export default {
	...fetchSigns
}

