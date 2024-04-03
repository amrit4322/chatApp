import App from './app';
// import { Config } from '../config';
import { Helper } from './helpers';
import routes from './modules';
// Wrap the code in an async function to use await
(async () => {
    try {
        const { Mysql } = Helper

        // Configure database connection established or not
        // const checkRedisConnection =  await Redis.isConnected();
        const checkSqlConnection = await Mysql.checkDatabaseConnection()

        // const config = await Config()
        if (checkSqlConnection ) {
            // Initialize the application with contoller routes
            const appServer = new App(routes)

            // Start the application server
            appServer.startServer()
        } else {
            console.log(
                'An error occurred during configuration or Sql connection or Redis connection',
            )
            process.exit(1) // Exit the application with an error code (1)
        }
    } catch (error) {
        // Handle any errors that occur during configuration or initialization
        console.log(
            'An error occurred during configuration or initialization:',error
        )

        // Optionally, exit the application or take appropriate actions
        process.exit(1) // Exit the application with an error code (1)
    }
})()
