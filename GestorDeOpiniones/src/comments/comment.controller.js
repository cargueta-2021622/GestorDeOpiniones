'use strict'

import Comment from './comment.model.js'
import Publication from '../publication/publication.model.js'
import User from '../user/user.model.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

export const addC = async (req, res) => {
    try {
        let data = req.body
        let publication = await Publication.findOne({_id: data.publication})
        if(!publication) return res.status(404).send({message: 'Publication not found'})
        let user = await User.findOne({_id: data.user})
        if(!user) return res.status(404).send({message: 'User not found'})

        let commentary = new Comment(data)

        publication.comment.push(commentary._id)
        publication.save()

        commentary.save()
        return res.send({message: 'Comeneted successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error publishing commentary' })
    }
}


export const updateC =async(req, res)=>{
    try {
        await validateJwt(req, res, async()=>{
            let { idC } = req.params
            let data = req.body
            if(data.publication) return res.status(401).send({message: 'Cant update post '})
            if(data.user) return res.status(401).send({message: 'Cant update user'})

            let comment = await Comment.findById(idC)
            
            if(req.user._id.toString() !==  comment.user.toString()){
                return res.status(401).send({message: 'Unauthorized to update this comentary'})
            }
            
            let updateComment = await Comment.findOneAndUpdate(
                {_id: idC},
                data,
                {new: true}
            )

            if(!updateComment){
                return res.status(404).send({message: 'Comment not found and not update'})
            }

            return res.send({message: 'Comment update successfully', updateComment})
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error upadating comment'})
    }
}

export const deleteComment = async(req, res)=>{
    try {
        validateJwt(req, res, async()=>{
            let { idC } = req.params

            let comment = await Comment.findById(idC)
            if(!comment) return res.status(404).send({message: 'Comment not found'})

            if(req.user._id.toString() !== comment.user.toString()){
                return res.status(401).send({message: 'Unauthorized to delete this comentary'})
            }

            let deleteComment = await Comment.findOneAndDelete({_id: idC})

            return res.send({message: `Comment with data ${deleteComment} deleted successfully`})
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Comment deleted failed'})
    }
}
