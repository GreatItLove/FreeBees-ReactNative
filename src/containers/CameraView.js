import React, { Component } from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	StatusBar,
	StyleSheet,
	Dimensions,
} 
	from 'react-native';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import Camera from 'react-native-camera';

import {CustomStatusBar} from '../components/StatusBar';
const {height, width} = Dimensions.get('window');
const globalValue = require('../global');

const menu = require('../assets/menu.png')
const alarm = require('../assets/alarm.png')
const hdr = require('../assets/hdr.png')
const temper = require('../assets/temper.png')
const flash = require('../assets/flash.png')
const camera = require('../assets/camera.png')
const rotate = require('../assets/rotate.png')
const lock = require('../assets/lock.png')

const options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

class CameraView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cameraType: Camera.constants.Type.back,
		}
	}
	componentDidMount() {

	}

	onIconClicked() {

	}

	success(pos) {
		var crd = pos.coords;
		globalValue.lng = crd.longitude
		globalValue.lat = crd.latitude
	};

	error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	onTakePicture() {
		const options = {};
		navigator.geolocation.getCurrentPosition(this.success, this.error, options);
		this.camera.capture({metadata: options})
			.then((data) => {
				globalValue.mediaUri = data.path
				Actions.preview();
			})
			.catch((err) => {
				console.log(err)
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<CustomStatusBar 
					backgroundColor="#DE5500" 
					barStyle="light-content" 
				/>
				<Camera
                    style={styles.preview}
                    ref={(cam) => {
						this.camera = cam;
					}}
					captureTarget={Camera.constants.CaptureTarget.temp}
					captureQuality={Camera.constants.CaptureQuality.low}
                >
                	<View style={styles.controlBtnView}>
                		<View style={styles.leftView}> 
	                		<View style={styles.menuView}>
	                			<TouchableOpacity 
									style={styles.startBtn}
									onPress = {() => this.onIconClicked()}
								>
	                				<Image source={menu}/>
	                			</TouchableOpacity>
	                		</View>
	                	</View>	
	                	<View style={styles.rightView}>
	                		<View style={styles.menuView}>
	                			<TouchableOpacity 
									style={styles.startBtn}
									onPress = {() => this.onIconClicked()}
								>
	                				<Image source={alarm}/>
	                			</TouchableOpacity>
	                		</View>
	                		<View style={styles.menuView}>
	                			<TouchableOpacity 
									style={styles.startBtn}
									onPress = {() => this.onIconClicked()}
								>
	                				<Image source={hdr}/>
	                			</TouchableOpacity>
	                		</View>
	                		<View style={styles.menuView}>
	                			<TouchableOpacity 
									style={styles.startBtn}
									onPress = {() => this.onIconClicked()}
								>
	                				<Image source={temper}/>
	                			</TouchableOpacity>
	                		</View>
	                		<View style={styles.menuView}>
	                			<TouchableOpacity 
									style={styles.startBtn}
									onPress = {() => this.onIconClicked()}
								>
	                				<Image source={flash}/>
	                			</TouchableOpacity>
	                		</View>
	                	</View>
                	</View>
                </Camera>
                <View style={styles.bottomView}>
                	<View style={styles.rotateView}>
                		<TouchableOpacity 
							style={styles.startBtn}
							onPress = {() => this.onIconClicked()}
						>
            				<Image source={rotate}/>
            			</TouchableOpacity>
                	</View>
                	<View style={styles.cameraBtn}>
                		<TouchableOpacity 
							style={styles.startBtn}
							onPress = {() => this.onTakePicture()}
						>
            				<Image source={camera}/>
            			</TouchableOpacity>
                	</View>
                	<View style={styles.lockView}>
                		<TouchableOpacity 
							style={styles.startBtn}
							onPress = {() => this.onIconClicked()}
						>
            				<Image source={lock}/>
            			</TouchableOpacity>
                	</View>
                </View>
			</View>
		);
	}    
		
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},
	preview: {
        width: width,
        height: height-200
    },
	controlBtnView: {
		width: width,
		height: 50,
		backgroundColor: 'transparent',
		flexDirection: 'row'
	},
	menuView: {
		width: 60,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent'
	},
	leftView: {
		width: width/4
	},
	rightView: {
		width: width/4*3,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	bottomView: {
		width: width,
		height: 200,
		flexDirection: 'row'
	},
	rotateView: {
		width: width/4,
		height: 200,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cameraBtn: {
		width: width/2,
		height: 200,
		justifyContent: 'center',
		alignItems: 'center'
	},
	lockView: {
		width: width/4,
		height: 200,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}


export default connect(() => {return {}}, mapDispatchToProps)(CameraView);
