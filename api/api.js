"use strict"
let fs = require('fs')
let path = require('path')
let util = require('util')
let TrackviaAPI = require('trackvia-api')
let _ = require('lodash')
let Router = require('express').Router
let router = module.exports = Router()
let jwt = require('jsonwebtoken')
let rp = require('request-promise')

// constants for api connection
const API_KEY = 'f6bdc1df0322966bbb811795e1a28221'
const COOKIE_TIME = 60*24*60*60*1000 // 2 month
let tvApi = new TrackviaAPI(API_KEY)

// constant for api response
const RETURN_SUCCESS = 200
const RETURN_DELETED = 204
const RETURN_API_ERROR = 400
const RETURN_LOGIN_FAILED = 401
const RETURN_ACCESS_DENIED = 403

// constants for views
const VIEW_LOCATION = 612
const VIEW_SIGN = 611 // conversion signs
const VIEW_BRAND = 615 // brand compliance
const VIEW_PROMO = 616 // promos
const VIEW_PROMOITEM = 547 // promo items
const VIEW_VEHICLE = 614 // vehicles
const VIEW_ZIPCODE = 716 // zipcodes
const VIEW_COUNTY = 720 // county
const VIEW_STATE = 721 // zipcodes

// constants for zipcode update
const TAPESTRY_VERSION_LATEST = 1
const TAPESTRY_ISVALID = 1
const TAPESTRY_ISINVALID = 0
const TAPESTRY_TYPE_ZIPCODE = 1
const TAPESTRY_TYPE_COUNTY = 2
const TAPESTRY_TYPE_STATE = 3

// constants for image file cache
const IMAGE_CACHE = path.join(__dirname, '../dist/cache')
const CONSOLE_LOG = 'log'

// constants for downloadsize
const PAGING_START = 0
const PAGING_MAX = 10000

// utility functions
function create_log(){
	const dir = path.join(__dirname, CONSOLE_LOG)
	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir)
	}
	const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '').replace(/-/g, '')
	const logpath = dir + '/' + (timestamp) + '.log'
	const log_file = fs.createWriteStream(logpath, {flags : 'w'})
	const log_stdout = process.stdout
	console.log = function(d) { //
		log_file.write(util.format(d) + '\n')
		log_stdout.write(util.format(d) + '\n')
	}
}

function create_cache(){
	let cache = IMAGE_CACHE
	if(!fs.existsSync(cache)){
		console.log('cache created')
		fs.mkdirSync(cache)
	}
}

function get_path_from_id(id){
	return path.join(IMAGE_CACHE, id.toString() + '.png')
}

function check_is_exist(id){
	let filePath = get_path_from_id(id)
	return fs.existsSync(filePath)
}

function write_image(id, data){
	// prepare folder if not exists
	if(!id || !data){
		// console.log('- data invalid: ' + id + ',' + data)
		return
	}		
	fs.writeFileSync(get_path_from_id(id), data, 'binary')
	// console.log('- id created: ' + id)
}

function download_image(tvApi, id, viewID, recordID, fieldName){
	// console.log(id + ',' + viewID + ',' + recordID + ',' + fieldName)
	if(!id){
		// console.log('- id invalid: ' + id)
		return
	}
	if(check_is_exist(id)){
		// console.log('- id exists: ' + id)
		return
	}
	tvApi.getFile(viewID, recordID, fieldName).then((ret)=>{
		write_image(id, ret.body)
	}).catch((ret)=>{
		// console.log('- download error:' + id + ',' + viewID + ',' + recordID + ',' + fieldName + ',' + JSON.stringify(ret.body))
	})
}

create_cache()

function tapestry_geometry(type, row, callback){
	console.log('-tapestry_geometry')
	let uri, where
	switch(type){
		case TAPESTRY_TYPE_ZIPCODE:
			uri = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_ZIP_Codes_2016/FeatureServer/0/query'
			where = 'ZIP_CODE IN (\'' + row.zipcode + '\')'
			break
		case TAPESTRY_TYPE_COUNTY:
			uri = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer/0/query'
			where = 'NAME in (\'' + row.county + '\') and STATE_NAME in (\'' + row.state + '\')'
			break
		case TAPESTRY_TYPE_STATE:
			uri = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_States_Generalized/FeatureServer/0/query'
			where = 'STATE_ABBR in (\'' + row.state_abbr + '\')'
			break
		default:
			break
	}
	let options = {
		uri: uri,
		qs: {
			where: where,
			spatialRel: 'esriSpatialRelIntersects',
			geometryType: 'esriGeometryEnvelope',
			outFields: type == TAPESTRY_TYPE_STATE ? 'STATE_ABBR, STATE_NAME' : '*',
			inSR: '102100',
			outSR: '102100',
			units: 'esriSRUnit_Meter',
			resultType: 'tile',
			returnGeometry: true,
			geometryPrecision: 1,
			f: 'pjson'
		},
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true // Automatically parses the JSON string in the response
	}
	rp(options)
		.then(function(geometry){
			return callback(null, geometry)
		})
		.catch(function(err){
			return callback(err)
		})	
}

