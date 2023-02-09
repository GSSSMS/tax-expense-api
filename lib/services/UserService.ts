import { compareSync, hash } from "bcrypt";
import  { sign }  from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { createUserDto } from "../dtos/users.dto";
import { UserWithoutPassword } from "../interfaces/users.interfaces";
const prismaClient = new PrismaClient()

const JWT_SECRET = typeof process.env.JWT_SECRET === 'string' ? process.env.JWT_SECRET : ""
export default class  UserService {
  
  static async signUpUser({ email, password }: createUserDto): Promise<[UserWithoutPassword, string]> {
    // Check for existing user
    const existingUser = await prismaClient.user.findUnique({where: {email: email}})
    console.log('existingUser', existingUser)
    if(existingUser) throw new Error('Email already exists')


    const passwordHash = await hash(password, Number(process.env.SALT_ROUNDS))

    const user = await prismaClient.user.create({data: {email: email, password: passwordHash}})
    console.log('user', user);
    

    const token = sign(user, JWT_SECRET, {expiresIn: '1 day'})
    console.log('token', token);

    return [removePassword(user), token]
} 
    
}


const removePassword = (user: User): UserWithoutPassword => {
    return {
        id: user.id,
        email: user.email
    }
}

