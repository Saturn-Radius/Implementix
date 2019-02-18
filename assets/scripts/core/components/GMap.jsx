import React from 'react'
import Immutable from 'immutable'
import _ from 'lodash'
import moment from 'moment-timezone'

const MAP_ZOOM = 10
const MARKER_NORMAL = 100
const MARKER_SELECTED = 101

const ICON_NORMAL = {url: asset('/assets/resources/images/icon_map_pin_normal.png')}
const ICON_NORMAL_VEHICLE = {url: asset('/assets/resources/images/icon_map_pin_vehicle_normal.png')}
const ICON_NORMAL_PROMO = {url: asset('/assets/resources/images/icon_map_pin_promo_normal.png'), anchor: new google.maps.Point(6, 40)}
const ICON_SELECTED = {url: asset('/assets/resources/images/icon_map_pin_selected.png')}
const ICON_SELECTED_VEHICLE = {url: asset('/assets/resources/images/icon_map_pin_vehicle_selected.png')}
const ICON_SELECTED_PROMO = {url: asset('/assets/resources/images/icon_map_pin_promo_selected.png'), anchor: new google.maps.Point(6, 40)}

import {LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from './Layers'

const locationPropType = React.PropTypes.shape({
	id: React.PropTypes.number,
	latitude: React.PropTypes.number,
	longitude: React.PropTypes.number,
	data: React.PropTypes.object,
})

function fitBounds(map, bounds) {
	if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
		 var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.2, bounds.getNorthEast().lng() + 0.2)
		 var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.2, bounds.getNorthEast().lng() - 0.2)
		 bounds.extend(extendPoint1)
		 bounds.extend(extendPoint2)
	}
	map.fitBounds(bounds)  
}

function fromLatLngToPoint(latLng, map) {
	var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast())
	var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest())
	var scale = Math.pow(2, map.getZoom())
	var worldPoint = map.getProjection().fromLatLngToPoint(latLng)
	return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale)
}

