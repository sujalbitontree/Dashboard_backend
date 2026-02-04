import jwt from 'jsonwebtoken'

export const generateToken =  (payload,privateKey,expiresIn)=>{
    return jwt.sign(payload,privateKey,{expiresIn})
    
}

export const verifyToken = (token,privateKey)=>{
    return jwt.verify(token,privateKey)
}