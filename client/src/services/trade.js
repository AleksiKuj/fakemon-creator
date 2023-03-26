import axios from "axios"

//"http://localhost:3001/api/users"
const baseUrl = "/api/trade"

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const trade = async (details) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, details, config)
  return response.data
}

const getTradeOffers = async (userId) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`${baseUrl}/${userId}/tradeoffers`, config)
  return response.data
}

const deleteTradeOffer = async (tradeOfferId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${tradeOfferId}`, config)
  return response.data
}
const exports = { trade, setToken, getTradeOffers, deleteTradeOffer }

export default exports
