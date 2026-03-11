import bcrypt from 'bcrypt'

export const hashPassword = async (pass) => {
    return bcrypt.hash(pass, 10)
}