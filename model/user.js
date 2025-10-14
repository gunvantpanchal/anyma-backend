const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    personal: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      profile:String,
      city: String,
      dob: String,
      company:{type:String} ,
      industry: String,
    },
    investmentInfo: {
      interestedToInvest: Array, 
      sectors: Array, 
      region: Array,
      investorType: String,
      expertise: String,
      passions: String,
      anyma: Array,
    },
    account: {
      isInvitationSended: {
        type: Boolean,
        default: false
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function(v) {
            return v != null; 
          },
          message: "Email is required."
        }
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      agreement: {
        type: Boolean,
        default: false,
      },
      role: {
        type: String,
        enum: ["ADMIN", "CUSTOMER"],
        default: "CUSTOMER", 
      },
      isEnable:Boolean,
    },
    member:{
      emailToken:String,
      expiration:Date,
      verifyEmail:Boolean,
      adminId:{type:mongoose.Types.ObjectId,ref:"User"},
    },
    forget: {
      otp: String,
      otpExpiration: Date,
      otpVerify: {
        type: Boolean,
        default: false, 
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.account.email) {
    return next(new Error("Email is required."));
  }

  if (user.isModified("account.password") || user.isNew) {
    const hash = await bcrypt.hash(user.account.password, 10);
    user.account.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.account.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
