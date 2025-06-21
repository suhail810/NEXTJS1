import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmails"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:boolean,
    username:string,
    verifyCode:string

): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:'onboarding@rrsend.dev',
            to:'email',
            subject:"mystery verification code",
            react: VerificationEmail({username, otp:verifyCode})
        })
        return {success:true, message:"Successfully Verification email send."}
    } catch (emailError) {
        console.error("Failed to send Verification Code",emailError)
        return{success:false, message:"Failed to send Verification Email."}
    }
}