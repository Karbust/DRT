let enderecoIP = (req, res, next) => {
    req.ip_address = req.headers['cf-connecting-ip'] ||
        (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
    next()
}

export { enderecoIP }
