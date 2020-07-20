import Sequelize from 'sequelize'
import {
    Cores, Marcas, Modelos, Seguradoras, Viaturas
} from '../models/Viaturas.js'
import { validateBodyFields } from '../functions.js'

Modelos.belongsTo(Marcas, { foreignKey: 'NR_MARCA', as: 'Marca' })
Viaturas.belongsTo(Modelos, { foreignKey: 'NR_MODELO', as: 'Modelo' })
Marcas.hasMany(Modelos, { foreignKey: 'NR_MARCA', as: 'MARCAMODELO' })
Modelos.hasMany(Viaturas, { foreignKey: 'NR_MODELO', as: 'MODELOVIATURA' })

Viaturas.belongsTo(Seguradoras, { foreignKey: 'NR_SEGURADORA', as: 'Seguradora' })
Seguradoras.hasMany(Viaturas, { foreignKey: 'NR_SEGURADORA', as: 'SEGURADORAVIATURA' })

Viaturas.belongsTo(Cores, { foreignKey: 'NR_COR', as: 'Cor' })
Cores.hasMany(Viaturas, { foreignKey: 'NR_COR', as: 'CORVIATURA' })

Viaturas.sync()

const viaturasController = {}

viaturasController.listaViaturas = async (req, res) => {
    await Viaturas.findAll({
        include: [{
            model: Modelos,
            as: 'Modelo',
            include: {
                model: Marcas,
                as: 'Marca'
            }
        }, {
            model: Cores,
            as: 'Cor'
        }, {
            model: Seguradoras,
            as: 'Seguradora'
        }],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao pedir a lista de viaturas.'
        })
    })
}
viaturasController.listaModelos = async (req, res) => {
    await Modelos.findAll({
        order: [
            ['NR_MODELO', 'ASC']
        ],
        include: [{
            model: Marcas,
            as: 'Marca'
        }]
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viaturasController.listaMarcas = async (req, res) => {
    await Marcas.findAll({
        order: [
            ['NR_MARCA', 'ASC']
        ],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viaturasController.listaSeguradoras = async (req, res) => {
    await Seguradoras.findAll({
        order: [
            ['NR_SEGURADORA', 'ASC']
        ],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}
viaturasController.listaCores = async (req, res) => {
    await Cores.findAll({
        order: [
            ['NR_COR', 'ASC']
        ],
    }).then((data) => {
        return res.json({
            success:true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false
        })
    })
}

viaturasController.adicionarViatura = async (req, res) => {
    let {
        matricula, ano, modelo, cor, capacidade, apolice, seguradora
    } = req.body

    if(!validateBodyFields(req.body, ['matricula', 'ano', 'modelo', 'cor', 'capacidade', 'apolice', 'seguradora'])){
        return res.status(400).json({
            success: false,
            message: 'Dados em falta.',
        })
    }

    await Viaturas.create({
        MATRICULA: matricula,
        ANO: ano,
        NR_MODELO: modelo,
        NR_COR: cor,
        CAPACIDADE: capacidade,
        NR_APOLICE_SEGURO: apolice,
        NR_SEGURADORA: seguradora
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
            message: 'Viatura adicionado com sucesso.',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a viatura. Motivo: duplicada.',
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a viatura.',
        })
    })
}
viaturasController.adicionarMarca = async (req, res) => {
    const { nome_marca } = req.body

    if(!validateBodyFields(req.body, ['nome_marca'])){
        return res.status(400).json({
            success: false,
            message: 'Nome da marca em falta.',
        })
    }

    await Marcas.create({
        NOME_MARCA: nome_marca,
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
            message: 'Marca adicionado com sucesso.',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a marca. Motivo: duplicada.',
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a marca.',
        })
    })
}
viaturasController.adicionarModelo = async (req, res) => {
    const { marca, nome_modelo } = req.body

    if(!validateBodyFields(req.body, ['marca', 'nome_modelo'])){
        return res.status(400).json({
            success: false,
            message: 'Marca e/ou nome do modelo em falta.',
        })
    }

    await Modelos.create({
        NR_MARCA: marca,
        NOME_MODELO: nome_modelo,
    }).then((data) => {
        return res.status(200).status(200).json({
            success: true,
            data: data,
            message: 'Cor adicionada com sucesso.',
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar o modelo.',
        })
    })
}
viaturasController.adicionarCor = async (req, res) => {
    const { nome_cor } = req.body

    if(!validateBodyFields(req.body, ['nome_cor'])){
        return res.status(400).json({
            success: false,
            message: 'Nome da cor em falta.',
        })
    }

    await Cores.create({
        NOME_COR: nome_cor,
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
            message: 'Modelo adicionada com sucesso.',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a cor. Motivo: duplicada.',
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a cor.',
        })
    })
}
viaturasController.adicionarSeguradora = async (req, res) => {
    const { nome_seguradora } = req.body

    if(!validateBodyFields(req.body, ['nome_seguradora'])){
        return res.status(400).json({
            success: false,
            message: 'Número de cliente em falta.',
        })
    }

    await Seguradoras.create({
        NOME_SEGURADORA: nome_seguradora,
    }).then((data) => {
        return res.json({
            success: true,
            data: data,
            message: 'Seguradora adicionada com sucesso.',
        })
    }).catch(Sequelize.UniqueConstraintError, () => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a seguradora. Motivo: duplicada.',
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao adicionar a seguradora.',
        })
    })
}

export { viaturasController }
