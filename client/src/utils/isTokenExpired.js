export const isTokenExpired = (token)=> {
  try {
    const payloadBase64Url = token.split(".")[1]
    const payloadBase64 = payloadBase64Url.replace("-", "+").replace("_", "/")
    const payloadJson = atob(payloadBase64)
    const payload = JSON.parse(payloadJson)
    const currentTime = Date.now() / 1000

    // Check if the token has expired
    if (payload.exp < currentTime) {
      console.log("token expired")
      return true
    } else {
      return false
    }
  } catch (err) {
    // If there's an error while decoding the token, consider it expired
    console.log("token expired")
    return true
  }
}