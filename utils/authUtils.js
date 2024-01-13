const jwt = require("jsonwebtoken");

function generateToken(userId, email, role, active, name, validity = "12h") {
  return jwt.sign(
    { userId, email, role, active, name },
    process.env.AUTH_TOKEN,
    {
      expiresIn: validity,
    }
  );
}

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const getOtpEmailBody = (token, otp) => `<p>
  Hello! 
  <br/> <br />
  <a href='${process.env.UI_URL}/${token}/${otp}'> Click here </a> to confirm your account <br />
 <br />
  <br/>
  This link will expire in 5 min.
  <br />
  
 <strong>
 Do not share this with anyone.
 </strong> 
  <br /> <br />
  
  For any questions regarding your signup 
  please email us at welcome@yekola.app
  <br/>
  Warm Regards, <br />
  The Yekola Team
  </p>`;

const getOtpEmailSubject = () =>
  `Almost ready to learn ! Click the link to confirm your email`;

const getWelcomeEmailSubject = (name) => `Welcome to the Yekola Family ${name}`;

const getWelcomeEmailBody = () => `<p>
<p> Welcome! We're so glad you've decided to join our mission to teach, learn, and preserve African languages.
</p>
Add us to your mailing list so you never miss any updates or classes!</p>`;

const getResetPasswordEmailSubject = () =>
  `Reset Password OTP`;

  const getResetPasswordEmailBody = (otp) => `<p>
  Hello! 
  <br/> <br />
  Please use following security code to reset password <br />
 <h2> ${otp} </h2><br />
  This security code will expire in 5 min.
  <br />
  
 <strong>
 Do not share this with anyone.
 </strong> 

  <br /> <br />
  
  For any questions please email us at welcome@yekola.app
  <br/>
  Warm Regards, <br />
  The Yekola Team
  </p>`;

module.exports = {
  generateToken,
  generateOTP,
  getOtpEmailBody,
  getOtpEmailSubject,
  getWelcomeEmailSubject,
  getWelcomeEmailBody,
  getResetPasswordEmailSubject,
  getResetPasswordEmailBody
};
