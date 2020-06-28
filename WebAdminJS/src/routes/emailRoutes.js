import express from 'express'
import AWS from 'aws-sdk'

const emailRouter = express.Router()

import { aws } from '../config/config.js'
import { sendEmail } from '../functions.js'

AWS.config.update({
    accessKeyId: aws.key,
    secretAccessKey: aws.secret,
    region: aws.ses.region
})

emailRouter.get('/test', (req, res) => {
    // call sesClient to send an email
    sendEmail('charparodar@gmail.com', "Hey! Welcome", "This is the body of email<br>Teste")

    res.send('Email is sent!')
})

export { emailRouter }
