'use strict'

import { Schema, model } from "mongoose"

const publicationSchema = Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
    content:{
        type: String,
        required: true
    },
    user:{
        type: Schema.ObjectId,
        ref:'user',
        required:  true
    },
    comment:[{
        type: Schema.ObjectId,
        ref:'comment',
        required: false
    }]
},{
    versionKey: false
})

export default model('publication', publicationSchema)
