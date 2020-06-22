module.exports = {
    password: function (length) {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    },
    sendEmail : function (to, subject, message, from) {
        const AWS = require('aws-sdk')
        const config = require('./config/config') // load configurations file

        AWS.config.update({
            accessKeyId: config.aws.key,
            secretAccessKey: config.aws.secret,
            region: config.aws.ses.region
        })

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
}
