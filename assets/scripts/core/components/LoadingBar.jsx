import React from 'react'
export default class LoadingBar extends React.Component {
	render() {
		return (
			<div className="loading_container">
				<div className="loading_icon">
					<i className="fa fa-spinner fa-pulse fa-2x fa-fw"/>
				</div>
			</div>
		)
	}
}
