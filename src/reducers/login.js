import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const Email = createReducer('', {
  [types.INPUTED_EMAIL](state, action) {
    return action.email
  },
  [types.SAVED_EMAIL](state, action) {
    return action.email
  },
  
});