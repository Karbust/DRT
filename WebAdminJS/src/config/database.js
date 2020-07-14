import Sequelize from 'sequelize'

const sequelize = new Sequelize(
    'drt_testes',
    'drt',
    'wqBUG3ACaS82dNxm',
    {
        host: '192.168.1.96',
        port: '5432',
        dialect: 'postgres',
        timezone: 'Europe/Lisbon'/*,
        sync: {force: true}*/
    }
)
export { sequelize }
