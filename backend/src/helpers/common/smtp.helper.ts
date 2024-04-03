// import * as nodemailer from 'nodemailer';
// import { Helper } from '..';
// import { MAILGUN } from '../../config/config';


// interface CustomTransportOptions {
//     // Define your custom options here
//     host: string;
//     port: number;
//     secure: boolean;
//     auth: {
//         user: string;
//         pass: string;
//     };
// }
// class Smtp {
//     private transporter: nodemailer.Transporter;

//     constructor() {
//         // Initialize the transporter when the class is instantiated
//         this.transporter = this.initSmtp();
//     }

//     /**
//      * @function initSmtp
//      * @returns instance of nodemailer transporter
//      */
//     private initSmtp(): nodemailer.Transporter {
//         const smtpConfig: CustomTransportOptions = {
//             host: MAILGUN.HOST_NAME, // Replace with your SMTP server host
//             port: Number(MAILGUN.PORT), // Replace with the appropriate port
//             secure: false, // Set to true if you are using SSL/TLS
//             auth: {
//                 user: MAILGUN.USERNAME,
//                 pass: MAILGUN.PASSWORD,
//             },
//         };

//         return nodemailer.createTransport(smtpConfig);
//     }


//     /**
//      * Sends an email using SendGrid.
//      * @param data - Email data { to: string; otp: string }
//      * @returns Promise<void>
//      */
//     public async sendEmail(data: { to: string; otp: string }): Promise<void> {
//         const { ConsoleHelper } = Helper;
//         const { to, otp } = data;

//         try {
//             const subject = `Your OTP from xrpaynet`;
//             const htmlContent = `
//                     <html>
//                         <body>
//                             <p>Dear User,</p>
//                             <p>Your One-Time Password (OTP) for xrpaynet is: <strong>${otp}</strong></p>
//                             <p>Please use this OTP to complete your verification process.</p>
//                             <p>Thank you for using xrpaynet.</p>
//                         </body>
//                     </html>
//                 `;

//             const message = {
//                 to,
//                 from: MAILGUN.FROM_EMAIL,
//                 subject,
//                 html: htmlContent,
//             };
//             const res = await this.transporter.sendMail(message);

//             ConsoleHelper.obj('Email sent successfully:', { response: res, to, time: new Date() });
//         } catch (error) {
//             ConsoleHelper.catchError('Error sending email:', error);
//             // Logger.createLog('error', 'Failed to send email.', error);
//         }
//     }
// }

// export default new Smtp();
