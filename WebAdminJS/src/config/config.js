const url = 'http://localhost:3000/'

const bcrypt = {
    rounds: 10
}

const jwt = 'drt'

const aws = {
    key: 'AKIAIEMHMWOWLSKIE3GQ',
    secret: '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',
    ses: {
        server: 'email-smtp.eu-west-1.amazonaws.com',
        region: 'eu-west-1',
        port: '587',
        username: 'AKIAZMNHWZCSDLCQ5KX2',
        password: 'BNgXE0cNFOcsP8fiZevs7sV1uy6w5sxNxxVv6jW/JA67',
        fromName: 'DRT',
        fromAddress: 'DRT <admin@karbust.me>'
    }
}
export { url, bcrypt, jwt, aws }
