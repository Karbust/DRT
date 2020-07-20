import AWS from 'aws-sdk'
import { aws } from './config/config.js'

function password (length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
let sendEmail = async (to, subject, message, from) => {
    AWS.config.update({
        accessKeyId: aws.key,
        secretAccessKey: aws.secret,
        region: aws.ses.region
    })

    if (typeof Promise === 'undefined') {
        AWS.config.setPromisesDependency(require('bluebird'));
    }

    const ses = new AWS.SES()

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

    await ses.sendEmail(params).promise()
}
function validateBodyFields(body, keys) {
    return keys.every(key => body[key])
}
export { password, sendEmail, validateBodyFields }