function tapestry_getinfo(tapestry_info, row, callback){
	console.log('-tapestry_getinfo')
	if(!tapestry_info || !tapestry_info.features){
		console.log('--invalid_tapestry_info')
		return callback(null, null)
	}
	let feature = tapestry_info.features[0]
	if(!feature || !feature.geometry || !feature.geometry.rings[0]){
		console.log('--invalid')
		return callback(null, null)
	}
	feature.geometry.type = 'polygon'
	feature.geometry.spatialReference = tapestry_info.spatialReference	
	let options_geometry = {
		method: 'POST',
		uri: 'https://webappsproxy.esri.com/OAuth?https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/Enrich',
		form: {
			f: 'pjson',
			analysisVariables: '["TOTPOP_CY","POPDENS_CY","MEDAGE_CY","MEDHINC_FY","MP10013a_B","MP10057a_B","MP28134a_B","GRADDEG_CY","INDMANU_CY","MP33069a_B","TSEGNUM","TADULTBASE","EDUCBASECY","INDBASE_CY","tapestryhouseholdsNEW.THH01","tapestryhouseholdsNEW.THH02","tapestryhouseholdsNEW.THH03","tapestryhouseholdsNEW.THH04","tapestryhouseholdsNEW.THH05","tapestryhouseholdsNEW.THH06","tapestryhouseholdsNEW.THH07","tapestryhouseholdsNEW.THH08","tapestryhouseholdsNEW.THH09","tapestryhouseholdsNEW.THH10","tapestryhouseholdsNEW.THH11","tapestryhouseholdsNEW.THH12","tapestryhouseholdsNEW.THH13","tapestryhouseholdsNEW.THH14","tapestryhouseholdsNEW.THH15","tapestryhouseholdsNEW.THH16","tapestryhouseholdsNEW.THH17","tapestryhouseholdsNEW.THH18","tapestryhouseholdsNEW.THH19","tapestryhouseholdsNEW.THH20","tapestryhouseholdsNEW.THH21","tapestryhouseholdsNEW.THH22","tapestryhouseholdsNEW.THH23","tapestryhouseholdsNEW.THH24","tapestryhouseholdsNEW.THH25","tapestryhouseholdsNEW.THH26","tapestryhouseholdsNEW.THH27","tapestryhouseholdsNEW.THH28","tapestryhouseholdsNEW.THH29","tapestryhouseholdsNEW.THH30","tapestryhouseholdsNEW.THH31","tapestryhouseholdsNEW.THH32","tapestryhouseholdsNEW.THH33","tapestryhouseholdsNEW.THH34","tapestryhouseholdsNEW.THH35","tapestryhouseholdsNEW.THH36","tapestryhouseholdsNEW.THH37","tapestryhouseholdsNEW.THH38","tapestryhouseholdsNEW.THH39","tapestryhouseholdsNEW.THH40","tapestryhouseholdsNEW.THH41","tapestryhouseholdsNEW.THH42","tapestryhouseholdsNEW.THH43","tapestryhouseholdsNEW.THH44","tapestryhouseholdsNEW.THH45","tapestryhouseholdsNEW.THH46","tapestryhouseholdsNEW.THH47","tapestryhouseholdsNEW.THH48","tapestryhouseholdsNEW.THH49","tapestryhouseholdsNEW.THH50","tapestryhouseholdsNEW.THH51","tapestryhouseholdsNEW.THH52","tapestryhouseholdsNEW.THH53","tapestryhouseholdsNEW.THH54","tapestryhouseholdsNEW.THH55","tapestryhouseholdsNEW.THH56","tapestryhouseholdsNEW.THH57","tapestryhouseholdsNEW.THH58","tapestryhouseholdsNEW.THH59","tapestryhouseholdsNEW.THH60","tapestryhouseholdsNEW.THH61","tapestryhouseholdsNEW.THH62","tapestryhouseholdsNEW.THH63","tapestryhouseholdsNEW.THH64","tapestryhouseholdsNEW.THH65","tapestryhouseholdsNEW.THH66","tapestryhouseholdsNEW.THH67","tapestryhouseholdsNEW.THH68"]',
			studyareas: '[' + JSON.stringify(feature) +']'
		},
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		json: true // Automatically stringifies the body to JSON
	}
	rp(options_geometry)
		.then(function(tapestry_info){
			return callback(null, tapestry_info)
		})
		.catch(function(err){
			return callback(err)
		})
}

