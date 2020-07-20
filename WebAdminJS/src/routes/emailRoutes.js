import express from 'express'

const emailRouter = express.Router()

import { sendEmail } from '../functions.js'

emailRouter.get('/test', (req, res) => {
    sendEmail('charparodar@gmail.com', "Hey! Welcome", "This is the body of email<br>Teste")
        .then(() => {
            console.log("sucesso")
        })
        .catch(() => {
            console.log("erro")
        })

    res.send('Email is sent!')
})

export { emailRouter }
