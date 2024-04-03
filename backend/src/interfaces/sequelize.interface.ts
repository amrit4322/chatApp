import { Sequelize } from 'sequelize'

export interface SequelizeInterface {
    write: Sequelize
    read: Sequelize
}
