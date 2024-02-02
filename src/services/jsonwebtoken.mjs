import * as jose from 'jose'

const decodeBearerToken = accessToken => {
  try {
    const claims = jose.decodeJwt(accessToken)
    return claims
  } catch (error) {
    throw new Error(error)
  }
}

const verifyBearerToken = async (accessToken, publicKey) => {
  const jwtAlgorithm = import.meta.env.VITE_JWT_ALGORITHM
  const jwtIssuer = import.meta.env.VITE_JWT_ISSUER

  try {
    const ecPublicKey = await jose.importSPKI(publicKey, jwtAlgorithm)
    const result = await jose.jwtVerify(accessToken, ecPublicKey, { issuer: jwtIssuer })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const verifyRefreshToken = async (refreshToken, publicKey) => {
  const rtAlgorithm = import.meta.env.VITE_RT_ALGORITHM
  const rtIssuer = import.meta.env.VITE_RT_ISSUER

  try {
    const ecPublicKey = await jose.importSPKI(publicKey, rtAlgorithm)
    const result = await jose.jwtVerify(refreshToken, ecPublicKey, { issuer: rtIssuer })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export { decodeBearerToken, verifyBearerToken, verifyRefreshToken }
