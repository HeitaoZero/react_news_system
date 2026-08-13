import axios from "axios"
import { store } from '../redux/store'

axios.interceptors.request.use(config => {
    store.dispatch({ type: "change_loading", payload: true })
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(config => {
    store.dispatch({ type: "change_loading", payload: false })
    return config
}, error => {
    store.dispatch({ type: "change_loading", payload: false })
    return Promise.reject(error)
})