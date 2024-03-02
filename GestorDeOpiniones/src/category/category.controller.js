'use strict'

import Category from './category.model.js'
import Publication from '../publication/publication.model.js'

export const save = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        category.save()
        return res.send({message: 'Category saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving category'})
    }
}

export const getC = async(req, res) =>{
    try {
        let category = await Category.find()
        if(!category.length === 0) return res.status(404).send({message: 'Categories not fund'})
        return res.send({category})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error getting categories'})
    }
}

export const deltedC = async(req, res)=>{
    try {
        let { id } = req.params
        let category = await Category.findOne({_id: id})
        if(!category) return res.status(400).send({message: 'Category not found'})

        let defaultCategory = await Category.findOne({ name: 'Default' })
        if (!defaultCategory) {
            defaultCategory = await Category.create({ name: 'Default', description: 'Categoría por defecto' })
        }
        await Publication.updateMany({ category: id }, { $set: { category: defaultCategory._id } })
        let deletedCategory = await Category.findOneAndDelete({_id: id})
        return res.send({message: `Category deleted ${deletedCategory}`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleted category'})
    }
}
