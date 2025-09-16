export const AppReducer = (state, action) => {
	switch (action.type) {
        case 'LOGIN_START':
            return { ...state, isLoading: true, error: null };
		case 'LOGIN_SUCCESS':
			return { ...state, user: action.payload.user , isLoading: false, error: null , token: action.payload.token };
		case 'LOGIN_END':
			return { ...state, isLoading: false};
		case 'LOGOUT':
			return { ...state, user: null, isLoading: false, error: null, token: null };
		case 'LOGIN_ERROR':
			return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'HYDRATE_SESSION':
            return { ...state, user: action.payload.user, token: action.payload.token, error: null };
		default:
			return state;
	}
}
