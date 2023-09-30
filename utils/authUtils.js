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
  Please click on the link below to confirm your account <br />
 <a href='${process.env.UI_URL}/${token}/${otp}'> ${process.env.UI_URL}/${token}/${otp} </a><br />
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

const getOtpEmailSubject = () => `Almost ready to learn ! Click the link to confirm your email`;

const getWelcomeEmailSubject = (name) => `Welcome to the Yekola Family ${name}`;

const getWelcomeEmailBody = () => `<p>
<p> Welcome! We’re so glad you’ve decided to join our mission to teach, learn, and preserve African languages.
</p>
Add us to your mailing list so you never miss any updates or classes!</p>`;

module.exports = {
  generateToken,
  generateOTP,
  getOtpEmailBody,
  getOtpEmailSubject,
  getWelcomeEmailSubject,
  getWelcomeEmailBody,
};
