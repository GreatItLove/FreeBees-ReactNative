import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducers';

// Redux and sagas setup and store configuration
export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [client.middleware(), sagaMiddleware];
    const enhancer = applyMiddleware(...middlewares);
    const store = createStore(reducer, initialState, enhancer);
    sagaMiddleware.run(sagas);
    if (module.hot) {
        module.hot.accept(() => {
            store.replaceReducer(require('../reducers').default);
        });
    }
    return store;
}
