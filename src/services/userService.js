import dotenv from 'dotenv'
dotenv.config()
import * as userRepository from '../repositories/userRepository.js'
import { comparePassword, hashPassword } from '../utils/hashHelper.js'
import { generateToken } from '../utils/jwtTokens.js'
import { getHashedToken, resetPasswordToken } from '../utils/cryptoToken.js'
import { sendEmail } from '../utils/mailFormat.js'

export const registerUser = async (userData) => {
  const { email, password, confirmPassword } = userData
 

  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    throw new Error('Email already exists')
  }

  const hashedPassword = await hashPassword(password)

  return await userRepository.create({
    ...userData,
    password: hashedPassword,
  })
}

export const loginUser = async (userData) => {
  const { email, password } = userData

  const user = await userRepository.findByEmail(email)
  console.log(`user`, user);

  if (!user || !(await comparePassword(password,user.password_hash))) {
    throw new Error('Invalid email or password')
  }
 
  
  const payload = {
  id : user.id,
  email : user.email,
  }

  const accessToken = generateToken(payload,process.env.ACCESS_SECRET,'30m')
  const refreshToken = generateToken(payload,process.env.REFRESH_SECRET,'7d')

  return {accessToken,refreshToken,user}

}


export const forgotPassword = async(email)=>{
  console.log(`hello from forgot`, );
  const user = await userRepository.findByEmail(email)
  console.log(`user`, user);
  if(!user){
   
   throw new Error('Unauthorized User')
  }
  console.log(`after user`);
  const { hashedToken, expiry, resetToken } = resetPasswordToken();
  await userRepository.updateResetToken(user.id,hashedToken,expiry)

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`
  console.log(`resetUrl`, resetUrl);
  const message = `Follow this link to reset your password: ${resetUrl}`

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    message,
    resetUrl
  });
}

export const resetPassword = async(userData)=>{
 
  console.log(`type of `, typeof userData.token)
  const token = userData.token
  const {password } = userData;
  if (!token) throw new Error("Token missing")
  console.log(`token`, token);
  const cleanToken = String(token).trim()
  const hashedToken = getHashedToken(cleanToken)

  console.log("Plain Token from URL:", cleanToken)
  console.log("Hashed Token being searched:", hashedToken)
  const user = await userRepository.findUserByResetToken(hashedToken)
  console.log(`user`, user);
  if (!user) {
    throw new Error("Invalid Token")
  }
  const isExpired = new Date(user.reset_password_expiry) < new Date()
  if (isExpired) {
    throw new Error("Token Expired")
  }

  const newHashedPassword = await hashPassword(password)

  const isSamePassword = await comparePassword(password, user.password_hash);

if (isSamePassword) {
  throw new Error("New password must be different from the old one");
}
  await userRepository.completePasswordReset(user.id, newHashedPassword);

  return {success : true}
}

export const getUser = async(userData) =>{
  const user = await userRepository.findById(userData.id)
  if(!user){
    throw new Error('User not found')
  }
  return user
}

export const changePassword = async(userData)=>{
  const user = await userRepository.findById(userData.id)
  if(!user){
    throw new Error('User not found')
  }
  const isMatch = await comparePassword(userData.oldPassword, user.password_hash);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }
 const newHashedPassword = await hashPassword(userData.newPassword)
 console.log(`userData.newPassword`, userData.newPassword);
 console.log(`userData.id`, userData.id);
 await userRepository.updatePasswordById(userData.id,newHashedPassword)
 return true

}

export const updateUserData = async(userData)=>{

  const user = await userRepository.findById(userData.id)
  if(!user){
    throw new Error('User not found')
  }

  const updatedUser = await userRepository.updateUserDataBYId(userData)
  
  return true


} 