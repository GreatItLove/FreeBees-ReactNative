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
	Dimensions
} 
	from 'react-native';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions'
import * as firebase from "firebase";
import {CustomStatusBar} from '../components/StatusBar';

const {height, width} = Dimensions.get('window');

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}
	componentDidMount() {

	}

	goCamera() {
		Actions.camera();
	}

	render() {
		return (
			<View style={styles.container}>
				<CustomStatusBar 
					backgroundColor="#DE5500" 
					barStyle="light-content" 
				/>
				<View style={styles.titleView}>
					<Text style={styles.titieText}>
						FreeBees
					</Text>
				</View>
				<View style={styles.titleView}>
					<TouchableOpacity 
						style={styles.startBtn}
						onPress = {() => this.goCamera()}
					>
						<Text style={styles.btnText}>
							START
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.bottomView}>
					<Text style={styles.bottomText}>
						user beta v 0.1ua
					</Text>
				</View>
			</View>
		);
	}    
		
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#DE5500',
		alignItems: 'center'
	},
	titleView: {
		width: width,
		height: height/3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titieText: {
		fontSize: 50,
		color: 'white'
	},
	startBtn: {
		width: width/2,
		height: 50,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	btnText: {
		fontSize: 20,
		color: '#DE5500'	
	},
	bottomView: {
		width: width,
		height: height/3,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	bottomText: {
		fontSize: 17,
		color: 'white',
		paddingBottom: 30
	}
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}


export default connect(() => {return {}}, mapDispatchToProps)(Login);
