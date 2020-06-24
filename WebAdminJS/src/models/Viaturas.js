import Sequelize from 'sequelize'
import { sequelize } from '../config/database.js'

var Cores = sequelize.define('VIATURAS_CORES', {
    NR_COR: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NOME_COR: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

var Marcas = sequelize.define('VIATURAS_MARCAS', {
    NR_MARCA: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NOME_MARCA: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

var Modelos = sequelize.define('VIATURAS_MODELOS', {
    NR_MODELO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NR_MARCA: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Marcas,
            key: 'NR_MARCA'
        }
    },
    NOME_MODELO: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

var Seguradoras = sequelize.define('VIATURAS_SEGURADORAS', {
    NR_SEGURADORA: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NOME_SEGURADORA: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: false
})

var Viaturas = sequelize.define('VIATURAS', {
    NR_VIATURA: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MATRICULA: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    ANO: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    NR_MODELO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Modelos,
            key: 'NR_MODELO'
        }
    },
    NR_COR: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cores,
            key: 'NR_COR'
        }
    },
    CAPACIDADE: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    NR_APOLICE_SEGURO: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
    },
    NR_SEGURADORA: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Seguradoras,
            key: 'NR_SEGURADORA'
        }
    },
}, {
    freezeTableName: true, //para corrigir a criação de tabelas pluralizadas
    timestamps: true,
    paranoid: true,
})

export {
    Cores, Marcas, Modelos, Seguradoras, Viaturas
}
