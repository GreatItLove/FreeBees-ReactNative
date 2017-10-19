
import React, {Component} from 'react'
import {Router, Scene} from 'react-native-router-flux'
import {Provider, connect} from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as firebase from "firebase";

import reducer from './reducers'
import Login from './containers/Login'
import CameraView from './containers/CameraView'
import PreviewImage from './containers/PreviewImage'
import PostItem from './containers/PostItem'

firebase.initializeApp({
    apiKey: "AIzaSyCa20g57HoRHhnM-N_mCPbo3zS7oe2zLZk",
	authDomain: "freebees-beta.firebaseapp.com",
	databaseURL: "https://freebees-beta.firebaseio.com",
	projectId: "freebees-beta",
	storageBucket: "freebees-beta.appspot.com",
	messagingSenderId: "363849771617"
});

const RouterWithRedux = connect()(Router)
function configureStore(initialState) {
	const enhancer = compose(
		applyMiddleware(
			thunkMiddleware
		),
	);
	return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

class App extends Component {
	render () {
		return (
			<Provider store={store}>
				<RouterWithRedux>
					<Scene key="root">
						<Scene key='login' component={Login} title='Login Page'  hideNavBar={true}/>
						<Scene key='camera' component={CameraView} title='Camera Page'  hideNavBar={true}/>
						<Scene key='preview' component={PreviewImage} title='Preview Page'  hideNavBar={true}/>
						<Scene key='post' component={PostItem} title='Post Page'  hideNavBar={true}/>
					</Scene>
				</RouterWithRedux>
			</Provider>
		)
	}
}

export default App;