'use strict'

import mongoose from "mongoose"

export const connect = async(req, res) =>{
    try {
        mongoose.connection.on('error', ()=>{
            console.log('Mongo DB | Could not be connect to MongoDB')
            mongoose.disconnect()
        })
        mongoose.connection.on('connecting', ()=> console.log('MongoDB | Try connecting'))
        mongoose.connection.on('connected', ()=> console.log('MongoDB | connected to mongoDB'))
        mongoose.connection.on('open', ()=> console.log('MongoDB | connected to database'))
        mongoose.connection.on('disconnected', ()=> console.log('MongoDB | Disconnected'))
        mongoose.connection.on('reconnected', () => console.log('MongoDB | reconnected to Database'))

        return await mongoose.connect('mongodb://127.0.0.1:27017/GestorDeOpiniones2021622')
    } catch (error) {
        console.error('Database connection failed',error)
    }
}