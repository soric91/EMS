export const AppReducer = (state, action) => {
	switch (action.type) {
        case 'LOGIN_START':
            return { ...state, isLoading: true, error: null };
		case 'LOGIN_SUCCESS':
			return { ...state, user: action.payload , isLoading: false, error: null , token: action.payload.token };
		case 'LOGOUT':
			return { ...state, user: null, isLoading: false, error: null, token: null };
		case 'LOGIN_ERROR':
			return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
		default:
			return state;
	}
}
