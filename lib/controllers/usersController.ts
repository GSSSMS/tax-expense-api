import {Router, Request, Response, NextFunction}  from 'express'
import UserService from '../services/UserService'
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 60
import dotenv from 'dotenv'
dotenv.config()
const COOKIE_NAME: string = typeof process.env.COOKIE_NAME === 'string' ?  process.env.COOKIE_NAME : ""
export default Router()
.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [user, token] = await UserService.signUpUser(req.body)
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
        })
        .json(user)
    } catch (error) {
        next(error)
    }
})