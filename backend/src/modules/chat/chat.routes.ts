import { Router } from 'express'; // Import Request and Response from express
import { ControllerInterface } from '../../interfaces/controller.interface'; // Correct import
import ChatController from './chat.controller';
import validateToken from '../../middlewares/jwt.middleware';


class ContactRoutes implements ControllerInterface {
  public path = '/chat';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {

    this.router
      .all(`${this.path}/*`)
    //   .get(`${this.path}/`, ContactController.fetchAll)
    //   .get(`${this.path}/find`, ContactController.fetchUser)
    //   .post(`${this.path}/connect`, ContactController.connect)
    //   .post(`${this.path}/remove`, ContactController.remove)
  }
}



export default new ContactRoutes();
