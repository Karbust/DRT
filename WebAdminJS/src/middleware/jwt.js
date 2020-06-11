const jwt = require('jsonwebtoken'),
    config = require('../config/config.js');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] ||
        req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length); //remove a palavra ‘Bearer ’
        }
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'O token não é válido.'
            });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Token indisponível.'
    });
    }
};
module.exports = {
    checkToken: checkToken
}
