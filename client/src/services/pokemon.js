import axios from "axios"

const baseUrl = "http://localhost:3001/api/pokemon"

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
const exports = { generatePokemon, getAll, savePokemon }
export default exports
