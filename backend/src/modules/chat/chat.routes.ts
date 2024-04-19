import { Router } from 'express'; // Import Request and Response from express
import { ControllerInterface } from '../../interfaces/controller.interface'; // Correct import
import ChatController from './chat.controller';
import validateToken from '../../middlewares/jwt.middleware';
import upload from '../../config/multer';


class ChatRoutes implements ControllerInterface {
  public path = '/chat';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {

    this.router
      .all(`${this.path}/*`)
      .post(`${this.path}/uploadfile`,validateToken,upload.single("file"), ChatController.uploadMessage)
      .get(`${this.path}/download/:name`, validateToken,ChatController.download)
      .delete(`${this.path}/deleteChat/:id`, validateToken,ChatController.deleteChatMessage)
    //   .post(`${this.path}/connect`, ContactController.connect)
    //   .post(`${this.path}/remove`, ContactController.remove)
  }
}



export default new ChatRoutes();
