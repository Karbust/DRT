let jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require('../models/utilizadoresModel'),
    sequelize = require('../config/database'),
    config = require('../config/config');

const controllers = {}
sequelize.sync()

controllers.list = async (req, res) => {
    const data = await User.findAll()
        .then(function(data){
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({success: true, data: data});
}

controllers.register = async (req,res) => {
    const { name, email, password } = req.body;
    const data = await User.create({
        name: name,
        email: email,
        password: password
    })
        .then(function(data){
            return data;
        })
        .catch(error =>{
            console.log("Erro: "+error);
            return error;
        })
    res.status(200).json({
        success: true,
        message:"Registado",
        data: data
    });
}

controllers.login = async (req,res) => {
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
    }
    if (username === null || username === "undefined" || password === null || typeof password === "undefined") {
        res.status(403).json({
            success: false,
            message: 'Campos em Branco'
        });
    }
    else {
        var user = await User.findOne({
            where: {
                EMAIL: username,
                TIPO_UTILIZADOR: 1
            }
        }).then(function(data){
            if (!data || !bcrypt.compareSync(password, data.PASSWORD))
                res.status(403).json({success: false, message: 'Dados de autenticação inválidos.'});

            let token;
            if(req.body.remember)
                token = jwt.sign({email: username}, config.jwt.secret, {});
            else
                token = jwt.sign({email: username}, config.jwt.secret, {expiresIn: '1h'});

            res.json({success: true, message: 'Autenticação realizada com sucesso!', token: token});
        }).catch(error =>{
            res.status(400).json({success: false, message: 'Erro no processo de autenticação. Tente de novo mais tarde.'});
            return error;
        })
    }
};

controllers.verifylogin = async (req,res) => {
    jwt.verify(req.body.token.Authorization.split(' ')[1], config.jwt.secret, function(err, decoded) {
        if(decoded)
            res.json({success: true, message: 'Autenticação válida!'});
        else
            res.json({success: false, message: 'Autenticação não válida!'});
    });
};

controllers.testes = async (req, res) => {
    setTimeout(function(){
        console.log(req.body);
        res.json({success:true})
    }, 3000);

    /*console.log(req.body);
    res.json({success:true});*/
}

module.exports = controllers;
