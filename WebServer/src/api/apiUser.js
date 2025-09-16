import axios from "./axios";


const url_api = process.env.PUBLIC_URL_API || "";


export const apiLoginUser = async ({ usuario, password }) => axios.post(`${url_api}/login`, { usuario, password });
