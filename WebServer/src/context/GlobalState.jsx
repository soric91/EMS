import { createContext, useContext, useState, useReducer } from "react";
import  {AppReducer}  from "./AppReducer";
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
	const [state,  dispatch] = useReducer(AppReducer, initialState)

	const loginUser = async ({ usuario, password }) => {

	dispatch({ type: "LOGIN_START" });
	try {
		const res = await apiLoginUser({ usuario, password });
		const data = await res.data;
		if (res.status === 200 && data.success) {

			if (data.token) localStorage.setItem("token", data.token);

			dispatch({ type: "LOGIN_SUCCESS", payload: { user: data.user, token: data.token } });
			return { success: true, user: data.user };

		} else {
			dispatch({ type: "LOGIN_ERROR", payload: data.message });
			return { success: false, error: data.message || "Credenciales incorrectas" };
		}
	} catch (error) {
		console.error("Error en loginUser:", error);
		dispatch({ type: "LOGIN_ERROR", payload: "Error en el login" });
	} finally {
		setIsLoading(false);
	}
};

const logOutUser = () => {
	localStorage.removeItem("token");

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