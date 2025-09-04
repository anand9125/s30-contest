import { Resend } from "resend";

const resend =  new Resend("re_idqpL6nz_LL3svSDukwQsRwzf8f8RG7p3");
const BACKEND_URL = 'http://localhost:3000'
export async function sendSigninEmail(username:string,sign:string){
  resend.emails.send({
    from: 'onborading@resend.dev',
    to: username,
    subject: 'Signin',
    text: `Please click on the following link to signin: href=${BACKEND_URL}/user/signin/post?token=${sign} `,
  })
}