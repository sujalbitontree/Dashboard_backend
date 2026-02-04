import { query } from '../config/db.js'

export const findByEmail = async (email) => {
  const isEmailExists = 'SELECT * FROM users WHERE email = $1'
  const { rows } = await query(isEmailExists, [email])
  return rows[0]
}
export const findById = async (id) => {
  const isIdExists = 'SELECT * FROM users WHERE id = $1'
  const { rows } = await query(isIdExists, [id])
  return rows[0]
}

export const create = async (userData) => {
  const { username, password, email, age, gender } = userData
  const sql = `
        INSERT INTO users (username, password_hash, email, age, gender)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, created_at;
    `
  const values = [username, password, email, age, gender]
  const { rows } = await query(sql, values)
  console.log(query)
  return rows[0]
}

export const updateResetToken = async (userId, hashedToken, expiry) => {
  const sql = `
        UPDATE users 
        SET reset_password_token = $2, reset_password_expiry = $3 
        WHERE id = $1
    `
  await query(sql, [userId, hashedToken, expiry])
}

export const findUserByResetToken = async (hashedToken) => {
  const sql =
    `SELECT id, password_hash, reset_password_expiry 
    FROM users 
    WHERE reset_password_token = $1`
  const { rows } = await query(sql, [hashedToken])
  return rows[0]
}

export const completePasswordReset = async (
  userId,
  hashedPassword,
 
) => {
  const sql = `
        UPDATE users 
        SET password_hash = $1, 
            reset_password_token = NULL, 
            reset_password_expiry = NULL 
        WHERE id = $2
    `
  await query(sql, [hashedPassword, userId])
}

export const updatePasswordById = async (id, newPasswordHash) => {
  const sql = `
    UPDATE users 
    SET password_hash = $1 
    WHERE id = $2
  `

  return await query(sql, [newPasswordHash, id])
}

export const updateUserDataBYId = async(userData)=>{

  const {id,username,age,gender} = userData
  const sql = `
  UPDATE users
  SET username = $2,
      age = $3,
      gender = $4
  WHERE id = $1
  `
    return await query(sql, [id,username,age,gender])

}
