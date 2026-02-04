import dotenv from 'dotenv'
dotenv.config()
import * as userRepository from '../repositories/userRepository.js'
import { verifyToken } from '../utils/jwtTokens.js'


export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token, process.env.ACCESS_SECRET)
    const user = await userRepository.findByEmail(decoded.email)
    if (!user || user.token_version !== decoded.version) {
      return res
        .status(401)
        .json({ message: 'Session expired/Password changed. Login again.' })
    }

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' })
  }
}
