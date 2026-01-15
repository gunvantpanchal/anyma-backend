
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../middlewares/sendEmail");
const { message, MemberMessage } = require("../helper/emailMessage");
const { OtpGenerator } = require("../helper/otpGenrator");
const bcrypt = require("bcryptjs");
const Deal = require("../model/deal");
const crypto = require("crypto");
let firebaseStorage;
try {
  firebaseStorage = require("../utils/firebaseStorage");
} catch (e) {
  firebaseStorage = null;
}

const register = async (req, res) => {
  try {

    if (!req.body.account || !req.body.account.email) {
      return res.status(400).json({ message: "Email is required." });
    }
    
    const { email, password, cnfPassword } = req.body.account;

    const user = await User.findOne({ 'account.email': email });
    if (user) {
      return res
        .status(409)
        .json({ message: "This email already exists. Please login." });
    }

    if (password !== cnfPassword) {
      return res.status(401).json({ message: "Passwords do not match." });
    }
    if(req.body?.member?.adminId){
      const expiration=Date.now() + 5 * 60 * 1000;
      req.body.member.emailToken=await bcrypt.hash(email,10);
      req.body.member.expiration=expiration;
      console.log({body:req.body,email},"req.body")
      // await sendEmail(MemberMessage(req.body),email,"Congratultions, Your account has been created by Anyma");
      console.log("req.body cslled")
    }
    // req.body.account.role='ADMIN';
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json( "Your account is successfully created." );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const resendEmailToken=async(req,res)=>{
  try {
    const {email}=req.body;
    console.log(req.body)
    const user=await User.findOne({'account.email':email});
    if(!user){
      return res.status(404).json({message:"your email not found, please contact to admin"});
    }
    const expiration=Date.now() + 5 * 60 * 1000;
    user.member.emailToken=await bcrypt.hash(email,10);
    user.member.expiration=expiration;
    await sendEmail(MemberMessage(user),email,"Congratultions, Your account has been created by Anyma");
   await user.save();
   res.status(200).json("Link has been sent to your email");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}


// Forgot password via email link (token-based)
const forgotPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ 'account.email': email });

    if (!user) {
      return res.status(200).json("If an account exists for this email, a reset link has been sent.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 15 * 60 * 1000;

    user.forget.resetToken = token;
    user.forget.resetTokenExpiration = expiration;
    await user.save();

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${baseUrl}/reset-password/${token}`;

    const html = `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Reset your Anyma password</title>
        <style type="text/css">
          p{margin:10px 0;padding:0}
          table{border-collapse:collapse}
          img,a img{border:0;height:auto;outline:none;text-decoration:none}
          body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%}
          .mcnPreviewText{display:none !important}
          body,#bodyTable{background-color:#f2f2f2}
          .templateContainer{max-width:600px !important}
          /* Header / body / footer colours mirror MemberMessage */
          #templateHeader{background-color:#222222}
          #templateBody{background-color:#222222}
          #templateFooter{background-color:#222222}
          #templateBody .mcnTextContent{color:#ffffff;font-family:Helvetica;font-size:14px;line-height:150%;text-align:left}
          #templateBody .mcnTextContent a{color:#f14625;text-decoration:underline}
          .mcnButtonContentContainer{border-radius:9px;background-color:#F14625}
          .mcnButtonContent a{color:#ffffff;text-decoration:none;font-weight:bold;display:block;padding:12px 18px}
          @media only screen and (min-width:768px){.templateContainer{width:600px !important}}
        </style>
      </head>
      <body style="height:100%;margin:0;padding:0;width:100%;background-color:#f2f2f2;">
        <center>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" id="bodyTable">
            <tr>
              <td align="center" valign="top" id="bodyCell">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" id="templateHeader" style="background:#222222;padding:9px 0;text-align:center;">
                      <img alt="Anyma" src="https://mcusercontent.com/3eac7f8b07897154123f7675a/images/ad69e9c3-382b-866f-57a3-a8add5db4f6b.jpg" style="max-width:220px;height:auto;display:inline-block;" />
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" id="templateBody" style="background:#222222;padding:18px 0;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td class="mcnTextContent" style="padding:0 18px;color:#ffffff;">
                            <p style="margin-top:0;font-size:15px;">Hello,</p>
                            <p style="font-size:14px;">You recently requested to reset the password for your Anyma account. To set a new password, click the button below. This link will expire in 15 minutes.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:0 18px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock">
                              <tr>
                                <td align="left" style="padding-top:16px;padding-right:18px;padding-bottom:18px;padding-left:18px;">
                                  <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer">
                                    <tr>
                                      <td align="center" valign="middle" class="mcnButtonContent">
                                        <a title="Reset password" href="${link}" target="_blank" style="color:#ffffff;">Reset your password</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td class="mcnTextContent" style="padding:0 18px;color:#ffffff;">
                            <p style="font-size:13px;color:#d1d1d1;">If the button above does not work, copy and paste the following URL into your browser:</p>
                            <p style="word-break:break-all;font-size:13px;color:#f14625;"><a href="${link}" target="_blank" style="color:#f14625;text-decoration:underline;">${link}</a></p>
                            <p style="font-size:13px;color:#d1d1d1;">If you did not request this change, you can safely ignore this email. No changes will be made to your account.</p>
                            <p style="font-size:13px;color:#ffffff;">Kind regards,<br/>Anyma</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top" id="templateFooter" style="background:#222222;padding:12px 18px;text-align:center;color:#ffffff;font-size:11px;">
                      Copyright (C) 2022 Anyma Capital Ltd. All rights reserved.<br/>
                      1 Doughty Street, London, England, WC1N 2PH | members@anyma.capital
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
    `;

    try {
      await sendEmail(html, email, "Reset your Anyma password");
    } catch (e) {
      console.log("sendEmail failed (suppressing):", e?.message || e);

    }
    return res.status(200).json("If an account exists for this email, a reset link has been sent.");
  } catch (error) {
    console.log(error);
   
    return res.status(200).json("If an account exists for this email, a reset link has been sent.");
  }
};

const resetPasswordByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ 'forget.resetToken': token, 'forget.resetTokenExpiration': { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    user.account.password = password; 
    user.forget.resetToken = undefined;
    user.forget.resetTokenExpiration = undefined;
    user.forget.otp = "";
    user.forget.otpVerify = false;
    user.forget.otpExpiration = new Date();
    await user.save();

    return res.status(200).json("Password reset successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    let user;
    let token;

    // Check if token is provided for token-based authentication
    if (req.body.token) {
      try {
        const decoded = jwt.verify(req.body.token, "yourSecretKey");
        user = await User.findById(decoded.id);
        
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        // Generate a new token
        token = jwt.sign({ id: user._id }, "yourSecretKey", {
          expiresIn: "3h",
        });

        return res.status(200).json({ user, token });
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
    }

    // Email/Password authentication
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    user = await User.findOne({ "account.email": req.body.email }); 
    if (!user) {
      return res
        .status(404)
        .json({ message: "Your account does not exist. Please sign up." });
    }
    
    const isMatched = await user.comparePassword(req.body.password);
    if (!isMatched) {
      return res.status(403).json({ message: "Invalid password" });
    }

    token = jwt.sign({ id: user._id }, "yourSecretKey", {
      expiresIn: "3h",
    });

    // Check if request origin is from anyma.capital
    const origin = req.get('origin') || req.get('referer');
    if (origin && origin.includes('anyma.capital')) {
      return res.status(200).json({ 
        user, 
        token,
        redirect: `https://app.anyma.capital?token=${token}`
      });
    }

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const users = await User.findOne({'account.email':req.params.email});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const {account,personal,member}=req.body;
    let emailToken,expiration;
    if(member){
      emailToken=member?.emailToken;
      expiration=member?.expiration;
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      if(account&&typeof account==='string'){
        req.body.account=JSON.parse(account);
      }
      if(personal&&typeof personal==='string'){
        req.body.personal=JSON.parse(personal);
      }
    
    if (req.files && req?.files?.profile && req.files.profile[0]) {
      const pf = req.files.profile[0];
      if (firebaseStorage && pf.buffer) {
        const uploaded = await firebaseStorage.uploadBufferToFirebase(pf.buffer, pf.originalname, pf.mimetype);
        req.body.personal.profile = uploaded.url;
      } else if (pf.url) {
        req.body.personal.profile = pf.url;
      } else if (pf.originalname) {
        // fallback to static hosting path (disk-storage case)
        req.body.personal.profile = "https://api.anyma.capital/profile/pic/" + pf.originalname;
      } else {
        return res.status(400).json({ message: 'Profile upload failed' });
      }
    }
    // req.body.account.role='ADMIN';
   
     await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if(emailToken&&expiration){
      if (Date.now() > expiration) {
        res.status(400).json({ message: "Token expired please resend token" });
        return;
      }
        if(emailToken!==user?.member?.emailToken){
          return res.json({message:"invalid email token !"});
        }
        if(req.body.account?.password!==req.body.account?.cnfPassword){
          return res.json({message:"Password not matched !"});
        }
        // Hash the password before saving (pre-save hook will also handle this)
        user.account.password = req.body.account.password
        await  user.save();
      }

    // console.log(updatedData)
    res.status(200).json("User update successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?._message || "Internal server error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: "User not found, please create a new account" });
      return;
    }

    const otp = OtpGenerator();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expirationTime = Date.now() + 1 * 60 * 1000; 

    await sendEmail(
      message(otp), 
      req.body.email, 
      "One Time Password from Book Service"
    );

    user.forget = {
      otp: hashedOtp,
      otpExpiration: expirationTime,
      otpVerify: false,
    };

    await user.save();
    res.status(200).json("OTP has been sent to your email ID");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error._message || "Internal server error" });
  }
};
const verifyOTP=async(req,res)=>{
  try {
    const user=await User.findOne({email:req.body.email});
    if(!user){
      res.status(404).json({message:"Wrong OTP, Please enter correct OTP"});
      return;
    }
    const { otpExpiration,otp } = user.forget;
    
    if (Date.now() > otpExpiration) {
      res.status(400).json({ message: "OTP has expired" });
      return;
    }
    const isOtpValid = await bcrypt.compare(req.body.otp.toString(), otp);
    if (!isOtpValid) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
    user.forget.otpVerify=true;
    await user.save();
      res.status(200).json("OTP Verified successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
const setPassword=async(req,res)=>{
  try {
    const {newPassword,cnfPassword}=req.body;
    if(newPassword!==cnfPassword){
      res.status(403).json({message:"password not matched"});
      return;
    }
    const user=await User.findOne({email:req.body.email,'forget.otpVerify':true});
    if(!user||!user.forget.otp){
      res.status(404).json({message:"OTP expired, Please resend OTP"});
      return;
    }
    if(user.forget.otp){
      // Hash the password before saving
      user.account.password = req.body.newPassword
    }
 const savedpassword=   await user.save();
 if(!savedpassword){
  return res.status(400).json({message:"please try again"});
 }
    user.forget={
      otp:"",
      otpExpiration:new Date(),
      otpVerify:false
    }
    await user.save();
      res.status(200).json("Password reset successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const getAllUserByRoles=async(req,res)=>{
  try {
    const users=await User.find({'account.role':req.params.role});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deals = await Deal.find({
      investors: {
        $elemMatch: { investerId: id },
      },
    });

    const users = await User.findById(id);

    if (!users) {
      return res.status(404).json({ message: "user id invalid" });
    }

    const filteredDeals = deals.map((item) => ({
      ...item.toObject(), 
      investors: item.investors?.filter((v) => v?.investerId !== id) 
    }));
  
    for (const deal of filteredDeals) {
      await Deal.updateOne(
        { _id: deal._id }, 
        { $set: { investors: deal.investors } } 
      );
    }
  

    await User.findByIdAndDelete(id);
    res.status(200).json("user delete successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendEmailInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const memberDetails = await User.findById(id); 
    
    if (!memberDetails) {
      return res.status(404).json({ message: "Member not found" });
    }

    const memberAccount = memberDetails.account

    if (!memberAccount.email) {
      return res.status(400).json({ message: "Invalid member data" });
    }

    //   if (memberAccount.isInvitationSended) {
    //   return res.status(400).json({ message: "Invitation already sended to this member" });
    // }

    const emailToken = await bcrypt.hash(memberAccount.email, 10);
    const expiration = Date.now() + 5 * 60 * 1000; 

    memberDetails.member.emailToken = emailToken;
    memberDetails.member.expiration = expiration;
    await memberDetails.save(); 

    // 4️⃣ Send the email
    await sendEmail(
      MemberMessage(memberDetails),
      memberAccount.email,
      "Congratulations! Your account has been created by Anyma"
    );

    memberDetails.account.isInvitationSended = true;
    await memberDetails.save(); 

    console.log("✅ Email sent successfully to:", memberAccount.email);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error in sendEmailInvitation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserDetails,
  logout,
  sendOtp,
  verifyOTP,
  setPassword,
  getAllUserByRoles,
  deleteUser,
  getUserByEmail,
  resendEmailToken,
  sendEmailInvitation,
  forgotPasswordLink,
  resetPasswordByToken
};
