import { Request, Router } from 'express'

interface ControllerInterface {
    path: string
    router: Router
}


interface IExpressRequest extends Request {
    user?: { id: string, email: string ,number?:string}
}


// Define the file upload configurations interface
interface FileUploadConfig {
    name: string;
    maxCount: number;
    maxSize: number; // in bytes
    supportedTypes: string[];
}

export {
    ControllerInterface,
    IExpressRequest,
    FileUploadConfig
}
