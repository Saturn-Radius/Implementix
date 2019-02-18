import {createAsyncAction} from '../actions'
import {fetch} from '../../core/http'
import {ERROR} from '../notifications/actions'

const fetchBrands = createAsyncAction('FETCH_BRANDS', function() {
	return (dispatch) => {
		return fetch(`/api/brands`)
			.catch((err) => {
				dispatch(ERROR(...err.errors))
				dispatch(this.failed(err))
				throw err
			})
			.then((res) => {				
				const out = {brands: res}
				dispatch(this.success(out))
				return res
			})
	}
})

export default {
	...fetchBrands
}

