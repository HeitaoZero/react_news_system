export const LoadingReducer = (prevState = {
    isLoading: false
}, action) => {
    const { type, payload } = action
    switch (type) {
        case "change_loading":
            let newstate = { ...prevState }
            newstate.isLoading = payload
            return newstate
        default:
            return prevState
    }
}