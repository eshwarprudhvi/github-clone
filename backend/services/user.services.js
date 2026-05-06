import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateToken = (userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET)
}
export const comparePassword = (password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword)
}