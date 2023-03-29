import axios from "axios"

let baseUrl
if(process.env.REACT_APP_ENV === "development") baseUrl = "http://localhost:3001/api/trade"
if(process.env.REACT_APP_ENV === "production") baseUrl = "/api/trade"

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
