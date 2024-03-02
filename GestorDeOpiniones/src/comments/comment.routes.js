'use strict'

import  express  from "express"
import { addC, deleteComment, updateC } from "./comment.controller.js"
import { validateJwt } from "../middlewares/validate-jwt.js"

const api = express.Router()

api.post('/addC',[validateJwt],addC)
api.put('/updateComment/:idC',updateC)
api.delete('/deleteComment/:idC', deleteComment)

export default api
