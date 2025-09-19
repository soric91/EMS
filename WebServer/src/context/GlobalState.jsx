import { createContext, useContext, useReducer } from "react";
import { AppReducer } from "./AppReducer";
import { apiLoginUser } from "../api/apiUser";




const initialState = {
	user: null,
	error: null,
	token: localStorage.getItem("token") || null,
	isLoading: false,
};



export const Context = createContext();


export const useGlobalState = () => {
	const context = useContext(Context);
	if (!context) {
		throw new Error("useGlobalState debe usarse dentro de un GlobalProvider");
	}
	return context;
}


export const GlobalProvider = ({ children }) => {
	// Función para inicializar el estado desde localStorage
	const initializeState = () => {
		try {
			const localToken = localStorage.getItem("token");
			const localUser = localStorage.getItem("user");

			return {
				...initialState,
				token: localToken || null,
				user: localUser ? JSON.parse(localUser) : null
			};
		} catch (error) {
			// Si hay error al parsear, limpiar localStorage y usar estado inicial
			console.error("Error al cargar datos del localStorage:", error);
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			return initialState;
		}
	};

	const [state, dispatch] = useReducer(AppReducer, null, initializeState);


	const loginUser = async ({ username, password }) => {

		dispatch({ type: "LOGIN_START" });
		try {

			const res = await apiLoginUser({ username: username, password: password });
			const data = await res.data;

			if (res.status === 200 && data.access_token) {
				// Guardar tanto el token como el usuario en localStorage
				localStorage.setItem("token", data.access_token);
				if (data.user) {
					localStorage.setItem("user", JSON.stringify(data.user));
				}
				dispatch({ type: "LOGIN_SUCCESS", payload: { user: data.user, token: data.access_token } });
				return { success: true, user: data.user };
			} else {
				dispatch({ type: "LOGIN_ERROR", payload: data.detail || "Credenciales incorrectas" });
				return { success: false, error: data.detail || "Credenciales incorrectas" };
			}
		} catch (error) {
			const errorMessage = error.response?.data?.detail || "Error en el login";
			dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
			return { success: false, error: errorMessage };
		} finally {
			dispatch({ type: "LOGIN_END" });
		}
	};

	const logOutUser = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		dispatch({ type: "LOGOUT" });
	}

	const isAuthenticated = !!(state.user && state.token);

	return (
		<Context.Provider value={{ user: state.user, loginUser, logOutUser, error: state.error, isLoading: state.isLoading, isAuthenticated }}>
			{children}
		</Context.Provider>
	);
}

// Función para login usando la API