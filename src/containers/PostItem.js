import React, { Component } from 'react';
import {
	Alert,
	TextInput,
	View,
	Image,
	Text,
	TouchableOpacity,
	StatusBar,
	StyleSheet,
	Dimensions,
	Platform,
	Modal,
	ActivityIndicator
} 
	from 'react-native';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import {CustomStatusBar} from '../components/StatusBar';
import CheckBox from 'react-native-checkbox';
import Database from "../model/Database";
import * as firebase from "firebase";
import RNFetchBlob from 'react-native-fetch-blob'
import ModalDropdown from 'react-native-modal-dropdown';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const {height, width} = Dimensions.get('window');
const globalValue = require('../global');
const letarrow = require('../assets/letarrow.png')
const smallcamera = require('../assets/smallcamera.png')
const approve = require('../assets/approve.png')
const reject = require('../assets/reject.png')
const approve_disable = require('../assets/confirm_disable.png')
const reject_disable = require('../assets/reject_disable.png')

const uploadImage = (uri, mime = 'image/jpeg') => {
  const storage = firebase.storage()
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('images').child(`${sessionId}`)

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
		reject(error)
    })
  })
}

class PostItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			descritionText: '',
			titleText: '',
			checked: false,
			condition: 'New',
			modalVisible: false,
			uploadFinished: false
		}
	}
	componentDidMount() {

	}

	onBack() {
		Actions.pop()
	}

	_getOptionList() {
	    return this.refs['OPTIONLIST'];
	}

	_canada(index) {
		console.log("index", index)
		let province = "New"
		if (index === "0") {
			province = "New"
		}else if(index === "1") {
			province = "Used"
		}else if(index === "2"){
			province = "Well loved"
		}
		console.log(province)
		this.setState({
			condition: province
		});
	}

	onApprove() {
		let {descritionText, titleText, condition} = this.state
		if (descritionText === "" || titleText === "") {
			return
		}
		let {mediaUri} = globalValue
		this.setState({
    		modalVisible: true
    	})
		uploadImage(mediaUri)
        .then((url) => {
        	let {lat, lng} = globalValue
        	Database.uploadItem(url, descritionText, titleText, lat, lng, condition)
        	.then((response) => {
	        	let that = this;
	        	that.setState({
	        		uploadFinished: true
	        	})
  				setTimeout(function(){
  					that.setState({
  						modalVisible: false,
  						titleText: "",
  						descritionText: "",
  						checked: false,
						condition: 'New',
  					})
  					Actions.login()
  				}, 1000);
	        })
	        .catch((error) => {
	        	console.log("uploadItem error", error)
	        })
        })
        .catch((error) => {
        	console.log("uploadImage error", error)
        	alert(error.message_)
        })
}

	onReject() {
		Actions.login()
	}

	onCheckChange() {
		this.setState({
			checked: !this.state.checked
		})
	}

	render() {
		let {uploadFinished} = this.state
		return (
			<View style={styles.container}>
				<CustomStatusBar 
					backgroundColor="#DE5500" 
					barStyle="light-content" 
				/>
				<View style={styles.header}>
					<View style={styles.back}>
						<TouchableOpacity 
							style={styles.startBtn}
							onPress = {() => this.onBack()}
						>
            				<Image source={letarrow} style={styles.letarrow}/>
            			</TouchableOpacity>
					</View>
					<View style={styles.center}>
						<View>
            				<Image source={smallcamera}/>
            			</View>
					</View>
				</View>
				<View style={styles.detailHeader}>
					<Text style={styles.deetailText}>
						Item Details
					</Text>
				</View>
				<View style={styles.locationView}>
					<View style={styles.locationLeft}>
						<Text style={styles.locationText}>
							Use my device location
						</Text>
					</View>
					<View style={styles.locationRight}>
						<Text style={styles.locationValue}>
							Default
						</Text>
					</View>
				</View>
				<View style={styles.locationView}>
					<View style={styles.locationLeft}>
						<Text style={styles.locationValue}>
							Item condition
						</Text>
					</View>
				</View>
				<ModalDropdown 
					style={styles.modalContainer}
					dropdownStyle={styles.dropdownStyle}
					defaultValue="New"
					options={['New', 'Used', 'Well loved']}
					onSelect={this._canada.bind(this)}
				/>
				<View style={styles.descriptionHeader}>
					<View style={styles.locationLeft}>
						<Text style={styles.locationValue}>
							Titile
						</Text>
					</View>
				</View>
				<View style={styles.descriptionView}>
					<TextInput
						style={styles.tileText}
						onChangeText={(text) => this.setState({titleText: text})}
						value={this.state.titleText}
						returnKeyType='done'
						blurOnSubmit={true}
						underlineColorAndroid="transparent"
					/>
				</View>
				<View style={styles.descriptionHeader}>
					<View style={styles.locationLeft}>
						<Text style={styles.locationValue}>
							Description
						</Text>
					</View>
				</View>
				<View style={styles.descriptionView}>
					<TextInput
						multiline = {true}
					    numberOfLines = {4}
						style={styles.descritionText}
						onChangeText={(text) => this.setState({descritionText: text})}
						value={this.state.descritionText}
						returnKeyType='done'
						blurOnSubmit={true}
						underlineColorAndroid="transparent"
					/>
				</View>
				<View style={styles.commentView}>
					<Text style={styles.commentText}>
						Your item will be posted for one week from the post date. It will automatically be removed after this time and will need to be repost.
					</Text>
				</View>
				<View style={styles.termView}>
					<View style={styles.termCheck}>
						<CheckBox
							label=''
							checked={this.state.checked}
							onChange={(checked) => this.setState({checked: !checked})}
						/>
					</View>
					<View style={styles.termTextView}>
						<Text style={styles.termText}>
							I agree to the terms of use, and agree to be a good person and not use FreeBees for evil.
						</Text>
					</View>
				</View>
				<View style={styles.bottomView}>
					<View style={styles.actionView}>
						{this.state.checked ?
							<TouchableOpacity 
								style={styles.startBtn}
								onPress = {() => this.onReject()}
							>
	            				<Image source={reject}/>
	            			</TouchableOpacity>
	            			:
	            			<View
								style={styles.startBtn}
							>
	            				<Image source={reject_disable}/>
	            			</View>
						}
						
					</View>
					<View style={styles.actionView}>
						{this.state.checked ?
							<TouchableOpacity 
								style={styles.startBtn}
								onPress = {() => this.onApprove()}
							>
	            				<Image source={approve}/>
	            			</TouchableOpacity>
	            			:
	            			<View
								style={styles.startBtn}
							>
	            				<Image source={approve_disable}/>
	            			</View>
	            		}
					</View>
				</View>
				<Modal
					animationType="none"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {alert("Modal has been closed.")}}
				>
					<View style={styles.confirmModal}>
						<View style={styles.centerView}>
							{uploadFinished ?
								<Text style={styles.termText}>
									Thank you! Your item will list shortly.
								</Text>
								:
								<View>
									<ActivityIndicator
										animating={true}
										size="large"
									/>
									<Text style={styles.termText}>
										Uploading item...
									</Text>
								</View>
							}
						</View>
					</View>
				</Modal>
			</View>
		);
	}    
		
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	header: {
		width: width,
		height: 70,
		flexDirection: 'row',
		backgroundColor: 'black'
	},
	back: {
		width: 50,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center'
	},
	center: {
		width: width-100,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center'
	},
	letarrow: {
		width: 30,
		height: 20,
		resizeMode: 'contain'
	},
	detailHeader: {
		width: width,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	deetailText: {
		fontSize: 20,
		color: 'black'
	},
	locationView: {
		width: width-20,
		marginLeft: 10,
		height: 30,
		flexDirection: 'row'
	},
	selectView: {
		width: width-20,
		marginLeft: 10,
		height: 50,
	},
	locationLeft: {
		width: (width-20)/3*2,
		height: 30,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	locationRight: {
		width: (width-20)/3,
		height: 30,
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	locationText: {
		fontSize: 16,
		color: 'black',
		fontWeight: 'bold'
	},
	locationValue: {
		fontSize: 14,
		color: 'black'
	},
	customSelect: {
		marginLeft: 5,
		borderBottomWidth: 1,
		borderTopWidth: 0,
		borderLeftWidth: 0,
		borderRightWidth: 0
	},
	customSelectOverlay: {
		backgroundColor: 'transparent'
	},
	descriptionHeader: {
		width: width-20,
		marginLeft: 10
	},
	descriptionView: {
		width: width-20,
		marginLeft: 10
	},
	descritionText: {
		height: 60, 
		borderColor: 'gray', 
		borderWidth: 1,
		fontSize: 15,
		padding: 10
	},
	tileText: {
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 1,
		fontSize: 15,
		padding: 10
	},
	commentView: {
		width: width-20,
		marginLeft: 10,
		marginTop: 10
	},
	commentText: {
		fontSize: 14,
		color: 'gray'
	},
	termView: {
		width: width-20,
		marginLeft: 10,
		marginTop: 10,
		flexDirection: 'row'	
	},
	termCheck: {
		width: 50
	},
	termTextView: {
		width: width-70
	},
	termText: {
		fontSize: 16,
		color: 'black'
	},
	bottomView: {
		width: width-20,
		marginLeft: 10,
		marginTop: 10,
		height: 100,
		backgroundColor: 'transparent',
		flexDirection: 'row'
	},
	actionView: {
		width: (width-20)/2,
		height: 100,
		justifyContent: 'center',
	    alignItems: 'center'
	},
	confirmModal: {
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		height: height,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	centerView: {
		width: width-50,
		height: 100,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},
	overlay: {
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	modalContainer: {
		width: width-20, 
		height: 40,
		marginLeft: 10,
		borderBottomWidth: 1,
		borderTopWidth: 0,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		justifyContent: 'center'
	},
	dropdownStyle: {
		width: width-50,
		marginTop: 0
	}
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}


export default connect(() => {return {}}, mapDispatchToProps)(PostItem);
