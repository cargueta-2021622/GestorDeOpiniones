'use strict'

import express from 'express'
import { deleteP, getP, newPublication, updateP } from './publication.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/newPublication',[validateJwt],newPublication)
api.get('/get',[validateJwt],getP)
api.put('/update/:idP',updateP)
api.delete('delete/:idP',deleteP)

export default api
