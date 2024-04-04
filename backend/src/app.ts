'use strict';
// Import necessary modules and dependencies
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Helper } from './helpers/index'
import path from 'path';
import { initializeSocket } from './helpers/socket/socket.helper';

import { ControllerInterface } from './interfaces/controller.interface' // Import the Controller type from the interfaces modul
import debug from 'debug'
import SocketManager from './helpers/socket/socket.manager';




const debugInstance = debug('node')

// Define a class for the Express application
class App {
    private app: express.Application
    public server: http.Server
    private port: number | string | boolean

    constructor(controllers: ControllerInterface[]) {
        // Initialize the Express application and server
        this.app = express()
        this.server = http.createServer(this.app)
        initializeSocket(this.server)
        // new SocketManager(this.server);
        this.port = process.env.PORT ?? 3004
        // Initialize middleware and controllers
        this.initMiddleware()
        this.initControllers(controllers)
    }

    /**
     * Initialize middleware for the Express application.
    */
    private initMiddleware = () => {
        this.app.set('port', this.port)
        this.app.use(cors()) // Enable Cross-Origin Resource Sharing (CORS)
        this.app.use(bodyParser.json({limit: "10mb"})) // Parse JSON requests
        this.app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" })) // Parse URL-encoded requests
        // this.app.use(encryptionMiddleware) // adding encryptionMiddleware for data encryption
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
      
    }


    /**
     * Initialize controllers for the Express application.
     * @param controllers - Array of controller objects implementing the ControllerInterface.
     */
    private initControllers = (controllers: ControllerInterface[]) => {
        controllers.forEach((controller: ControllerInterface) => {

            this.app.use('/v1', controller.router)
        })

        // Define a route to check if the server is running
        this.app.use('/v1/status', (_req: express.Request, res: express.Response) => {



            return Helper.Response.sendSuccess(res, {
                isSuccess: true,
                memory: process.memoryUsage(),
                results: {
                    message: `App is running on Port ${this.port}.`
                },
                Date: new Date(),
            })
            
            
        }
        
        )
    }
    

    /**

    */
    public startServer = () => {
        this.server.on('error', this.onError)
        this.server.on('listening', this.onListening)
        this.server.listen(this.port)
    }

    /**
     * @function onListener
     */
    private onListening = () => {
        const addr = this.server.address()
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + this.port
        debugInstance('Listening on ' + bind)
        Helper.ConsoleHelper.info('ᴀᴘᴘ ɪꜱ ʟɪꜱᴛᴇɴɪɴɢ ᴏɴ ᴘᴏʀᴛ ░ ' + this.port)
    }


    /**
     * @function Handle server startup errors.
     * @param error - An error object (can be of type Error or NodeJS.ErrnoException).
    */
    private onError = (error: Error | NodeJS.ErrnoException) => {
        if (error instanceof Error) {
            // Handle general errors (e.g., programming errors)
            throw error
        }

        // Use type assertion to tell TypeScript that error is of type NodeJS.ErrnoException
        const errnoError = error as NodeJS.ErrnoException
        // Now, you can safely access the syscall property
        if (errnoError.syscall !== undefined) {
            const addr = this.server.address()
            const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + this.port
            switch (errnoError.code) {
                case 'EACCES':
                    Helper.ConsoleHelper.error(bind + ' requires elevated privileges')
                    break
                case 'EADDRINUSE':
                    Helper.ConsoleHelper.error(bind + ' is already in use')
                    break
                default:
                    throw error
            }
            process.exit(1)
        }
    }
    
    
}

export default App // Export the Express application
