import React from 'react'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
export default function App() {
  return (
    <Provider store={store} persistor={persistor}>
      <IndexRouter />
    </Provider>
  )
}
