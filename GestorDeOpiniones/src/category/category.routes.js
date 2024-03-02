'use strict'

import express from 'express'
import { deltedC, getC, save } from './category.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/save',[validateJwt],save)
api.get('/get',[validateJwt],getC)
api.delete('/delete/:id',[validateJwt],deltedC)

export default api
