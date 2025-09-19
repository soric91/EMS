export const AppReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_START':
			return { ...state, isLoading: true, error: null };
		case 'LOGIN_SUCCESS':
			return { ...state, user: action.payload.user, isLoading: false, error: null, token: action.payload.token };
		case 'LOGIN_END':
			return { ...state, isLoading: false };
		case 'LOGOUT':
			return { ...state, user: null, isLoading: false, error: null, token: null };
		case 'LOGIN_ERROR':
			return { ...state, error: action.payload, isLoading: false };
		case 'CLEAR_ERROR':
			return { ...state, error: null };
		case 'HYDRATE_SESSION':
			return { ...state, user: action.payload.user, token: action.payload.token, error: null };


		case "SET_LOADING":
			return { ...state, loading: action.payload };

		case "SET_ERROR":
			return { ...state, error: action.payload, loading: false };

		case "CLEAR_ERROR":
			return { ...state, error: null };

		case "SET_DEVICES":
			return { ...state, devices: action.payload, loading: false };

		case "SET_REGISTERS":
			return { ...state, registers: action.payload, loading: false };

		case "ADD_DEVICE":
			return {
				...state,
				devices: [...state.devices, action.payload],
				loading: false
			};

		case "UPDATE_DEVICE":
			return {
				...state,
				devices: state.devices.map(device =>
					device.id === action.payload.id ? action.payload : device
				),
				selectedDevice: state.selectedDevice?.id === action.payload.id
					? action.payload
					: state.selectedDevice,
				loading: false
			};

		case "DELETE_DEVICE":
			return {
				...state,
				devices: state.devices.filter(device => device.id !== action.payload),
				selectedDevice: state.selectedDevice?.id === action.payload
					? null
					: state.selectedDevice,
				loading: false
			};

		case "ADD_REGISTER":
			return {
				...state,
				registers: [...state.registers, action.payload],
				loading: false
			};

		case "UPDATE_REGISTER":
			return {
				...state,
				registers: state.registers.map(register =>
					register.id === action.payload.id ? action.payload : register
				),
				loading: false
			};

		case "DELETE_REGISTER":
			return {
				...state,
				registers: state.registers.filter(register => register.id !== action.payload),
				loading: false
			};

		case "SET_SELECTED_DEVICE":
			return { ...state, selectedDevice: action.payload };

		default:
			return state;

	}
}



// Reducer
