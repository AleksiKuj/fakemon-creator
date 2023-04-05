import axios from "axios"

let baseUrl
if(process.env.REACT_APP_ENV === "development") baseUrl = "http://localhost:3001/api/battle"
if(process.env.REACT_APP_ENV === "production") baseUrl = "/api/battle"

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const battle = async(details)=>{
  const config = {
    headers: {Authorization: token }
  }
  const response = await axios.post(baseUrl,details,config)
  return response.data
}

const getBattle = async(id)=>{
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const exports = { battle,setToken,getBattle }

export default exports
