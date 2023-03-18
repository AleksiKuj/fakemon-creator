import axios from "axios"

//"http://localhost:3001/api/pokemon"
const baseUrl = "http://localhost:3001/api/pokemon"

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const generatePokemon = async (data) => {
  const response = await axios.post(baseUrl, data)
  return response.data
}
const savePokemon = async (data) => {
  const response = await axios.post(`${baseUrl}/new`, data)
  return response.data
}
const getAll = async (page) => {
  const response = await axios.get(`${baseUrl}?page=${page}`)
  return response.data
}
const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const exports = { generatePokemon, getAll, savePokemon, getOne, setToken }

export default exports
