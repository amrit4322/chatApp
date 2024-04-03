import { Response } from 'express'
import * as InterFace from '../../interfaces'

class ResponseHelper {
    /**
     * @funcation sendSuccess
     * @param response
     * @param data
     * @returns Success Response
     */
    public sendSuccess(res: Response, data = {}) {
        return res.status(200).json({ ...data, status: 200 })
    }
    
   

    /**
     * @fuction sendError
     * @param response
     * @param errors
     * @returns Error Response
     */

    public sendError(res: Response, errors: InterFace.APIInterface.ApiError) {
        return res.status(400).json({ errors })
    }

    public sendMultipleWindowError(res: Response, errors: InterFace.APIInterface.ApiError) {
        return res.status(429).json({ errors })
    }
    /**
     * @function createResponse
     * @param status (number | string)
     * @param message (string)
     * @param data {object: any}
     * @returns response object
     */
    public createResponse(
        status: number,
        message: string,
        data : unknown
    ): InterFace.APIInterface.ApiResponse {
        return { status, message, data : data ?? {} }
    }


}

export default new ResponseHelper()
