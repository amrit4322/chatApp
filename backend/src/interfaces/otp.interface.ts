interface OTPInterface {
    id: number;
    user_id: number;
    otp_code: string;
    type : string;
    expiration_time: number;
    is_used: boolean; 
    token : string 
} 

interface OTPRequestInterface {
    email?: string;
    phoneNumber? :string  
}
   

interface OTPVerifyInterface {
    token: string 
    otp : number
}


export {OTPInterface, OTPRequestInterface , OTPVerifyInterface}