function tapestry_db_update(tapestry_info, row, version, type, username, password, callback){
	console.log('-tapestry_db_update')
	let data = {}
	if(tapestry_info && tapestry_info.results){
		let featureSet = tapestry_info.results[0].value.FeatureSet[0]
		let resultSet = featureSet.features[0].attributes
		if(type == TAPESTRY_TYPE_STATE && (
			row.state_abbr == 'TX' ||
			row.state_abbr == 'NM' ||
			row.state_abbr == 'CA' ||
			row.state_abbr == 'AZ')){
			resultSet = featureSet.features[1].attributes
		}		
		let sumup = 0
		let segments = []
		if(type == TAPESTRY_TYPE_ZIPCODE){
			for(let j = 1; j<=68; j++){
				let key = 'THH' + ((j<10) ? '0' : '') + j
				let value = resultSet[key]
				segments.push({
					key: key,
					id: j,
					value: value
				})
				sumup += parseInt(value)
			}
			segments = _.orderBy(segments, (s)=>{return parseInt(s.value)}, 'desc')
		}		
		data = {
			'IsValid': TAPESTRY_ISVALID,
			'Version': version,			
			'Median Income': resultSet.MEDHINC_FY,
			'Median Age': resultSet.MEDAGE_CY,
			'Population Density': resultSet.POPDENS_CY,
			'Monthly Credit Card Charges': resultSet.MP10057a_B / resultSet.TADULTBASE,
			'Online Banking Users': resultSet.MP10013a_B / resultSet.TADULTBASE,
			'Financial Optimists': resultSet.MP28134a_B / resultSet.TADULTBASE,
			'Graduate and Professional Degrees': resultSet.GRADDEG_CY / resultSet.EDUCBASECY,
			'Manufacturing Workforce': resultSet.INDMANU_CY / resultSet.INDBASE_CY,
			'College Football Viewers': resultSet.MP33069a_B / resultSet.TADULTBASE,
		}
		if(type == TAPESTRY_TYPE_ZIPCODE){
			data['1st Tapestry Segment'] = segments[0].id
			data['2nd Tapestry Segment'] = segments[1].id
			data['3rd Tapestry Segment'] = segments[2].id
			data['1st Tapestry Segment %'] = segments[0].value / sumup
			data['2nd Tapestry Segment %'] = segments[1].value / sumup
			data['3rd Tapestry Segment %'] = segments[2].value / sumup
		}
	}else{
		console.log('--invalid_featureset')
		data = {
			'IsValid': TAPESTRY_ISINVALID,
			'Version': version,
		}
	}

	let view_id
	switch(type){
		case TAPESTRY_TYPE_ZIPCODE:
			view_id = VIEW_ZIPCODE
			break
		case TAPESTRY_TYPE_COUNTY:
			view_id = VIEW_COUNTY
			break
		case TAPESTRY_TYPE_STATE:
			view_id = VIEW_STATE
			break
		default:
			view_id = VIEW_STATE
			break
	}
	
	tvApi.login(username, password).then(()=>{
		tvApi.updateRecord(view_id, row.id, data).then((ret)=>{
			return callback(null)
		}).catch((err)=>{			
			return callback(err)
		})
	}).catch((err)=>{		
		return callback(err)
	})
}

function update_tapestry(type, version, rows, username, password){	
	let pos = 0
	async.whilst(
		function test() {
			return pos < rows.length
		},
		function(next){
			let row = rows[pos]
			console.log('Processing:' + pos + ', ' + JSON.stringify(row))
			async.waterfall([
				function(callback1){
					tapestry_geometry(type, row, callback1)
				},
				function(geometry, callback1){
					tapestry_getinfo(geometry, row, callback1)
				},
				function(tapestry_info, callback1){
					tapestry_db_update(tapestry_info, row, version, type, username, password, callback1)
				}
			], function(err, result){
				// console.log('Processing zipcode error = ', err)
				pos++
				next()
			})
		},
		function (err) {
			console.log('done!!!')
		}
	)
}

