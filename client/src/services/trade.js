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

const exports = { trade, setToken }

export default exports
