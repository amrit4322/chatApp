
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv';
dotenv.config({path:[ './src/config/dev.env','./src/config/prod.env']});

// Specify the path to your PEM file
const private_key = path.resolve(__dirname, './keys/private_key.pem');
const public_key =   path.resolve(__dirname, './keys/public_key.pem'); 

// the path to your refreshToken PEM file
const rt_private_key = path.resolve(__dirname, './keys/refreshToken.private_key.pem');
const rt_public_key =   path.resolve(__dirname, './keys/refreshToken.public_key.pem');

/**  MYSQL Connection **/

// const DB = {
//     name : process.env.DB_NAME?? 'sql6.freesqldatabase.com',
//     username : process.env.USER_NAME?? 'sql6685496',
//     password : process.env.PASSWORD?? 'sql6685496',
//     hostName : process.env.HOST_NAME?? 'jwQRlJaB1F',
//     port : Number(process.env.PORT ?? 3306)
// }


const DB = {
    name :'u975447690_test',
    username :  'u975447690_root',
    password :  'Admin101xv',
    hostName : 'srv1020.hstgr.io',
}

 
/** JWT details **/

const JWT =  {   
    life: "1d",
    secret : process.env.JWTSECRET ?? 'emesfsfnrmfpomsfbatksmfoerfpesofrmfna',
    rt_private_key :  fs.readFileSync(rt_private_key, 'utf8'), // refresh_token private key
    rt_public_key :  fs.readFileSync(rt_public_key, 'utf8'), // refresh_token public key
    rt_life : '1y' , // refresh_token Life
}

/** REDIS details **/

const REDIS = {
    host : process.env.REDIS_HOST ?? 'localhost',
    port : process.env.REDIS_PORT ?? 6379,
}

// Rabbit config 
const RABBIT_CONFIG = {
    URL: process.env.RABBIT_URL?? 'amqp://localhost:5672',
    MESSAGE_QUEUE:process.env.RABBIT_MESSAGE_QUEUE??'message_queue'
}
/** TWILIO details **/

const TWILIO = {
    accountSid : process.env.TWILIO_ACCOUNT_SID ?? '', 
    authToken : process.env.TWILIO_AUTH_TOKEN ?? '',
    verifySid :  process.env.TWILIO_VERIFY_SID ?? '',
}


/** CryptoJS details **/

const CryptoJSEncKey = process.env.ENCDECRYPTKEY ?? 'CryptoJSEncKeyXRP!#130'
const CryptoJSEncTokenKey = process.env.ENCDECRYPTKEYTOKEN ?? 'CryptoJSEncKeyTKXUXRP!#130'


/** RSA Files details **/

const RSA = {
    privateKey : fs.readFileSync(private_key, 'utf8') ? fs.readFileSync(private_key, 'utf8'): "dsfwieofoefjiajoiejf",
    publicKey : fs.readFileSync(public_key, 'utf8')?fs.readFileSync(public_key, 'utf8'):"dsirfosrkfshef",
}

export {DB , JWT , TWILIO  , REDIS,CryptoJSEncKey,CryptoJSEncTokenKey,RSA,RABBIT_CONFIG}

