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
const savePokemon = async (data, user) => {
  if (user) {
    const config = {
      headers: { Authorization: token },
    }
    const response = await axios.post(`${baseUrl}/new`, data, config)
    return response.data
  } else {
    const response = await axios.post(`${baseUrl}/new`, data)
    return response.data
  }
}
const like = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}/like`, "", config)
  return response.data
}
const getAll = async (page, sortBy) => {
  const response = await axios.get(`${baseUrl}?page=${page}&sortBy=${sortBy}`)
  return response.data
}
const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const exports = { generatePokemon, getAll, savePokemon, getOne, setToken, like }

export default exports
