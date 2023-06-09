import axios from "axios"

let baseUrl
if(process.env.REACT_APP_ENV === "development") baseUrl = "http://localhost:3001/api/users"
if(process.env.REACT_APP_ENV === "production") baseUrl = "/api/users"

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  return response.data
}
const register = async (credentials) => {
  const response = await axios.post(`${baseUrl}/register`, credentials)
  return response.data
}
const getUserData = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const exports = { login, register, getUserData }

export default exports
