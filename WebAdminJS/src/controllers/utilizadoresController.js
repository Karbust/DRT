import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
    TiposUtilizadores, Utilizadores, Verificacoes, Validacoes
} from '../models/Utilizadores.js'
import { sequelize } from '../config/database.js'
import { url, jwt as jwtSecret } from '../config/config.js'
import { password as passwordGen, sendEmail } from '../functions.js'
import moment from 'moment'
import NodeCache from 'node-cache'
import { v4 as uuidv4 } from 'uuid'

Utilizadores.belongsTo(TiposUtilizadores, { foreignKey: 'TIPO_UTILIZADOR', as: 'TipoUser' })
TiposUtilizadores.hasMany(Utilizadores, { foreignKey: 'TIPO_UTILIZADOR', as: 'UTILIZADORTIPOUTILIZADOR' })

Validacoes.belongsTo(Utilizadores, { foreignKey: 'NR_VALIDADO', as: 'Validado' })
Validacoes.belongsTo(Utilizadores, { foreignKey: 'NR_VALIDADOR', as: 'Validador' })
Utilizadores.hasMany(Validacoes, { foreignKey: 'NR_VALIDADO', as: 'VALIDADOVALIDACOES' })
Utilizadores.hasMany(Validacoes, { foreignKey: 'NR_VALIDADOR', as: 'VALIDADORVALIDACOES' })

const userController = {}
sequelize.sync()

const op = Sequelize.Op;

const cache = new NodeCache({
    stdTTL: 100,
    checkperiod: 120,
})

userController.listar = async (req, res) => {
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

userController.listarMotoristas = async (req, res) => {
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
            cache.set('motoristas', JSON.stringify(data), 3600)
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

userController.listarNcc = async (req, res) => {
    await Utilizadores.findAll({
        attributes: ['NR_UTILIZADOR', 'N_CC'],
        where: {
            N_CC: {
                [op.startsWith]: req.body.cc,
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

userController.validacaoConta = async (req, res) => {
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
userController.verificarContaLink = async (req, res) => {
    let { token } = req.body
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
userController.verificarConta = async (req, res) => {
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
userController.verificarContaEnvioEmail = async (req, res) => {
    let token = uuidv4()

    //sendEmail(req.body.email.toString(), 'Conta criada no DRT', 'Token: ' + token)

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

userController.listaUtilizadoresNaoValidados = async (req, res) => {
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

userController.listaRegistosNaoValidados = async (req, res) => {
    await Utilizadores.findAll({
        attributes: [
            'NR_UTILIZADOR',
            'NOME_UTILIZADOR',
            'FREGUESIA',
            'createdAt',
            'deletedAt',
            [
                sequelize.literal(`(SELECT "NOME_UTILIZADOR" AS "NOME_VALIDADOR" FROM "UTILIZADORES" INNER JOIN "VALIDACOES" ON "NR_UTILIZADOR"="NR_VALIDADOR" GROUP BY "NR_UTILIZADOR", "NOME_UTILIZADOR", "NR_VALIDADOR")`),
                'NOME_VALIDADOR'
            ],
        ],
        where: {
            VALIDADO: false,
            deletedAt: {
                [op.ne]: null
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
userController.apagarRegistoNaoValidado = async (req, res) => {
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

userController.registar = async (req, res) => {
    let {
        nome, datanascimento, genero, ncc, nss, nif, telemovel, telefone, nacionalidade, morada, codpostal, localidade, email, utilizador, tipo_utilizador
    } = req.body
    if(req.files === undefined){
        return res.json({
            success: false,
            message: 'Erro ao efetuar o upload dos ficheiros.',
        })
    }
    let imagens = req.files.map((file) => file.filename)
    let password = passwordGen(8)
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
        sendEmail(data.EMAIL,
            'Conta criada no DRT',
            'Olá ' + nome + '<br><br>A sua password é: ' + password + '<br><br>O seu link de ativação da conta: ' + url + 'ativacao/' + token)

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

userController.registarApp = async (req, res) => {
    let {
        nome, datanascimento, genero, ncc, nss, nif, telemovel, telefone, nacionalidade, morada, codpostal, localidade, email, utilizador, password
    } = req.body
    if(req.files === undefined){
        return res.json({
            success: false,
            message: 'Erro ao efetuar o upload dos ficheiros.',
        })
    }
    let imagens = req.files.map((file) => file.filename)
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
        TIPO_UTILIZADOR: 7,
        EMAIL: email,
        LOGIN_USER: utilizador,
        PASSWORD: password,
        VALIDADO: false,
        VERIFICADO: false,
        TOKEN: token,
        DATA_ENVIO_MAIL: moment().format('YYYY-MM-DD HH:mm:ss')
    }).then((data) => {
        sendEmail(data.EMAIL,
            'Conta criada no DRT',
            'Olá ' + nome + '<br><br>A sua password é: ' + password + '<br><br>O seu link de ativação da conta: ' + url + 'ativacao/' + token)

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
userController.login = async (req, res) => {
    if (req.body.username === '' || req.body.username === null || req.body.username === 'undefined' || req.body.password === '' || req.body.password === null || typeof req.body.password === 'undefined') {
        return res.status(403).json({
            success: false,
            message: 'Campos em Branco',
        })
    } else if (req.body.username && req.body.password) {
        var username = req.body.username
        var password = req.body.password

        await Utilizadores.findOne({
            where: {
                EMAIL: username,
                TIPO_UTILIZADOR: {
                    [op.in]: [1, 2, 3, 4, 6],
                },
            },
        }).then((data) => {
            if (!data || !bcrypt.compareSync(password, data.PASSWORD)) {
                return res.json({
                    success: false,
                    message: 'Dados de autenticação inválidos.',
                })
            }

            if (!data.VALIDADO) {
                return res.json({
                    success: false,
                    message: 'Conta não validada.',
                })
            }

            if (!data.VERIFICADO) {
                return res.json({
                    success: false,
                    message: 'Conta não verificada.',
                })
            }

            let token
            if (req.body.remember) {
                token = jwt.sign({
                    nr_user: data.NR_UTILIZADOR,
                    email: username,
                    tipo_utilizador: data.TIPO_UTILIZADOR
                }, jwtSecret, {})
            } else {
                token = jwt.sign({
                    nr_user: data.NR_UTILIZADOR,
                    email: username,
                    tipo_utilizador: data.TIPO_UTILIZADOR
                }, jwtSecret, { expiresIn: '1h' })
            }

            return res.json({
                success: true,
                message: 'Autenticação realizada com sucesso!',
                token: token,
                tipoUser: data.TIPO_UTILIZADOR,
                validado: data.VALIDADO,
                verificado: data.VERIFICADO,
                nome: data.NOME_UTILIZADOR
            })
        }).catch(() => {
            return res.json({
                success: false,
                message: 'Erro no processo de autenticação. Tente de novo mais tarde.',
            })
        })
    }
}

userController.verificar_login = async (req, res) => {
    jwt.verify(req.body.token.Authorization.split(' ')[1], jwtSecret, (err, decoded) => {
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

export { userController }
