import Sequelize from 'sequelize'
import { Utilizadores } from '../models/Utilizadores.js'
import { sequelize } from '../config/database.js'
import { PedidoViagem } from '../models/Viagens.js'
import moment from 'moment'

const op = Sequelize.Op

const estatisticasController = {}
sequelize.sync()

estatisticasController.contador = async (req, res) => {
    await sequelize.transaction(async () => {
        let countUsers = await Utilizadores.count({
            where: {
                TIPO_UTILIZADOR: 7,
                createdAt: {
                    [op.gte]: moment().subtract(1, 'month').toDate()
                }
            }
        })

        let countViagensPendentes = await PedidoViagem.count({
            where: {
                ESTADO: {
                    [op.in]: ['PEDIDO', 'PENDENTE']
                },
                createdAt: {
                    [op.gte]: moment().subtract(1, 'month').toDate()
                }
            }
        })

        let countViagensConcluidas = await PedidoViagem.count({
            where: {
                ESTADO: 'CONCLUIDA',
                createdAt: {
                    [op.gte]: moment().subtract(1, 'month').toDate()
                }
            }
        })

        let mediaClassificacaoViagem = 0
        await sequelize.query("SELECT AVG(\"avg\")\n" +
            "FROM (\n" +
            "SELECT \"NR_VIAGEM\", AVG(\"CLASSIFICACAO\")\n" +
            "FROM \"VIAGEM_CLASSIFICACAO\"\n" +
            "INNER JOIN \"VIAGEM_PEDIDO\" ON \"NR_VIAGEM_PEDIDO\" = \"NR_VIAGEM\"\n" +
            "WHERE \"DATAHORA_IDA\" > NOW() - \"interval\"('1 MONTH')\n" +
            "GROUP BY \"NR_VIAGEM\"\n" +
            ") n1", {
            plain: true,
            raw: true,
            type: sequelize.QueryTypes.SELECT
        }).then((users) => {
            mediaClassificacaoViagem = Number(users.avg).toFixed(2)
        })

        let top10localidades = 0
        await sequelize.query("SELECT \"LOCALIDADE\", COUNT(\"NR_VIAGEM_PEDIDO\")\n" +
            "FROM (\n" +
            "SELECT DISTINCT \"LOCALIDADE\", \"NR_VIAGEM_PEDIDO\"\n" +
            "FROM \"VIAGEM_PEDIDO\"\n" +
            "INNER JOIN \"LOCALIDADES\" ON \"ORIGEM\" = \"NR_LOCALIDADE\"\n" +
            "WHERE \"createdAt\"> NOW() - \"interval\"('1 MONTH')\n" +
            "UNION\n" +
            "SELECT DISTINCT \"LOCALIDADE\", \"NR_VIAGEM_PEDIDO\"\n" +
            "FROM \"VIAGEM_PEDIDO\"\n" +
            "INNER JOIN \"LOCALIDADES\" ON \"DESTINO\" = \"NR_LOCALIDADE\"\n" +
            "WHERE \"createdAt\"> NOW() - \"interval\"('1 MONTH')\n" +
            ") n1\n" +
            "GROUP BY \"LOCALIDADE\"\n" +
            "ORDER BY COUNT DESC\n" +
            "FETCH FIRST 10 ROWS ONLY", {
            raw: true,
            type: sequelize.QueryTypes.SELECT
        }).then((data) => {
            top10localidades = data
        })

        let passageiros = 0
        await sequelize.query("SELECT sequencia.generate_series AS passageiros, viagem.count\n" +
            "FROM (\n" +
            "SELECT GENERATE_SERIES(1,8)\n" +
            ") sequencia \n" +
            "LEFT OUTER JOIN (\n" +
            "SELECT \"PASSAGEIROS\", COUNT(\"PASSAGEIROS\") as count FROM \"VIAGEM_PEDIDO\" \n" +
            "WHERE \"DATAHORA_IDA\" > NOW() - \"interval\"('1 MONTH')\n" +
            "GROUP BY \"PASSAGEIROS\"\n" +
            "ORDER BY \"PASSAGEIROS\" ASC\n" +
            ") viagem\n" +
            "ON sequencia.generate_series = viagem.\"PASSAGEIROS\"\n" +
            "GROUP BY sequencia.generate_series, viagem.count\n" +
            "ORDER BY sequencia.generate_series ASC", {
            raw: true,
            type: sequelize.QueryTypes.SELECT
        }).then((data) => {
            passageiros = data
        })

        return {
            countUsers, countViagensConcluidas, countViagensPendentes, mediaClassificacaoViagem, top10localidades, passageiros
        }
    }).then((data) => {
        return res.json({
            success: true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao obter as estatisticas.'
        })
    })
}
estatisticasController.origemDestinoDia = async (req, res) => {
    await sequelize.transaction(async () => {
        let origemDia = 0
        await sequelize.query("SELECT datas.datas, viagem.count\n" +
            "FROM (\n" +
            "SELECT to_char(date_trunc('day', GENERATE_SERIES( (NOW() - INTERVAL '30 day')::date, NOW()::date, '1 day')::date), 'YYYY-MM-DD') AS datas\n" +
            ") datas \n" +
            "LEFT OUTER JOIN (\n" +
            "SELECT to_char(date_trunc('day', DATE(\"DATAHORA_IDA\")), 'YYYY-MM-DD') as data, COUNT(\"DATAHORA_IDA\") as count FROM \"VIAGEM_PEDIDO\" \n" +
            "WHERE \"DATAHORA_IDA\" > NOW() - \"interval\"('1 MONTH') AND \"ORIGEM\" = "+ req.params.localidade +"\n" +
            "GROUP BY DATE(\"DATAHORA_IDA\")\n" +
            "ORDER BY data ASC\n" +
            ") viagem\n" +
            "ON datas.datas = to_char(date_trunc('day', viagem.data::TIMESTAMP), 'YYYY-MM-DD')\n" +
            "GROUP BY datas.datas, viagem.count\n" +
            "ORDER BY datas.datas ASC", {
            type: sequelize.QueryTypes.SELECT
        }).then((data) => {
            origemDia = data
        })

        let destinoDia = 0
        await sequelize.query("SELECT datas.datas, viagem.count\n" +
            "FROM (\n" +
            "SELECT to_char(date_trunc('day', GENERATE_SERIES( (NOW() - INTERVAL '30 day')::date, NOW()::date, '1 day')::date), 'YYYY-MM-DD') AS datas\n" +
            ") datas \n" +
            "LEFT OUTER JOIN (\n" +
            "SELECT to_char(date_trunc('day', DATE(\"DATAHORA_IDA\")), 'YYYY-MM-DD') as data, COUNT(\"DATAHORA_IDA\") as count FROM \"VIAGEM_PEDIDO\" \n" +
            "WHERE \"DATAHORA_IDA\" > NOW() - \"interval\"('1 MONTH') AND \"DESTINO\" = "+ req.params.localidade +"\n" +
            "GROUP BY DATE(\"DATAHORA_IDA\")\n" +
            "ORDER BY data ASC\n" +
            ") viagem\n" +
            "ON datas.datas = to_char(date_trunc('day', viagem.data::TIMESTAMP), 'YYYY-MM-DD')\n" +
            "GROUP BY datas.datas, viagem.count\n" +
            "ORDER BY datas.datas ASC", {
            type: sequelize.QueryTypes.SELECT
        }).then((data) => {
            destinoDia = data
        })

        return { origemDia, destinoDia }
    }).then((data) => {
        return res.json({
            success: true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao obter as estatisticas.'
        })
    })
}
estatisticasController.contadorViagensMotoristaMes = async (req, res) => {
    await sequelize.query("SELECT datas.datas, viagem.count\n" +
        "FROM (\n" +
        "\tSELECT to_char(date_trunc('month', GENERATE_SERIES( (NOW() - INTERVAL '1 year'), NOW(), '1 month')), 'YYYY-MM') AS datas\n" +
        ") datas \n" +
        "LEFT OUTER JOIN (\n" +
        "SELECT to_char(date_trunc('month', \"DATAHORA_IDA\"), 'YYYY-MM-DD') as data, COUNT(\"DATAHORA_IDA\") as count FROM \"VIAGEM_PEDIDO\" \n" +
        "WHERE \"DATAHORA_IDA\" > NOW() - \"interval\"('1 year') AND \"MOTORISTA\" = "+ req.params.motorista +"\n" +
        "GROUP BY data\n" +
        "ORDER BY data ASC\n" +
        ") viagem\n" +
        "ON datas.datas = to_char(date_trunc('month', viagem.data::TIMESTAMP), 'YYYY-MM')\n" +
        "GROUP BY datas.datas, viagem.count\n" +
        "ORDER BY datas.datas ASC", {
        type: sequelize.QueryTypes.SELECT
    }).then((data) => {
        return res.json({
            success: true,
            data: data
        })
    }).catch(() => {
        return res.json({
            success: false,
            message: 'Ocorreu um erro ao obter as estatisticas do motorista.'
        })
    })
}
export { estatisticasController }
