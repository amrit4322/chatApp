import { Router } from 'express'; // Import Request and Response from express
import { ControllerInterface } from '../../interfaces/controller.interface'; // Correct import
import ContactController from './contact.controller';
import validateToken from '../../middlewares/jwt.middleware';


class ContactRoutes implements ControllerInterface {
  public path = '/contact';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {

    this.router
      .all(`${this.path}/*`)
      .get(`${this.path}/`, ContactController.fetchAll)
      .get(`${this.path}/find/`, validateToken,ContactController.fetchUser)
      .get(`${this.path}/newContact/`, validateToken,ContactController.newContacts)
      .post(`${this.path}/connect`, validateToken,ContactController.connect)
      .post(`${this.path}/remove`,validateToken, ContactController.remove)
      .post(`${this.path}/invite`,validateToken, ContactController.inviteUser)
      .get(`${this.path}/fetchInvites`,validateToken, ContactController.allInvites)
  }
}



export default new ContactRoutes();
