export const CollapsedReducer = (prevState = {
    isCollapsed: false
}, action) => {
    switch (action.type) {
        case "change_collapsed":
            let newState = { ...prevState }
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return prevState
    }
}