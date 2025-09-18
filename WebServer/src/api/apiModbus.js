import axios from "./axios";


export const addConfigParamsModbus = async ( params, token) => {
    try {
        console.log("Adding Modbus config params:", params); // Debug
        const response = await axios.post(`/add/device/modbus`, params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding Modbus config params:", error);
        throw error;
    }
};