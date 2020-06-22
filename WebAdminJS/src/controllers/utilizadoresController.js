let { Sequelize, Op } = require('sequelize'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    {
        TiposUtilizadores, Utilizadores, Verificacoes, Validacoes
    } = require('../models/Utilizadores'),
    sequelize = require('../config/database'),
    config = require('../config/config'),
    functions = require('../functions'),
    moment = require('moment'),
    NodeCache = require('node-cache'),
    { v4: uuidv4 } = require('uuid')

Utilizadores.belongsTo(TiposUtilizadores, { foreignKey: 'TIPO_UTILIZADOR', as: 'TipoUser' })
TiposUtilizadores.hasMany(Utilizadores, { foreignKey: 'TIPO_UTILIZADOR', as: 'UTILIZADORTIPOUTILIZADOR' })

Validacoes.belongsTo(Utilizadores, { foreignKey: 'NR_VALIDADO', as: 'Validado' })
Validacoes.belongsTo(Utilizadores, { foreignKey: 'NR_VALIDADOR', as: 'Validador' })
Utilizadores.hasMany(Validacoes, { foreignKey: 'NR_VALIDADO', as: 'VALIDADOVALIDACOES' })
Utilizadores.hasMany(Validacoes, { foreignKey: 'NR_VALIDADOR', as: 'VALIDADORVALIDACOES' })

const controllers = {}
sequelize.sync()

const cache = new NodeCache({
    stdTTL: 100,
    checkperiod: 120,
})

controllers.listar = async (req, res) => {
    const data = await Utilizadores.findAll()
        .then((data) => {
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
        await Utilizadores.findAll({
            attributes: ['NR_UTILIZADOR', 'NOME_UTILIZADOR'],
            where: {
                TIPO_UTILIZADOR: 5,
            },
            order: [
                ['NOME_UTILIZADOR', 'ASC'],
            ],
        }).then((data) => {
            cache.set('motoristas', JSON.stringify(data), 900)
            return res.json({
                success: true,
                data: data,
            })
        }).catch(() => {
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
    await Utilizadores.findAll({
        attributes: ['NR_UTILIZADOR', 'N_CC'],
        where: {
            N_CC: {
                [Op.startsWith]: req.body.cc,
            },
        },
        order: [
            ['N_CC', 'ASC'],
        ],
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({ success: false })
    })
}

controllers.validacaoConta = async (req, res) => {
    await sequelize.transaction(async (t) => {
        let { user, aprovar } = req.body
        let { nr_user } = req.decoded

        let promises = []
        if(aprovar) {
            promises.push(
                Utilizadores.update({
                    VALIDADO: true,
                }, {
                    where: {
                        NR_UTILIZADOR: user,
                        VALIDADO: false,
                    },
                    transaction: t,
                }),
            )

            promises.push(
                Validacoes.create({
                    NR_VALIDADO: user,
                    NR_VALIDADOR: nr_user,
                    DATA_HORA_VALIDACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    ESTADO: 'APROVADO',
                }, {
                    transaction: t,
                }),
            )
        } else {
            promises.push(Utilizadores.destroy({
                where: {
                    NR_UTILIZADOR: user,
                },
                transaction: t,
            }))

            promises.push(
                Validacoes.create({
                    NR_VALIDADO: user,
                    NR_VALIDADOR: nr_user,
                    DATA_HORA_VALIDACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                    ESTADO: 'DESAPROVADO'
                }, {
                    transaction: t,
                }),
            )
        }

        return Promise.all(promises)
    }).then(() => {
        return res.json({ success: true })
    }).catch((err) => {
        console.log(err)
        return res.json({ success: false })
    })
}
controllers.verificarContaLink = async (req, res) => {
    let { token } = req.params
    if(token !== '1' && token !== '' && token !== null && token !== undefined) {
        await sequelize.transaction(async (t) => {
            let promises = []
            promises.push(
                Utilizadores.update({
                    VERIFICADO: true,
                    TOKEN: '1',
                }, {
                    where: {
                        TOKEN: token,
                        VERIFICADO: false,
                    },
                    transaction: t,
                }),
            )

            promises.push(
                Utilizadores.findOne({
                    attributes: ['NR_UTILIZADOR'],
                    where: {
                        TOKEN: token,
                    },
                }, {
                    transaction: t,
                }).then((data) => {
                    Verificacoes.create({
                        NR_VERIFICADO: data.NR_UTILIZADOR,
                        TOKEN: token,
                        DATA_HORA_VERIFICACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                        VALIDADO: 'EMAIL',
                    }, {
                        transaction: t,
                    })
                }),
            )

            return Promise.all(promises)
        }).then(() => {
            return res.json({ success: true })
        }).catch(() => {
            return res.json({ success: false })
        })
    } else {
        return res.json({ success: false })
    }
}
controllers.verificarConta = async (req, res) => {
    await sequelize.transaction(async (t) => {
        let promises = []
        promises.push(
            Utilizadores.update({
                VERIFICADO: true,
            }, {
                where: {
                    NR_UTILIZADOR: req.body.user,
                },
                transaction: t,
            }),
        )

        promises.push(
            Verificacoes.create({
                NR_VERIFICADO: req.body.user,
                TOKEN: '1',
                DATA_HORA_VERIFICACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                VALIDADO: 'PAINEL',
                NR_VERIFICADOR: req.decoded.nr_user,
            }, {
                transaction: t,
            }),
        )

        return Promise.all(promises)
    }).then(() => {
        return res.json({ success: true })
    }).catch(() => {
        return res.json({ success: false })
    })
}
controllers.verificarContaEnvioEmail = async (req, res) => {
    let token = uuidv4()

    //functions.sendEmail(req.body.email.toString(), 'Conta criada no DRT', 'Token: ' + token)

    Utilizadores.update({
        TOKEN: token,
        DATA_ENVIO_MAIL: moment().format('YYYY-MM-DD HH:mm:ss')
    }, {
        where: {
            NR_UTILIZADOR: req.body.user,
        },
    }).then(() => {
        return res.json({ success: true })
    }).catch(() => {
        return res.json({ success: false })
    })
}

controllers.listaUtilizadoresNaoValidados = async (req, res) => {
    await Utilizadores.findAll({
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
            'EMAIL',
            'VERIFICADO',
            'DATA_ENVIO_MAIL',
            'createdAt',
        ],
        where: {
            VALIDADO: false,
        },
        order: [
            ['createdAt', 'ASC'],
        ],
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch(() => {
        return res.json({ success: false })
    })
}

controllers.listaRegistosNaoValidados = async (req, res) => {
    await Utilizadores.findAll({
        attributes: [
            'NR_UTILIZADOR',
            'NOME_UTILIZADOR',
            'FREGUESIA',
            'createdAt',
            [
                sequelize.literal(`(SELECT "NOME_UTILIZADOR" AS "NOME_VALIDADOR" FROM "UTILIZADORES" INNER JOIN "VALIDACOES" ON "NR_UTILIZADOR"="NR_VALIDADOR" GROUP BY "NR_UTILIZADOR", "NOME_UTILIZADOR", "NR_VALIDADOR")`),
                'NOME_VALIDADOR'
            ],
        ],
        where: {
            VALIDADO: false,
            deletedAt: {
                [Op.ne]: null
            }
        },
        order: [
            ['createdAt', 'ASC'],
        ],
        include: [{
            model: Validacoes,
            as: 'VALIDADOVALIDACOES',
            attributes: ['NR_VALIDADOR'],
            where: {
                ESTADO: 'DESAPROVADO'
            }
        }],
        paranoid: false
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
        })
    }).catch((error) => {
        console.log(error)
        return res.json({ success: false, message: error })
    })
}
controllers.apagarRegistoNaoValidado = async (req, res) => {
    /*await sequelize.transaction(async (t) => {
        let { user, aprovar } = req.body
        let { nr_user } = req.decoded

        let promises = []

        promises.push(Utilizadores.destroy({
            where: {
                NR_UTILIZADOR: user,
            },
            transaction: t,
        }))

        promises.push(
            Validacoes.create({
                NR_VALIDADO: user,
                NR_VALIDADOR: nr_user,
                DATA_HORA_VALIDACAO: moment().format('YYYY-MM-DD HH:mm:ss'),
                ESTADO: 'DESAPROVADO'
            }, {
                transaction: t,
            }),
        )

        return Promise.all(promises)
    }).then(function() {
        return res.json({ success: true })
    }).catch(function(err) {
        console.log(err)
        return res.json({ success: false })
    })*/
}

controllers.registar = async (req, res) => {
    let {
        nome, datanascimento, genero, ncc, nss, nif, telemovel, telefone, nacionalidade, morada, codpostal, localidade, email, utilizador, tipo_utilizador
    } = req.body
    let imagens = req.files.map((file) => file.filename)
    let password = functions.password(8)
    let token = uuidv4()

    await Utilizadores.create({
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
        EMAIL: email,
        LOGIN_USER: utilizador,
        PASSWORD: password,
        VALIDADO: tipo_utilizador !== 7,
        VERIFICADO: false,
        TOKEN: token,
        DATA_ENVIO_MAIL: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then((data) => {
        //functions.sendEmail(email.toString(), 'Conta criada no DRT', 'Password: ' + password + '\nToken: ' + token)

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
            validado: false,
        })
    } else if (req.body.username && req.body.password) {
        var username = req.body.username
        var password = req.body.password

        await Utilizadores.findOne({
            where: {
                EMAIL: username,
                TIPO_UTILIZADOR: {
                    [Op.in]: [1, 2, 3, 4, 6],
                },
            },
        }).then((data) => {
            if (!data || !bcrypt.compareSync(password, data.PASSWORD)) {
                return res.json({
                    success: false,
                    message: 'Dados de autenticação inválidos.',
                    token: '',
                    tipoUser: null,
                    validado: false,
                    verificado: false,
                })
            }

            if (!data.VALIDADO) {
                return res.json({
                    success: false,
                    message: 'Conta não validada.',
                    token: '',
                    tipoUser: null,
                    validado: false,
                    verificado: false,
                })
            }

            if (!data.VERIFICADO) {
                return res.json({
                    success: false,
                    message: 'Conta não verificada.',
                    token: '',
                    tipoUser: null,
                    validado: false,
                    verificado: false,
                })
            }

            let token
            if (req.body.remember) {
                token = jwt.sign({
                    nr_user: data.NR_UTILIZADOR,
                    email: username,
                    tipo_utilizador: data.TIPO_UTILIZADOR
                }, config.jwt.secret, {})
            } else {
                token = jwt.sign({
                    nr_user: data.NR_UTILIZADOR,
                    email: username,
                    tipo_utilizador: data.TIPO_UTILIZADOR
                }, config.jwt.secret, { expiresIn: '1h' })
            }

            return res.json({
                success: true,
                message: 'Autenticação realizada com sucesso!',
                token: token,
                tipoUser: data.TIPO_UTILIZADOR,
                validado: data.VALIDADO,
                verificado: data.VERIFICADO,
            })
        }).catch(() => {
            return res.json({
                success: false,
                message: 'Erro no processo de autenticação. Tente de novo mais tarde.',
                token: '',
                tipoUser: null,
                validado: false,
                verificado: false,
            })
        })
    }
}

controllers.verificar_login = async (req, res) => {
    jwt.verify(req.body.token.Authorization.split(' ')[1], config.jwt.secret, (err, decoded) => {
        if (decoded) {
            res.json({
                success: true,
                message: 'Autenticação válida!',
                data: decoded
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
