import dotenv from 'dotenv'
dotenv.config()
import * as userService from '../services/userService.js'
import { forgotPasswordSchema, signinSchema, signupSchema } from '../utils/userValidator.js'
import { verifyToken } from '../utils/jwtTokens.js'
import * as userRepository from '../repositories/userRepository.js'
import { generateToken } from '../utils/jwtTokens.js'

export const signup = async (req, res) => {
  const result = signupSchema.safeParse(req.body)
  if (!result.success) {
    console.log(
      `result.error.issues[0].message`,
      result.error.issues[0].message,
    )

    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    })
  }
  try {
    const user = await userService.registerUser(req.body)
    console.log(`result.data`, result.data)
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

export const signin = async (req, res) => {
  const result = signinSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    })
  }
  try {
    const { accessToken, refreshToken, user } = await userService.loginUser(
      req.body,
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({
      success: true,
      message:"Sign in successful",
      data: { accessToken },
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  console.log(`refreshToken`, refreshToken);
  if (!refreshToken)
    return res.status(401).json({ success: false, message: 'No refresh token' })

  try {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET)
    const user = await userRepository.findByEmail(decoded.email)

    if (!user ) {
      throw new Error('Email not found')
    }

    const newAccessToken = generateToken(
      { id: user.id, email: user.email },
      process.env.ACCESS_SECRET,
      '30m',
    )
    return res.json({ accessToken: newAccessToken })
  } catch (error) {
    return res.status(401).json({ 
      success : false,
      message: 'Invalid refresh token' })
  }
}


export const forgotPassword = async(req,res)=>{

   const result = forgotPasswordSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    })
  }
 
  try {
    const {email} = req.body
    await userService.forgotPassword(email)
    
     return res.status(200).json({
      success:true,
      message:"Reset link sent to email"
    })
  } catch (error) {
    console.log(`error.message`, error.message);
    return res.status(401).json({
      success : false,
      message : error.message
    })
  }
}

export const resetPassword = async (req,res)=>{
  
  try {
    const token = req.params.token
    console.log(`token`,typeof token);
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }
    const userData = {
      token : token,
      password : password
    }
    await userService.resetPassword(userData)
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now log in."
    })
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const dashboard = async(req,res)=>{
  try {
    const header = req.headers.authorization
    const token = header.split(' ')[1]
    console.log(`token`, token);
    const decoded = verifyToken(token,process.env.ACCESS_SECRET)
   

   const user =  await userService.getUser({id:decoded.id})
   if(!user){
    return res.status(404).json({
      success : false,
      message : 'User not found'
    })
   }
   return res.status(200).json({
    success : true,
    user
   })


  } catch (error) {
    console.log(`error in dashboard`, error);
     return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


export const changePassword = async(req,res)=>{
  try {
    const {oldPassword,newPassword} = req.body
    const id = req.user.id
    console.log(`id`, id);
    await userService.changePassword({id,oldPassword,newPassword})
    console.log(`hello`);
    return res.status(200).json({
    success : true,
    message : "Password changed Successfully"
   })

  } catch (error) {
    console.log(`error in change password`, error);
     return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

export const updateUser = async(req,res)=>{
  try {
    const {id,username,age,gender} = req.body
    await userService.updateUserData({id,username,age,gender})
    return res.status(200).json({
      success : true,
      message : "Data Updated Successfully"
    })
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}


export const logout = async (req, res) => {
  try {
   res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax', 
    path: '/',      
  });
    return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
  } catch (error) {
    // return res.status(404).json({
    //   success : false,
    //   message : error.message
    // })
  }
  


};