function update_zipcodes1(version, zipcodes, username, password){	
	let pos = 0
	async.whilst(
		function test() {
			return pos < zipcodes.length
		},
		function(next){
			let zipcode = zipcodes[pos]
			console.log('Processing:' + pos + ' {id: ' + zipcode.id + ', zipcodes: ' + zipcode.zipcodes + '}')
			async.waterfall([
				function(callback1){
					tvApi.updateRecord(VIEW_ZIPCODE, zipcode.id, {
						IsValid: TAPESTRY_ISVALID,
						Version: version,
					}).then((ret)=>{
						callback1(null)
					}).catch((err)=>{			
						callback1(err)
					})
				}
			], function(err, result){
				// console.log('Processing zipcode error = ', err)
				pos++
				next()
			})
		},
		function (err) {
			console.log('done!!!')
		}
	)
}

router.route('/api/update_tapestry')
	.get(function(req, res){
		let username = req.query.username
		let password = req.query.password
		let type = req.query.type ? parseInt(req.query.type) : TAPESTRY_TYPE_STATE
		let version = req.query.version ? req.query.version : TAPESTRY_VERSION_LATEST
		let max = req.query.max ? req.query.max : 10

		let view_id
		switch(type){
			case TAPESTRY_TYPE_ZIPCODE:
				view_id = VIEW_ZIPCODE
				break
			case TAPESTRY_TYPE_COUNTY:
				view_id = VIEW_COUNTY
				break
			case TAPESTRY_TYPE_STATE:
				view_id = VIEW_STATE
				break
			default:
				view_id = VIEW_STATE
				break
		}
		
		tvApi.login(username, password).then(()=>{
			tvApi.getView(view_id, {start: PAGING_START, max: max}).then((ret)=>{
				let rows = []
				_.map(ret.data, (record, index)=>{
					if(parseInt(record['Version']) != parseInt(version)){
						switch(type){
							case TAPESTRY_TYPE_ZIPCODE:
								rows.push({
									id: record.id,
									zipcode: record['Zip Code'],
								})
								break
							case TAPESTRY_TYPE_COUNTY:
								rows.push({
									id: record.id,
									county: record['County'],
									state: record['State'],
								})
								break
							case TAPESTRY_TYPE_STATE:
								rows.push({
									id: record.id,
									state: record['State'],
									state_abbr: record['State Abbreviation']
								})
								break
							default:
								break
						}						
					}
				})
				
				create_log()
				console.log('update_tapestry type: ' + type + ', version: ' + version + ', max: ' + max + ', found: ' + rows.length)
				
				update_tapestry(type, version, rows, username, password)
				res.status(RETURN_SUCCESS).json({
					success: true,
					message: 'View fetched',
					max: max,
					total: ret.data.length,
					found: rows.length
				})
			}).catch((ret)=>{
				res.status(RETURN_API_ERROR).json({
					success: false,
					message: 'Error',
					views: ret,
				})
			})
		}).catch((ret)=>{
			res.status(RETURN_LOGIN_FAILED).json({
				success: false,
				message: 'Login failed'
			})
		})
	})

router.route('/api/authenticate')
	.get(function(req, res) {
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				return res.status(RETURN_SUCCESS).json({
					data: null
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				return res.status(RETURN_SUCCESS).json({
					data: {
						token:token
					}
				})
			}
		})
	})
	.post(function(req, res, next) {
		let username = _.get(req.body, 'data.username')
		let password = _.get(req.body, 'data.password')
		let user = {
			username: username,
			password: password
		}
		tvApi.login(username, password).then((ret)=>{
			var token = jwt.sign(user, API_KEY)
			res.cookie('token', token, {httpOnly: true, expires: new Date(Date.now() + COOKIE_TIME)})
			res.status(RETURN_SUCCESS).json({
				data:{
					token: token,
					username: username,
				}				
			})
		}).catch((ret)=>{
			res.clearCookie('token')
			res.status(RETURN_ACCESS_DENIED).json({
				errors: [
					{
						code: 'access_denied',
						status: RETURN_ACCESS_DENIED,
						title: 'Access Denied!',
						details: 'Invalid username or password'
					}
				]
			})
		})
	})
	.delete(function(req, res){
		res.clearCookie('token')
		return res.status(RETURN_DELETED).send()
	})

router.route('/api/locations')
	.get(function(req, res){
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getView(VIEW_LOCATION, {start: PAGING_START, max: PAGING_MAX}).then((ret)=>{
						// download images
						// create_log()
						// console.log('[Location] - (imageID, viewID, recordID, fieldName)')
						_.map(ret.data, (record, index)=>{
							download_image(tvApi, record['Site Map'], VIEW_LOCATION, record['id'], 'Site Map')
							download_image(tvApi, record['Satellite Map'], VIEW_LOCATION, record['id'], 'Satellite Map')
						})
						// return result
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.data,
							length: ret.data.length
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})
	})

