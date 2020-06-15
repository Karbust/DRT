let { Sequelize, Op } = require('sequelize'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require('../models/utilizadoresModel'),
    sequelize = require('../config/database'),
    config = require('../config/config'),
    functions = require('../functions'),
    moment = require('moment'),
    NodeCache = require('node-cache')

const controllers = {}
sequelize.sync()

const cache = new NodeCache({
    stdTTL: 100,
    checkperiod: 120,
})

controllers.listar = async (req, res) => {
    const data = await User.findAll()
        .then(function(data) {
            return data
        })
        .catch(error => {
            return error
        })
    res.json({
        success: true,
        data: data,
    })
}

controllers.listarMotoristas = async (req, res) => {
    if (cache.get('motoristas') === undefined) {
        await User.findAll({
            attributes: ['NR_UTILIZADOR', 'NOME_UTILIZADOR', 'TIPO_UTILIZADOR'],
            where: {
                TIPO_UTILIZADOR: 5,
            },
            order: [
                ['NOME_UTILIZADOR', 'ASC'],
            ],
        }).then(function(data) {
            cache.set('motoristas', JSON.stringify(data), 900)
            return res.json({
                success: true,
                data: data,
            })
        }).catch(error => {
            return res.json({ success: false })
        })
    } else {
        return res.json({
            success: true,
            data: JSON.parse(cache.get('motoristas')),
        })
    }
}

controllers.listarNcc = async (req, res) => {
    await User.findAll({
        attributes: ['NR_UTILIZADOR', 'N_CC'],
        where: {
            N_CC: {
                [Op.startsWith]: req.body.cc,
            },
        },
        order: [
            ['N_CC', 'ASC'],
        ],
    }).then(function(data) {
        setTimeout(() => {
            return res.json({
                success: true,
                data: data,
            })
        }, 2000)
    }).catch(error => {
        return res.json({ success: false })
    })
}

controllers.listaUtilizadoresNaoValidados = async (req, res) => {
    await User.findAll({
        attributes: [
            'NR_UTILIZADOR',
            'NOME_UTILIZADOR',
            'DATA_NASCIMENTO',
            'N_CC',
            'N_CC_COMPROVATIVO',
            'N_SEGSOCIAL',
            'NIF',
            'N_TELEMOVEL',
            'N_TELEFONE',
            'GENERO',
            'MORADA_UTILIZADOR',
            'COD_POSTAL',
            'MORADA_COMPROVATIVO',
            'FREGUESIA',
            'NACIONALIDADE',
            'DATA_CRIACAO_CONTA',
            'EMAIL',
        ],
        where: {
            VALIDADO: false,
        },
        order: [
            ['DATA_CRIACAO_CONTA', 'ASC'],
        ],
    }).then(function(data) {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(error => {
        return res.json({ success: false })
    })
}

controllers.registar = async (req, res) => {
    const { nome, datanascimento, genero, ncc, nss, nif, telemovel, telefone, nacionalidade, morada, codpostal, localidade, email, utilizador, tipo_utilizador } = req.body
    const imagens = req.files.map((file) => file.filename)
    const password = functions.password(8)

    await User.create({
        NOME_UTILIZADOR: nome,
        DATA_NASCIMENTO: moment(datanascimento).format('YYYY-MM-DD'),
        N_CC: ncc,
        N_CC_COMPROVATIVO: imagens.find(imagem => imagem.includes('cartao_cidadao')),
        N_SEGSOCIAL: nss,
        NIF: nif,
        N_TELEMOVEL: telemovel,
        N_TELEFONE: telefone,
        GENERO: genero,
        MORADA_UTILIZADOR: morada,
        COD_POSTAL: codpostal,
        MORADA_COMPROVATIVO: imagens.find(imagem => imagem.includes('comprovativo_morada')) || null,
        FREGUESIA: localidade,
        NACIONALIDADE: nacionalidade,
        CARTA_CONDUCAO_COMPROVATIVO: imagens.find(imagem => imagem.includes('carta_conducao')) || null,
        TIPO_UTILIZADOR: tipo_utilizador,
        DATA_CRIACAO_CONTA: moment().format('YYYY-MM-DD HH:mm:ss'),
        EMAIL: email,
        LOGIN_USER: utilizador,
        PASSWORD: password,
    }).then(function(data) {
        //functions.sendEmail(email.toString(), 'Conta criada no DRT', 'Password: ' + password)

        return res.json({
            success: true,
            data: data,
            message: 'Utilizador adicionado com sucesso',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Email ou Utilizador já registado',
        })
    })
}

controllers.login = async (req, res) => {
    if (req.body.username === '' || req.body.username === null || req.body.username === 'undefined' || req.body.password === '' || req.body.password === null || typeof req.body.password === 'undefined') {
        return res.status(403).json({
            success: false,
            message: 'Campos em Branco',
            token: '',
            validado: false
        })
    } else if (req.body.username && req.body.password) {
        var username = req.body.username
        var password = req.body.password

        await User.findOne({
            where: {
                EMAIL: username,
                TIPO_UTILIZADOR: {
                    [Op.in]: [1, 2, 3, 4, 6],
                },
            },
        }).then(function(data) {
            if (!data || !bcrypt.compareSync(password, data.PASSWORD)) {
                return res.json({
                    success: false,
                    message: 'Dados de autenticação inválidos.',
                    token: '',
                    tipoUser: null,
                    validado: false
                })
            }

            if (!data.VALIDADO) {
                return res.json({
                    success: false,
                    message: 'Conta não validada.',
                    token: '',
                    tipoUser: null,
                    validado: false
                })
            }

            let token
            if (req.body.remember) {
                token = jwt.sign({ email: username }, config.jwt.secret, {})
            } else {
                token = jwt.sign({ email: username }, config.jwt.secret, { expiresIn: '1h' })
            }

            return res.json({
                success: true,
                message: 'Autenticação realizada com sucesso!',
                token: token,
                tipoUser: data.TIPO_UTILIZADOR,
                validado: data.VALIDADO
            })
        }).catch(() => {
            return res.json({
                success: false,
                message: 'Erro no processo de autenticação. Tente de novo mais tarde.',
                token: '',
                tipoUser: null,
                validado: false
            })
        })
    }
}

controllers.verificar_login = async (req, res) => {
    jwt.verify(req.body.token.Authorization.split(' ')[1], config.jwt.secret, function(err, decoded) {
        if (decoded) {
            res.json({
                success: true,
                message: 'Autenticação válida!',
            })
        } else {
            res.json({
                success: false,
                message: 'Autenticação não válida!',
            })
        }
    })
}

controllers.testes = async (req, res) => {
    /*setTimeout(function() {
        console.log(req.body)
        res.json({ success: true })
    }, 3000);*/

    /*console.log(req.body);
    res.json({success:true});*/
}

module.exports = controllers
