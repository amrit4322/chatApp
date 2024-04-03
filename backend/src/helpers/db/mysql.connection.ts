import { SequelizeInterface } from '../../interfaces/sequelize.interface'
import { Sequelize } from 'sequelize'
import { DB } from '../../config/config'
import consoleHelper from '../common/console.helper'

class Database implements SequelizeInterface {
    public write!: Sequelize
    public read!: Sequelize

    constructor() {

        
        this.write = new Sequelize(DB.name , DB.username , DB.password, {
            host : DB.hostName,
            dialect: 'mysql', // Specify the database dialect (e.g., "mysql")
            logging: false,
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                underscored: true,
                timestamps: true,
                createdAt: true,
                updatedAt: true,
            },
            pool: {
                max: 5,
                min: 0,
                idle: 20000,
                acquire: 20000,
            },
        })


        this.read = new Sequelize(DB.name , DB.username , DB.password, {
            host : DB.hostName,
            dialect: 'mysql', // Specify the database dialect (e.g., "mysql")
            logging: false,
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                underscored: true,
                timestamps: true,
                createdAt: true,
                updatedAt: false,
            },
            pool: {
                max: 5,
                min: 0,
                idle: 20000,
                acquire: 20000,
            },
        })

        // Synchronize database tables
        this.syncTables()
    }


    public async syncTables() {
        await this.write.sync({ alter: true })
    }
}

const sequelize = new Database()

// Function to check if database connections were created successfully
const checkDatabaseConnection = async () => {
    try {
        await sequelize.write.authenticate()
        await sequelize.read.authenticate()
        consoleHelper.info('Database connection established successfully.')
        return true
    } catch (error) {
        consoleHelper.catchError('Error connecting to the database:', error)
        return false
    }
}

// Export the database connections and the checkDatabaseConnection function
export default {
    db_write: sequelize.write,
    db_read: sequelize.read,
    checkDatabaseConnection,
}
