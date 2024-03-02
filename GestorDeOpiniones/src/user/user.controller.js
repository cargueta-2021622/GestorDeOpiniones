'use strict'

import User from "./user.model.js"
import { encrypt, checkPassword } from "../utils/validator.js"
import { generateJwt } from "../utils/jwt.js"

export const register = async(req, res) =>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered Successfully'})
    } catch (error) {
        console.error(error)
        return res.send({message: 'Error registering user', error})
    }
}

export const login = async(req, res) =>{
    try {
        let { email, username, password} = req.body
        if(email){
            var user = await User.findOne({email})
        }else if(username){
            var user = await User.findOne({username})
        }
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid : user._id,
                username: user.username,
                name: user.name
            }
            let token = await generateJwt(loggedUser)

            return res.send(
                {
                    message: `Welcome, ${loggedUser}`,
                    loggedUser,
                    token
                }
                )
        }   
        return res.status(404).send({message: 'Invalid Credentials'})
    } catch (error) {
        console.error(error)
        return res.status(401).send({message: 'Failed to login'})
    }
}

export const updateU = async (req, res) => {
    try {
        let { id } = req.params
        let { oldPassword, ...data } = req.body
        let user = await User.findById(id)
        if (!user) {
            return res.status(401).send({ message: 'User not found and not update' })
        }
        if (data.password) {
            if (!oldPassword) {
                return res.status(400).send({ message: 'Debes proporcionar la contraseña antigua' })
            }

            if (oldPassword !== user.password) {
                return res.status(403).send({ message: 'Las contraseñas no coinciden (oldPassword)' })
            }
        }
        let updateUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        return res.send({ message: 'Usuario actualizado correctamente', updateUser })
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'Error updating user' })
    }
}
