import React from "react";

const ButtonSubmit = ({ textName, isLoading, ...props }) => (
	<button
		type="submit"
		className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
		disabled={isLoading || props.disabled}
		{...props}
	>
		{isLoading ? "Cargando..." : textName}
	</button>
);

export default ButtonSubmit;
