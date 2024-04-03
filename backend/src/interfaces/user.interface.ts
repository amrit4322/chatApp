interface UserInterFace {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  isVerified?: boolean;
  isOnline?:boolean;
  profilePath?:string;
  about?:string;

}

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePath?:string;
  about?:string;

}
  
interface UserUpdateRequest {
  firstName: string;
    lastName: string;
    about: string;
}

  
  interface UserEmailRequest {
    email: string;
  }

  interface UserProfileRequest{
    profilePath:string
  }
  
  interface UserDataRequest {
    email: string;
    phoneNumber?:string;
    password: string;
    
  }
  interface UserData {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
  
  }

  interface UserInvite {
    id:string,
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  
  }
  
  interface VerifyOTpRequest {
    email?: string;
    otp: string;
  }
  
  interface VerifyOTPTypeRequest {
    type: string;
    otp: string;
  }
  
  interface LoginRequest {
    phoneNumberOrEmail: string;
    password: string
  }
  
  interface ForgotPasswordRequest {
    otp: string
    token: string
    password:string
  }
  

  
  interface ChangePasswordRequest {
    userId: string;
    password: string;
    oldPassword: string;
    // confirmPassword: string
  }
  
  interface UserJWTInfo {
    id: string;
    email:string;
  }
  
  export {
    UserJWTInfo,
    UserInterFace,
    UserEmailRequest,
    UserDataRequest,
    UserData,
    VerifyOTpRequest,
    VerifyOTPTypeRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ChangePasswordRequest,
    UserProfileRequest,
    UserUpdateRequest,
    UserInvite,
    UserInfo
  };
  
 