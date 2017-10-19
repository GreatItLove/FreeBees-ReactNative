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
	ImageBackground
} 
	from 'react-native';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import {CustomStatusBar} from '../components/StatusBar';

const {height, width} = Dimensions.get('window');
const globalValue = require('../global');

const approve = require('../assets/approve.png')
const reject = require('../assets/reject.png')

class PreviewImage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}
	componentDidMount() {
		
	}

	onReject() {
		Actions.pop();
	}

	onApprove() {
		Actions.post();
	}

	render() {
		return (
			<View style={styles.container}>
				<CustomStatusBar 
					backgroundColor="#DE5500" 
					barStyle="light-content" 
				/>
				<ImageBackground source={{ uri: globalValue.mediaUri}} style={styles.preview}>
					<View style={styles.bottomView}>
						<View style={styles.actionView}>
							<TouchableOpacity 
								style={styles.startBtn}
								onPress = {() => this.onReject()}
							>
	            				<Image source={reject}/>
	            			</TouchableOpacity>
						</View>
						<View style={styles.actionView}>
							<TouchableOpacity 
								style={styles.startBtn}
								onPress = {() => this.onApprove()}
							>
	            				<Image source={approve}/>
	            			</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</View>
		);
	}    
		
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	preview: {
		width: width,
		height: height,
		justifyContent: 'flex-end',
	    alignItems: 'center'
	},
	bottomView: {
		width: width,
		height: 200,
		backgroundColor: 'transparent',
		flexDirection: 'row'
	},
	actionView: {
		width: width/2,
		height: 200,
		justifyContent: 'center',
	    alignItems: 'center'
	}
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}


export default connect(() => {return {}}, mapDispatchToProps)(PreviewImage);
