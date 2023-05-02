import axios from "axios"

let baseUrl
if(process.env.REACT_APP_ENV === "development") baseUrl = "http://localhost:3001/api/counter"
if(process.env.REACT_APP_ENV === "production") baseUrl = "/api/counter"

const getCount = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const exports = { getCount }

export default exports
