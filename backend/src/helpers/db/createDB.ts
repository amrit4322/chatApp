/* eslint-disable @typescript-eslint/no-explicit-any */
import * as  mysql from 'mysql2/promise'
import { DB } from '../../config/config';
import consoleHelper from '../common/console.helper';

const createDb = async () => {
    try {
        consoleHelper.info("Creating MySQL connection....")

        if(!DB.hostName) {
            consoleHelper.error("No Database Config found please check databse configuration")
        }
        const connection = await mysql.createConnection({
            host: DB.hostName,
            user: DB.username,
            password: DB.password,
        });

        consoleHelper.info("Checking if Database Exist....")
        // Check if the database already exists

        const [rows] :any = await connection.execute(`SHOW DATABASES LIKE '${DB.username}'`);
        
        if (rows.length > 0) {
            consoleHelper.info(`Database "${DB.username}" exists.`);
            consoleHelper.info(`starting node server...`);

        } else {
            consoleHelper.info("Creating Database...")
            await connection.execute(`CREATE DATABASE ${DB.username}`);
            consoleHelper.info(`Database "${DB.username}" created.`);
        }

        // Close the connection
        await connection.end();
        return true;
    } catch (error) {

        console.log(`Error creating or checking the database "${DB.username}"`);
        console.log(error);
        console.log(`Please create Database manually or check createDb function in mysql.connection`);
        return false;
    }
}

// Call the function to create the database if not exists
createDb();
