import nodemailer from 'nodemailer';


//transporter=connects app to email service(gmail) and sends the mail
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
       user:process.env.EMAIL_USER,
       pass:process.env.EMAIL_PASS
    }
});

export const sendAlertEmail = async(to,subject,text) => {
    try{
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        console.log("Email sent successfully");
    }catch(error){
        console.log("Email alert send fail: ",error.message);   
    }
}