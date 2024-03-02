'use strict'

import express from 'express'
import { register, login, updateU } from './user.controller.js'
import { validateJwt } from "../middlewares/validate-jwt.js"

const api = express.Router()

api.post('/register',register)
api.post('/login',login)
api.put('/update/:id',[validateJwt],updateU)

export default api
