let express = require('express')
let router = express.Router()

const AWS = require('aws-sdk')

const config = require('../config/config') // load configurations file

AWS.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.ses.region
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
        ReturnPath: from ? from : config.aws.ses.fromAddress,
        Source: from ? from : config.aws.ses.fromAddress,
    }

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack)
        } else {
            console.log("Email sent.", data)
        }
    })
}

router.get('/test', (req, res) => {
    // call sesClient to send an email
    sendEmail('charparodar@gmail.com', "Hey! Welcome", "This is the body of email")

    res.send('Email is sent!')
})

module.exports = router