export default class Map extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			map: null
		}
		this.markers = []
		this.markerCluster = null
		this.resizeListener = null
		this.listeners = []
		this.timer = null
		this.oldMarker = null
		this.oldMarkerID = null
	}

	detectGoogleSDK(successFunc) {
		if (global.google) { return successFunc(global.google) }
		this.timer = setTimeout(this.detectGoogleSDK.bind(this, successFunc), 3000)
	}

	componentDidMount() {
		let width = $(window).width()
		let height = $(window).height()
		let min = Math.min(width, height)
		let isMobile = min < 768
		this.detectGoogleSDK(() => {
			// create new map
			const map = new google.maps.Map(this.refs.map, {
				zoom: 4,
				center: new google.maps.LatLng(38.4772834,-100.5684513),
				mapTypeId: 'roadmap',
				minZoom: 2,
				maxZoom: 20,
				disableDefaultUI: false, //isMobile
			})
			// resize handler
			this.resizeListener = google.maps.event.addDomListener(window, 'resize', () => {
				const center = map.getCenter()
				google.maps.event.trigger(map, 'resize')
				map.setCenter(center)
			})			
			this.setState({map: map})
			this.drawMap(map, this.props)			
		})
	}

	componentWillUnmount() {
		if (this.resizeListener) { google.maps.event.removeListener(this.listener) }
		if (this.timer) { clearTimeout(this.timer) }		
		this.clearMap(this.props)
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.layer == this.props.layer && nextProps.positions.length == this.props.positions.length && nextProps.cluster == this.props.cluster && nextProps.heatmap == this.props.heatmap){
			return
		}
		this.clearMap(this.props)
		this.drawMap(nextState.map, nextProps)		
	}

	clearMap(props){
		this.hideTooltip()
		this.clearMarkers(props.cluster, props.heatmap)
		// clear listeners
		_.map(this.listeners, (listener)=>{
			if(listener) {google.maps.event.removeListener(listener)}
		})
		this.oldMarker = null
		this.oldMarkerID = null
		this.markers = []
		this.listeners = []
	}

	getIcon(layer, isSelected){
		let icon = ICON_NORMAL
		switch(layer){
			case LAYER_LOCATION:
			case LAYER_SIGNS:
				icon = isSelected ? ICON_SELECTED : ICON_NORMAL
				break
			case LAYER_PROMOS:
				icon = isSelected ? ICON_SELECTED_PROMO : ICON_NORMAL_PROMO
				break
			case LAYER_VEHICLES:
				icon = isSelected ? ICON_SELECTED_VEHICLE : ICON_NORMAL_VEHICLE
				break
			default:
				icon = isSelected ? ICON_SELECTED : ICON_NORMAL
				break
		}
		return icon
	}

	addMarker(layer, map, position, selected, cluster, heatmap){
		let isSelected = selected && parseInt(selected) == parseInt(position.id)
		let icon = this.getIcon(layer, isSelected)
		let options = {
			position: new google.maps.LatLng(position.latitude, position.longitude),
			icon: icon,
			zIndex: isSelected ? MARKER_SELECTED : MARKER_NORMAL,			
		}
		if(!cluster)
			options.map = map
		let marker = new google.maps.Marker(options)
		
		if(isSelected){
			this.oldMarker = marker
			this.oldMarkerID = selected
		}
		this.markers.push(marker)
		return marker
	}

	setMapOnAll(map){
		_.map(this.markers, (marker, length)=>{
			marker.setMap(map)
		})
	}

	clearMarkers(cluster, heatmap){
		if(cluster){
			if(this.markerCluster){
				this.markerCluster.clearMarkers()
				// this.markerCluster.setMap(null)
				this.markerCluster = null
			}	
		}else{
			if(heatmap){
				if(this.markerHeatmap){
					this.markerHeatmap.setMap(null)
					this.markerHeatmap = null
				}
				this.markers = []
			}else
				this.setMapOnAll(null)			
		}
	}

	showMarkers(){
		this.setMapOnAll(map)
	}

	moveMap(map, positions){
		if(!map)
			return
		const bounds = new google.maps.LatLngBounds()
		_.map(positions, (position, index) => {
			bounds.extend({lat: position.latitude, lng: position.longitude})
		})
		fitBounds(map, bounds)
	}

	drawMap(map, props){
		if(props.positions.length == 0)
			return
		// locate positions
		this.placeMarkers(map, props)
		if(props.cluster == this.props.cluster && props.heatmap == this.props.heatmap){
			// movemap unless cluster is toggled
			this.moveMap(map, props.positions)
		}
	}

	adjustTooltip(layer, point){
		let width, height
		switch(layer){
			case LAYER_LOCATION:
				width = $('#location-tooltip').width()
				height = $('#location-tooltip').height()
				$('#location-tooltip').css({
					'left': point.x - width / 2,
					'top': point.y - height
				}).show()
				break
			case LAYER_SIGNS:
				width = $('#signs-tooltip').width()
				height = $('#signs-tooltip').height()
				$('#signs-tooltip').css({
					'left': point.x - width / 2,
					'top': point.y - height
				}).show()
				break
			case LAYER_PROMOS:
				// width = $('#promo-tooltip').width()
				// height = $('#promo-tooltip').height()
				// $('#promo-tooltip').css({
				// 	'left': point.x - 14,
				// 	'top': point.y - height - 40
				// }).show()
				break
			case LAYER_VEHICLES:
				// width = $('#vehicle-tooltip').width()
				// height = $('#vehicle-tooltip').height()
				// $('#vehicle-tooltip').css({
				// 	'left': point.x - width / 2,
				// 	'top': point.y - height - 40
				// }).show()
				break
			default:
				break
		}		
	}

	showTooltip(layer, map, marker, data){
		let self = this
		var point = fromLatLngToPoint(marker.getPosition(), map)
		if(layer == LAYER_LOCATION){
			$('#location-name').text(data['Location Name'])
			$('#location-sitemap').attr('src', asset('/cache/' + data['Site Map'] + '.png'))
			$('#location-lastbrand').text(moment(data['Last Brand Compliance Check'], 'YYYY-MM-DD').format('MM/DD/YYYY'))
			let brandCompliance = data['Brand Compliance Status']
			$('#location-brandcompliance').text(brandCompliance)
			$('#location-brandcompliance').css({
				'color': brandCompliance == 'Pass' ? 'lightgreen' : 'red'
			})
			let percent = Math.round(data['Signs That Are Brand Compliant']*100)			
			$('#location-percentsigns').text(percent + '%')
			$('#location-percentsigns').css({
				'color': percent == 100 ? 'lightgreen' : 'red'
			})
			$('#location-address').text(data['Address'])
			if(data['Site Map']){
				var tmpImg = new Image()
				tmpImg.src = $('#location-sitemap').attr('src')
				tmpImg.onload = function() {
					$('.location-sitemap').show()
					$('.location-spacing').css({'height': 50})
					self.adjustTooltip(layer, point)
				}
			}else{
				$('.location-sitemap').hide()
				$('.location-spacing').css({'height': 25})
				self.adjustTooltip(layer, point)
			}
			// marker.setVisible(false)
		}
		if(layer == LAYER_SIGNS){			
			$('#tooltip-signs-img').attr('src', asset('/cache/' + data['Latest Brand Compliance Photo'] + '.png'))
			var tmpImg = new Image()
			tmpImg.src = $('#tooltip-signs-img').attr('src')
			tmpImg.onload = function() {
				self.adjustTooltip(layer, point)
			}
		}
		if(layer == LAYER_PROMOS){
			self.adjustTooltip(layer, point)
		}
		if(layer == LAYER_VEHICLES){
			self.adjustTooltip(layer, point)
		}	
	}

	hideTooltip(layer){
		$('#location-tooltip').hide()
		$('#signs-tooltip').hide()
		$('#promo-tooltip').hide()
		$('#vehicle-tooltip').hide()
	}	

	selectMarker(props, id, data, marker){
		if(this.oldMarker && this.oldMarkerID == id)
			return
		props.onClickMarker(id, data)
		if(this.oldMarker){
			this.oldMarker.setIcon(this.getIcon(props.layer, false))
			this.oldMarker.setZIndex(MARKER_NORMAL)
		}
		marker.setIcon(this.getIcon(props.layer, true))
		marker.setZIndex(MARKER_SELECTED)
		this.oldMarker = marker
		this.oldMarkerID = id
	}

	unselectMarkers(props){
		if(this.oldMarker){
			this.oldMarker.setIcon(this.getIcon(props.layer, false))
			this.oldMarker.setZIndex(MARKER_NORMAL)
			this.oldMarker = null
			this.oldMarkerID = null
		}
		props.onClickMap()
	}

	placeMarkers(map, props) {
		if (!map)
			return
		let self = this
		let {positions, layer, selected} = props

		let listener = null
		// zoom change event
		listener = google.maps.event.addListener(map, 'zoom_changed', function(){
			self.hideTooltip(layer)
		})
		self.listeners.push(listener)
		// map idle after dragging
		listener = google.maps.event.addListener(map, 'idle', function(){
			self.hideTooltip(layer)
		})
		self.listeners.push(listener)
		// map click to unselect
		listener = google.maps.event.addListener(map, 'click', function(){
			self.unselectMarkers(props)
		})
		self.listeners.push(listener)

		// add markers
		_.map(positions, (position, index)=>{
			if(props.heatmap){
				this.markers.push(new google.maps.LatLng(position.latitude, position.longitude))
			}else{
				// add marker
				let marker = self.addMarker(layer, map, position, selected, props.cluster)
				// add click event
				listener = google.maps.event.addListener(marker, 'click', function() {
					self.selectMarker(props, position.id, position.data, marker)
				})
				self.listeners.push(listener)
				// add mouseover event
				listener = google.maps.event.addListener(marker, 'mouseover', function(){
					self.showTooltip(layer, map, marker, position.data)
				})
				self.listeners.push(listener)
				// add mouseout event
				listener = google.maps.event.addListener(marker, 'mouseout', function(){
					// marker.setVisible(true)
					self.hideTooltip(layer)
				})
				self.listeners.push(listener)
			}			
		})

		if(props.cluster){
			// set clustering
			var markerClusterOptions = {
				zoomOnClick: false,
				styles: [{
					textColor: 'white',
					width: 32,
					height: 34,
					url: asset('/assets/resources/images/geographics/p1.png'),
				},
				{
					textColor: 'white',
					width: 38,
					height: 37,
					url: asset('/assets/resources/images/geographics/p2.png'),      
				},
				{
					textColor: 'white',
					width: 44,
					height: 43,
					url: asset('/assets/resources/images/geographics/p3.png'),
				},
				{
					textColor: 'white',
					width: 48,
					height: 49,
					url: asset('/assets/resources/images/geographics/p4.png'),
				},
				{
					textColor: 'white',
					width: 54,
					height: 52,
					url: asset('/assets/resources/images/geographics/p5.png'),
				}]
			}
			// Add a marker clusterer to manage the markers.
			var googleClusters = {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
			self.markerCluster = new MarkerClusterer(map, self.markers, googleClusters)
			// var markerCluster = new MarkerClusterer(map, markers, googleClusters)
		}
		if(props.heatmap){
			self.markerHeatmap = new google.maps.visualization.HeatmapLayer({
				data: this.markers,
				map: map
			})
			self.markerHeatmap.set('radius', 15)
			var gradient = [
				'rgba(0, 255, 255, 0)',
				'rgba(0, 255, 255, 1)',
				'rgba(0, 191, 255, 1)',
				'rgba(0, 127, 255, 1)',
				'rgba(0, 63, 255, 1)',
				'rgba(0, 0, 255, 1)',
				'rgba(0, 0, 223, 1)',
				'rgba(0, 0, 191, 1)',
				'rgba(0, 0, 159, 1)',
				'rgba(0, 0, 127, 1)',
				'rgba(63, 0, 91, 1)',
				'rgba(127, 0, 63, 1)',
				'rgba(191, 0, 31, 1)',
				'rgba(255, 0, 0, 1)'
			]
			self.markerHeatmap.set('gradient', gradient)
		}
	}

	render() { 
		return	<div ref="map" style={{width: '100%', height: '100%'}} />
	}	
}
