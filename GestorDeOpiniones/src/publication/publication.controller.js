'use strict'

import Publication from './publication.model.js'
import Category from '../category/category.model.js'
import User from '../user/user.model.js'
import { validateJwt } from '../middlewares/validate-jwt.js'; // Asegúrate de importar la función validateJwt desde tu archivo de validación JWT

export const newPublication = async(req, res)=>{
    try {
        let data = req.body
        let user = await User.findOne({_id: data.user})
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.status(404).send({message: 'Category not found'})
        if(!user) return res.status(404).send({message: 'User not found'})
        let publication = new Publication(data)
        await publication.save()
        return res.send({message: 'Published successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving publication'})
    }
}

export const getPubliById = async()=>{
    try {
        let { id } = req.params
        let publication = await Publication.findOne({_id: id}.populate('comment'))
        if(!publication) return res.status(404).send({message: 'Publication Not Found'})
        return res.send({publication})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting publication'})
    }
}

export const getP = async(req, res)=>{
    try {
        let publications = await Publication.find().populate('comment')
        if(!publications.length === 0) return res.status(404).send({message: 'Not found'})
        return res.send({ publications })
    } catch (error) {
        consoler.error(error)
        return res.status(500).send({message: 'Error getting publications'})
    }
}


export const updateP = async (req, res) => {
    try {
        await validateJwt(req, res, async () => {
            let { idP } = req.params
            let data = req.body

            if(data.category){
                let category = await User.findOne({_id: data.category})
                if(!category) return res.status(404).send({message: 'Category not found'})
            }
            let publication = await Publication.findById(idP)
            if (!publication) {
                return res.status(404).send({ message: 'Publication Not Found' })
            }

            if (req.user._id.toString() !== publication.user.toString()) {
                return res.status(401).send({ message: 'Unauthorized to update this publication' })
            }

            let updatePublication = await Publication.findOneAndUpdate(
                { _id: idP },
                data,
                { new: true }
            )

            if (!updatePublication) {
                return res.status(404).send({ message: 'Publication not found and not updated' })
            }

            return res.send({ message: 'Publication updated successfully', updatePublication })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Server Error' })
    }
}


export const deleteP = async(req, res)=>{
    try {
        await validateJwt(req, res, async()=>{
            let { idP } = req.params

            let publication = await Publication.findById(idP)
            if (!publication) {
                return res.status(404).send({ message: 'Publication Not Found' })
            }

            if (req.user._id.toString() !== publication.user.toString()) {
                return res.status(401).send({ message: 'Unauthorized to delete this publication' })
            }
            let deletedPublication = await Publication.findOneAndDelete({_id: idP})

            return res.send({message: `publication with data ${deletedPublication} deleted successfully`})

        })

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting publication'})
    }
}
 