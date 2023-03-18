import axios from "axios"

const baseUrl = "/api/users"

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  return response.data
}
const register = async (credentials) => {
  const response = await axios.post(`${baseUrl}/register`, credentials)
  return response.data
}

const exports = { login, register }

export default exports
