import crypto from 'crypto'

export const getHashedToken = (token)=>{
   const dataToHash = String(token); 
    return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

export const resetPasswordToken = ()=>{
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashed = getHashedToken(resetToken)
    const expiry = new Date(Date.now() + 5*60*1000)

    return {hashedToken:hashed,expiry,resetToken}
}