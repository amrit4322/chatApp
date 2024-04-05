import { UserSchema } from "../../schema"
import * as InterFace from "../../interfaces"
import { Helper } from "../../helpers";
import { Op } from "sequelize";
import upload from "../../config/multer";

const {ResMsg,Utilities} = Helper;
class UserService{
    public async fetchAll():Promise<unknown>{
        const allUser = await UserSchema.Read.findAll({attributes: ["id", "email", "firstName", "lastName", "phoneNumber","profilePath","about"],});
        if(!allUser){
            throw ResMsg.errors.ERROR_FETCHING
        }
        return { success: true, data: allUser};
    }

    public async fetchwithEmail(userData:string):Promise<unknown>{
        const email = userData;
        const allUser = await UserSchema.Read.findOne({where:{email},attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber',"profilePath","about"]});
        if(!allUser){
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        return { success: true, data: allUser};
    }
    

    public async fetchwithName(userData:string):Promise<unknown>{
        const name = userData;
        console.log("name is ",name)
        const allUser = await UserSchema.Read.findAll({where:{
            [Op.or]: [
              { firstName: { [Op.like]: `%${name}%` } },
              { lastName: { [Op.like]: `%${name}%` } },
              // You can add more conditions as needed
            ],
          },attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber',"profilePath","about"]});
        if(!allUser){
            throw ResMsg.errors.USER_NOT_FOUND
        }
        // console.log("all user ",allUser)
        return { success: true, data: allUser};
    }

    public async fetchwithId(id:string):Promise<unknown>{
        
        const allUser = await UserSchema.Read.findOne({where:{id},attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber',"profilePath","about"]});
        if(!allUser){
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        return { success: true, data: allUser};
    }

    public async userStatus(id:string,status:boolean):Promise<unknown>{
        
        const allUser = await UserSchema.Read.findOne({where:{id:id}});
        if(!allUser){
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        await allUser.update({isOnline:status})
        return { success: true, data: allUser};
    }
    public async logoutAll():Promise<unknown>{
        const allUser =await UserSchema.Read.findAll();
        if(!allUser){
            throw ResMsg.errors.ERROR_FETCHING
        }
        allUser.map((item)=>{
            item.update({isOnline:false})
        })
        return { success: true, data: allUser};
        }

        public async logout(id:string):Promise<unknown>{
            const existingUser =await UserSchema.Read.findOne({where:{id}});
            if(!existingUser){
                throw ResMsg.errors.ERROR_FETCHING
            }
            existingUser.update({isOnline:false})
            
            return { success: true, data:existingUser};
            }
    public async signInUser(userData:InterFace.UserInterFace.UserDataRequest):Promise<unknown>{
        const {email,password} = userData;
        const existingUser  = await UserSchema.Read.findOne({where:{email}});
       
        if(!existingUser){
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        if(existingUser.isOnline){
            throw ResMsg.errors.USER_ALREADY_LOGGEDIN
        }
        // decript the user password
        const verifyPasswordHash = await Utilities.bycryptCompare(password, existingUser.password);
        if (!verifyPasswordHash) {
            throw ResMsg.errors.PASSWORD_MISSMATCH
        }
        if (existingUser == undefined) {
            throw ResMsg.errors.SOMETHING_WENT_WRONG
        } 
        console.log("id is ", existingUser.id)
       

        const token: unknown = await Utilities.generateJwt({ "id": existingUser.id.toString(), "email": existingUser.email, "phoneNumber": existingUser.phoneNumber });
          // Rest of your code
          return { success: true, token };

        
    }

    public async createUser(userData:InterFace.UserInterFace.UserInterFace):Promise<unknown>{
        const {firstName,lastName,email,password,phoneNumber} = userData;
        const existingUser  = await UserSchema.Read.findOne({where:{email}});
        if(existingUser){
            throw ResMsg.errors.EMAIL_EXIST
        }

        //TODO add complexity in password check if needed


        const encyptedPassword: string = await Utilities.bycryptHash(password);
        const user  = await UserSchema.Write.create({firstName,lastName,email,password:encyptedPassword,phoneNumber})
        // return newUser;
        if (user.id) {
            // TODO COmplete otpModel
            // await otpModel.generateAndsendOTP("EMAIL", user.id, 6, email)
            return { status: true, message: "OTP sent to email, please verify it. , expiration time 15 min" };
        }
    }
    public async deleteUserWithEmail(userData:InterFace.UserInterFace.UserEmailRequest):Promise<unknown>{
        const {email} = userData;
        const existingUser  = await UserSchema.Read.findOne({where:{email}});
        if(!existingUser){
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        await existingUser.destroy();
        return { success: true, message: "User deleted successfully"};
    }
    public async patchUserWithEmail(userData:InterFace.UserInterFace.UserData):Promise<unknown>{
        const {firstName,lastName,email,password,phoneNumber} = userData;
        const existingUser  = await UserSchema.Read.findOne({where:{email}});
        if(!existingUser){
             throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        await existingUser.update({firstName,lastName,email,password,phoneNumber});
        return { success: true};
    }
    public async forgotPasswordTest(
        userData: InterFace.UserInterFace.ForgotPasswordRequest
    ): Promise<unknown> {
        const { token, password } = userData;
    //    console.log(token)
        //TODO password reset or forget implementation


        return { success: true }
    }


     /**
    * @api register
    * @param userData
    * @returns success (200, {}) | error (400)
   */
     public async register(
        userData: InterFace.UserInterFace.UserInterFace
    ): Promise<unknown> {
        const { email, password, phoneNumber, firstName, lastName } = userData;
        // Check if the email already exists
        const existingUser = await UserSchema.Read.findOne({
            where: {
                [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
            },
        });
        if (existingUser) {
            if (existingUser.email === email) {
                throw ResMsg.errors.EMAIL_EXIST;
            }

            if (existingUser.phoneNumber === phoneNumber) {
                throw ResMsg.errors.PHONE_NUMBER_EXIST;
            }
        }

        // You should add more password complexity checks here
        Utilities.passwordComplexityCheck(password);

        // encrypting the password for security
        const encyptedPassword: string = await Utilities.bycryptHash(password);
        console.log("encyptedPassword", encyptedPassword)
      
        const user = await UserSchema.Write.create({
            email, firstName, lastName, phoneNumber,
            password: encyptedPassword
        });
        

        if (user.id) {
           
            return { status: true, message: "OTP sent to email, please verify it. , expiration time 15 min" };
        }
    }

    /**
      * @api login
      * @param userData
      * @returns success (200, {}) | error (400)
      */
    public async login(
        userData: InterFace.UserInterFace.LoginRequest
    ): Promise<unknown> {
        const { phoneNumberOrEmail, password } = userData;
        // Check if the email already exists
        console.log("value is ", userData,phoneNumberOrEmail,password)
        const existingUser = await UserSchema.Read.findOne({
            where: {
                [Op.or]: [{ email: phoneNumberOrEmail }, { phoneNumber: phoneNumberOrEmail }],
            },
        });


        if (!existingUser) {
            throw ResMsg.errors.EMAIL_OR_PHONE_NOT_EXIST

        }

        // decript the user password
        const verifyPasswordHash = await Utilities.bycryptCompare(password, existingUser.password);

        // Check if password is match or not
        if (!verifyPasswordHash) {
            throw ResMsg.errors.PASSWORD_MISSMATCH
        }

        // // Check if the user is Verified
        // if (!existingUser?.is_verified) {
        //     throw ResMsg.errors.USER_IS_NOT_VERIFIED
        // }

        // genrating JWT Token
        const token: unknown = await Utilities.generateJwt({ "id": existingUser.id.toString(), "email": existingUser.email, "phoneNumber": existingUser.phoneNumber });

        return { success: true, token };

    }

    public async updateUser(
        userData: InterFace.UserInterFace.UserUpdateRequest,
        user :InterFace.UserInterFace.UserJWTInfo
    ): Promise<unknown> {
        const { firstName, lastName, about } = userData;
        console.log("firstname  ",user,firstName, lastName, about)
        const {id}= user
        const existingUser = await UserSchema.Read.findOne({ where: { id } });

        if (!existingUser) {
            throw ResMsg.errors.USER_NOT_FOUND
        }
        await existingUser.update({firstName,lastName,about});
        
        return { success: true };
    }

    public async changePassword(userData: InterFace.UserInterFace.ChangePasswordRequest,
        user: InterFace.UserInterFace.UserJWTInfo
    ): Promise<unknown> {
        const { oldPassword,password } = userData
        const { id } = user

        // Check if the email already exists
        const existingUser = await UserSchema.Read.findOne({ where: { id } });

        if (!existingUser) {
            throw ResMsg.errors.EMAIL_NOT_EXIST;
        }

        // decript the user password
        const verifyPasswordHash = await Utilities.bycryptCompare(oldPassword, existingUser.password);

        // Check if password is match or not
        if (!verifyPasswordHash) {
            throw ResMsg.errors.INCORRECT_OLDPASSWORD;
        }

        // You should add more password complexity checks here
        await Utilities.passwordComplexityCheck(password)

        // encrypting the password for security
        const encyptedPassword = await Utilities.bycryptHash(password);

        await existingUser.update({ password: encyptedPassword })

        return { success: true }

    }

    
    /**
     * @api forgotPassword
     * @param userData
     * @returns success (200, {}) | error (400)
     */
    public async forgotPassword(
        userData: InterFace.UserInterFace.ForgotPasswordRequest
    ): Promise<unknown> {
        console.log("inside the forgotPassword")
        const { token,password } = userData;
        const tokenDetails = Utilities.decryptOTPToken(token);
        // console.log("tokenDetails",tokenDetails)
        if (tokenDetails.errorMessage) {
            throw new Error(tokenDetails.errorMessage);
          }
        const user_id = tokenDetails.existingUser
        const existingUserBefore = await UserSchema.Read.findOne({where:{id:user_id}})
        if(!existingUserBefore){
            throw ResMsg.errors.USER_NOT_FOUND
        }
        // You should add more password complexity checks here
         Utilities.passwordComplexityCheck(password)
        // encrypting the password for security
        const encyptedPassword = await Utilities.bycryptHash(password);
        await existingUserBefore.update({ password: encyptedPassword })

        return { success: true }
    }

    public async uploadProfilePicture(file: Express.Multer.File, user: any): Promise<unknown> {
        try {
            // Assuming you have a 'profilePicture' field in your user schema
            
            const filePath = "uploads/"+file.filename
            const updatedUser = await UserSchema.Write.update({ profilePath:filePath }, { where: { id: user.id } });
            if (updatedUser) {
                return { success: true, filePath };
            } else {
                throw new Error("Failed to update profile picture");
            }
        } catch (error: any) {
            throw new Error(error.message || ResMsg.errors.SOMETHING_WENT_WRONG);
        }
    }

   
}


export default new UserService()