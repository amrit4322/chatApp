import { Router } from 'express'; // Import Request and Response from express
import { ControllerInterface } from '../../interfaces/controller.interface'; // Correct import

import { validateSchema, validateToken } from '../../middleware';
import UserController from './user.controller'; // Correct import
import { Helper } from '../../helpers';
import upload from '../../config/multer';

const { validator } = Helper;


class UserRoutes implements ControllerInterface {
  public path = '/user';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    const { UserValidator } = validator;
    this.router
      .all(`${this.path}/*`)
      .get(`${this.path}/`,validateToken, UserController.fetchAll)
      .get(`${this.path}/isTokenValid`,validateToken, UserController.isToken)
      .post(`${this.path}/register`, validateSchema(UserValidator.register), UserController.register)
      .post(`${this.path}/login`, UserController.login)
      .patch(`${this.path}/updateUser`, validateSchema(UserValidator.register),validateToken, UserController.updateUser)
      .post(`${this.path}/changePassword`, validateSchema(UserValidator.changePassword),validateToken, UserController.changePassword)
      .post(`${this.path}/forgotPassword`, validateSchema(UserValidator.forgotPassword), UserController.forgotPassword)
    //   .get(`${this.path}/details`, validateToken , UserController.details)
      .get(`${this.path}/email`,validateToken,UserController.fetchWithEmail)
      .get(`${this.path}/search/`,validateToken,UserController.fetchWithName)
      .get(`${this.path}/logoutAll`,UserController.logoutAll)
      .get(`${this.path}/:id`,validateToken,UserController.fetchWithId)
      // .post(`${this.path}/login`,UserController.signin)
      // .post(`${this.path}/register`,UserController.signup)
      .patch(`${this.path}/update`,validateToken,UserController.updateUser)
      .delete(`${this.path}/delete`,UserController.deleteUser)
      .post(`${this.path}/forgetPass`,validateToken,UserController.forgetPassword)
      .post(`${this.path}/uploadFile`, validateToken, upload.single('profilePicture'), UserController.uploadFile)
    
      


    //   .post(`${this.path}/login`,  validateSchema(UserValidator.login), UserController.login)
    //   .get(`${this.path}/details`, validateToken , UserController.details)
    //   .post(`${this.path}/forgot-password`,  validateSchema(UserValidator.forgotPassword), UserController.forgotPassword)
    //   .post(`${this.path}/change-password`,  validateSchema(UserValidator.changePassword) , validateToken , UserController.changePassword)
    //   .get(`${this.path}/country-list/:country`,  validateToken , UserController.getCountryList)
    //   .get(`${this.path}/buy-plan/:cardId`,  validateToken , UserController.getCardPlanFeeInfo)
    //   .get(`${this.path}/get-wallet`,  validateToken , UserController.getUserWalletinfo)
    //   .post(`${this.path}/recharge`,  validateToken ,  validateSchema(TransactionValidator.send), UserController.recharge)
    //   .post(`${this.path}/recharge-fee-info`,  validateToken ,validateSchema(UserValidator.rechargeFeeInfo) , UserController.rechargeFeeInfo)
    //   .post(`${this.path}/plan-fee-info`,  validateToken ,validateSchema(UserValidator.planFeeInfo), UserController.planFeeInfo)
    //   .get(`${this.path}/maintenance-fee-info/:id`,  validateToken , UserController.maintainenceFeeInfo)
    //   .get(`${this.path}/pay-maintenance-fee/:id`,  validateToken , UserController.payMaintainenceFee)
    //   .get(`${this.path}/crypto-price/:coin`,  validateToken , UserController.cryptoPrice)
  }
}



export default new UserRoutes();
