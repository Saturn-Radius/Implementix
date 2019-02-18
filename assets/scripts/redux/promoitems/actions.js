import {createAsyncAction} from '../actions'
import {fetch} from '../../core/http'
import {ERROR} from '../notifications/actions'

const fetchPromoItems = createAsyncAction('FETCH_PROMOITEMS', function() {
	return (dispatch) => {
		return fetch(`/api/promoitems`)
			.catch((err) => {
				dispatch(ERROR(...err.errors))
				dispatch(this.failed(err))
				throw err
			})
			.then((res) => {				
				const out = {promoitems: res}
				dispatch(this.success(out))
				return res
			})
	}
})


export default {
	...fetchPromoItems
}

