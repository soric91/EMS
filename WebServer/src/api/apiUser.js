import axios from "./axios";

export const apiLoginUser = async (credentials) => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await axios.post("/login", params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};
