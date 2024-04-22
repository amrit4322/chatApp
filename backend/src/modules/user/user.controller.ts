import UserService from "./user.service";
import { Request, Response } from "express";
// import userHelper from "./user.helper";
import { UserInterFace, IExpressRequest } from "../../interfaces";
import { Helper } from "../../helpers";
const { Response: HelperResponse, ResMsg } = Helper;

class UserController {
  /**
   * @function register User
   */
  public async register(req: Request, res: Response) {
    try {
      const data: UserInterFace.UserInterFace = req.body;
      const result = await UserService.register(data);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Registration successful..!!", {
          result,
        })
      );
    } catch (error: unknown) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  /**
   * @function login
   * @param req
   * @param res
   * @returns success (200, {}) | error (400)
   */
  public async login(req: Request, res: Response) {
    try {
      const data: UserInterFace.LoginRequest = req.body;
      const result = await UserService.login(data);
      console.log("in login");
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "login successful..!!", { result })
      );
    } catch (error: unknown) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  public async isToken(req: Request, res: Response) {
    try {
      
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Token Validated",{result:{sucesss:true}})
      );
    } catch (error: unknown) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  /**
   * @function updateUser
   * @param req
   * @param res
   * @returns success (200, {}) | error (400)
   */
  //Under testing
  public async updateUser(req: IExpressRequest, res: Response) {
    try {
      console.log("You are inside update", req.body);
      const data: UserInterFace.UserUpdateRequest = req.body;
      const user: any = req.user;
      const result = await UserService.updateUser(data, user);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "User updated successfully..!!", {
          result,
        })
      );
    } catch (error: unknown) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  /**
   * @function changePassword
   * @param req
   * @param res
   * @returns success (200, {}) | error (400)
   */

  public async changePassword(req: IExpressRequest, res: Response) {
    try {
      console.log("inside Update Password");
      const data: UserInterFace.ChangePasswordRequest = req.body;
      const user: any = req.user;
      const result = await UserService.changePassword(data, user);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "password reset successfully..!!", {
          result,
        })
      );
    } catch (error: unknown) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  /**
   * @function forgotPassword
   * @param req
   * @param res
   * @returns success (200, {}) | error (400)
   */
  public async forgotPassword(req: Request, res: Response) {
    try {
      console.log("inside forgot password");
      const data: UserInterFace.ForgotPasswordRequest = req.body;
      const result = await UserService.forgotPassword(data);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "password reset successfully..!!", {
          result,
        })
      );
    } catch (error: unknown) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  public async fetchAll(req: Request, res: Response) {
    try {
      const result = await UserService.fetchAll();
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Fetch successful..!!", { result })
      );
    } catch (error: any) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  public async fetchWithEmail(req: IExpressRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) throw new Error("Error occured in user");
      const result = await UserService.fetchwithEmail(user.email);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Fetch user successful..!!", {
          result,
        })
      );
    } catch (error: any) {
      // Logger.createLog("error", "error in fetching user", error);
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }
  public async fetchWithName(req: IExpressRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) throw new Error("Error occured in user");

      let name = "";

      if (Array.isArray(req.query.name)) {
        name = (req.query.name as string[]).join(", ");
      } else if (typeof req.query.name === "string") {
        name = req.query.name;
      }
      const result = await UserService.fetchwithName(name);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Fetch user successful..!!", {
          result,
        })
      );
    } catch (error: any) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }
  public async fetchWithId(req: IExpressRequest, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.fetchwithId(id);
      console.log("found id ");
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Fetch user successful..!!", {
          result,
        })
      );
    } catch (error: any) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }
  public async signin(req: Request, res: Response) {
    try {
      const data: UserInterFace.UserDataRequest = req.body;
      const result = await UserService.signInUser(data);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Signin successful..!!", { result })
      );
    } catch (error: any) {
      if (error == ResMsg.errors.USER_ALREADY_LOGGEDIN) {
        return HelperResponse.sendMultipleWindowError(res, {
          message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
        });
      } else {
        return HelperResponse.sendError(res, {
          message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
        });
      }
    }
  }

  public async signup(req: Request, res: Response) {
    try {
      const data: UserInterFace.UserInterFace = req.body;
      const result = await UserService.createUser(data);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Signup successful..!!", { result })
      );
    } catch (error: any) {
      // Logger.createLog("error", "error in registering ", error);
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }
  public async logoutAll(req: Request, res: Response) {
    try {
      const result = await UserService.logoutAll();
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Signup successful..!!", { result })
      );
    } catch (error: any) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  public async forgetPassword(req: IExpressRequest, res: Response) {
    try {
      const data: UserInterFace.ForgotPasswordRequest = req.body;
      const result = await UserService.forgotPassword(data);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Password forgot successful..!!", {
          result,
        })
      );
    } catch (error: any) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const data: UserInterFace.UserEmailRequest = req.body;
      await UserService.deleteUserWithEmail(data);
      return HelperResponse.sendSuccess(
        res,
        HelperResponse.createResponse(200, "Delete successful..!!", {})
      );
    } catch (error: any) {
      return HelperResponse.sendError(res, {
        message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
    }
  }

  /**
   * @function uploadFile
   * @param req
   * @param res
   * @returns success (200, {}) | error (400)
   */
  //Under testing
  public async uploadFile(req: IExpressRequest, res: Response) {
    try {
     
      if (!req.file) {
          return HelperResponse.sendError(res, { message: "No file uploaded" });
      }

      const user = req.user; // Assuming you have user data attached to the request
      const result = await UserService.uploadProfilePicture(req.file, user);
      return HelperResponse.sendSuccess(
          res,
          HelperResponse.createResponse(200, "Profile picture uploaded successfully..!!", {
              result,
          })
      );
  } catch (error: any) {
      return HelperResponse.sendError(res, {
          message: error.message || ResMsg.errors.SOMETHING_WENT_WRONG,
      });
  }
  }
  // public async updateUser(req: Request, res: Response) {
  //   try {
  //     const data: UserInterFace.UserData = req.body;
  //     const result = await UserService.patchUserWithEmail(data);
  //     return HelperResponse.sendSuccess(
  //       res,
  //       HelperResponse.createResponse(200, "Update successful..!!", { result })
  //       );
  //     } catch (error: any) {
  //       Logger.createLog("error", "error in updating ", error);
  //       return HelperResponse.sendError(res, {
  //         message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG,
  //       });
  //     }
  //   }
}

export default new UserController();