router.route('/api/signs')
	.get(function(req, res){
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getView(VIEW_SIGN, {start: PAGING_START, max: PAGING_MAX}).then((ret)=>{
						// download images
						// create_log()
						// console.log('[Signs] - (imageID, viewID, recordID, fieldName)')
						_.map(ret.data, (record, index)=>{
							download_image(tvApi, record['Latest Brand Compliance Photo'], VIEW_SIGN, record['id'], 'Latest Brand Compliance Photo')
							download_image(tvApi, record['Design Intent Image'], VIEW_SIGN, record['id'], 'Design Intent Image')
							download_image(tvApi, record['Sign Plan Image'], VIEW_SIGN, record['id'], 'Sign Plan Image')
							download_image(tvApi, record['Sign Plan Image Option 2'], VIEW_SIGN, record['id'], 'Sign Plan Image Option 2')
						})
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.data,
							length: ret.data.length
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})
	})

router.route('/api/brands')
	.get(function(req, res){
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getView(VIEW_BRAND, {start: PAGING_START, max: PAGING_MAX}).then((ret)=>{
						// download images
						// create_log()
						// console.log('[Brand Compliance] - (imageID, viewID, recordID, fieldName)')
						_.map(ret.data, (record, index)=>{
							download_image(tvApi, record['Brand Compliance Photo'], VIEW_BRAND, record['id'], 'Brand Compliance Photo')					
						})
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.data,
							length: ret.data.length
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})		
	})

router.route('/api/promos')
	.get(function(req, res){
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getView(VIEW_PROMO, {start: PAGING_START, max: PAGING_MAX}).then((ret)=>{
						// download images
						// create_log()
						// console.log('[Promo] - (imageID, viewID, recordID, fieldName)')
						_.map(ret.data, (record, index)=>{
							download_image(tvApi, record['Image'], VIEW_PROMO, record['id'], 'Image')					
							download_image(tvApi, record['Installed Image'], VIEW_PROMO, record['id'], 'Installed Image')					
							download_image(tvApi, record['Removal Image'], VIEW_PROMO, record['id'], 'Removal Image')					
						})
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.data,
							length: ret.data.length
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})	
	})

router.route('/api/promoitems')
	.get(function(req, res){
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getView(VIEW_PROMOITEM, {start: PAGING_START, max: PAGING_MAX}).then((ret)=>{
						// download images
						// create_log()
						// console.log('[PromoItem] - (imageID, viewID, recordID, fieldName)')
						_.map(ret.data, (record, index)=>{
							download_image(tvApi, record['Image'], VIEW_PROMOITEM, record['id'], 'Image')
						})
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.data,
							length: ret.data.length
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})		
	})

router.route('/api/vehicles')
	.get(function(req, res){
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getView(VIEW_VEHICLE, {start: PAGING_START, max: PAGING_MAX}).then((ret)=>{
						// download images
						// create_log()
						// console.log('[Vehicle] - (imageID, viewID, recordID, fieldName)')
						_.map(ret.data, (record, index)=>{
							download_image(tvApi, record['Front Photo'], VIEW_VEHICLE, record['id'], 'Front Photo')
							download_image(tvApi, record['Left Photo'], VIEW_VEHICLE, record['id'], 'Left Photo')
							download_image(tvApi, record['Right Photo'], VIEW_VEHICLE, record['id'], 'Right Photo')
							download_image(tvApi, record['Rear Photo'], VIEW_VEHICLE, record['id'], 'Rear Photo')
							download_image(tvApi, record['Optional Photo'], VIEW_VEHICLE, record['id'], 'Optional Photo')
						})
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.data,
							length: ret.data.length
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})
	})

router.route('/api/file')
	.get(function(req, res){
		let viewID = parseInt(req.query.viewID)
		let recordID = parseInt(req.query.recordID)
		let fieldName = req.query.fieldName
		var token = req.query.token
		jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				res.status(RETURN_LOGIN_FAILED).json({
					success: false,
					message: 'Login failed'
				})
			} else{
				let username = decoded.username
				let password = decoded.password
				tvApi.login(username, password).then(()=>{
					tvApi.getFile(viewID, recordID, fieldName).then((ret)=>{
						res.status(RETURN_SUCCESS).json({
							success: true,
							message: 'View fetched',
							data: ret.body
						})
					}).catch((ret)=>{
						res.status(RETURN_API_ERROR).json({
							success: false,
							message: 'Error',
							views: ret,
						})
					})
				}).catch((ret)=>{
					res.status(RETURN_LOGIN_FAILED).json({
						success: false,
						message: 'Login failed'
					})
				})
			}
		})
	})
