import React from 'react'
import _ from 'lodash'

export default class Preview extends React.Component {
	constructor(props) {
		super(props)
	}

	onClickClose() {
		if (typeof this.props.onClickClose === 'function') {
			this.props.onClickClose()
		}
	}

	render(){
		const {imageName, visible} = this.props

		return (
			<div className={visible ? 'preview_container visible' : 'preview_container'}>
				<div className="preview_toggle" onClick={::this.onClickClose}>
					<img className="preview_btnToggle" src={asset('/assets/resources/images/close.png')}/>
				</div>
				<img className="preview_image" src={asset('/cache/' + imageName + '.png')}/>
			</div>
		)
	}
}