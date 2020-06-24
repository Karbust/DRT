import express from 'express'
import AWS from 'aws-sdk'

const emailRouter = express.Router()

import { aws } from '../config/config.js' // load configurations file

AWS.config.update({
    accessKeyId: aws.key,
    secretAccessKey: aws.secret,
    region: aws.ses.region
})

const ses = new AWS.SES()

const sendEmail = (to, subject, message, from) => {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message
                },
                /* replace Html attribute with the following if you want to send plain text emails.
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
             */
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: from ? from : aws.ses.fromAddress,
        Source: from ? from : aws.ses.fromAddress,
    }

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack)
        } else {
            console.log("Email sent.", data)
        }
    })
}

emailRouter.get('/test', (req, res) => {
    // call sesClient to send an email
    sendEmail('charparodar@gmail.com', "Hey! Welcome", "This is the body of email<br>Teste")

    res.send('Email is sent!')
})

export { emailRouter }
