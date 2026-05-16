import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN); //instance of twilio

export const sendSMSAlert = async(to,message) => {
    try{
        await client.messages.create({
            body:message,
            from:process.env.TWILIO_PHONE,
            to,
        });
        console.log("Sms alert sent successfully");
    }catch(error){
        console.log("Error sending sms :",error.message);
    }
}