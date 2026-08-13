import { createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
    key: 'Dexter',
    storage,
    blacklist: ['LoadingReducer'] // 黑名单，不进行持久化
}

const reducer = combineReducers({
    CollapsedReducer: CollapsedReducer,
    LoadingReducer: LoadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)


export {
    store,
    persistor
} 