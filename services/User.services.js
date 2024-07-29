const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const UserInfo = require("../models/user_info.model");
const CompanyInfo = require("../models/company_info.model");
const Role = require("../models/role.model");
const EmailService = require("./Email.services");

class UserService {
  static generateVerificationCode() {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    return verificationCode.toString(); // Convert to string
  }

  async registerUser(username, email, company_name, password, role_id) {
    const existingUserInfo = await UserInfo.findOne({ where: { email } });
    if (existingUserInfo) throw new Error("Email already exists");

    const role = await Role.findOne({ where: { id: role_id } });
    if (!role) throw new Error("Invalid role");

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = UserService.generateVerificationCode();

    const userInfo = await UserInfo.create({ email });
    const companyInfo = await CompanyInfo.create({ company_name });

    const user = await User.create({
      username,
      password: hashedPassword,
      verification_code: verificationCode,
      user_info_id: userInfo.id,
      company_info_id: companyInfo.id,
      role_id: role_id,
    });

    // Send verification email asynchronously
    EmailService.sendVerificationEmail(email, verificationCode)
      .then(() => console.log("Verification email sent successfully"))
      .catch((err) => console.error("Error sending verification email:", err));

    return user;
  }
  async resendVerificationCode(email) {
    const user = await User.findOne({
      include: [{ model: UserInfo, where: { email } }],
    });
    if (!user) throw new Error("User not found");

    const newVerificationCode = UserService.generateVerificationCode();
    user.verification_code = newVerificationCode;
    await user.save();

    // Send new verification email asynchronously
    EmailService.sendVerificationEmail(email, newVerificationCode)
      .then(() => console.log("New verification email sent successfully"))
      .catch((err) =>
        console.error("Error sending new verification email:", err)
      );

    return user;
  }
  async verifyCode(code) {
    const user = await User.findOne({
      where: { verification_code: code },
      include: [{ model: UserInfo }]
    });
  
    if (!user) throw new Error("Invalid verification code");
  
    user.verification_code = null; // Clear the verification code
    user.verify = true;
    await user.save();
  
    return user;
  }
  async loginUser(email, password) {
    try {
      const userInfo = await UserInfo.findOne({ where: { email } });
      if (!userInfo) throw new Error("User not found");

      const user = await User.findOne({ where: { user_info_id: userInfo.id } });
      if (!user) throw new Error("User not found");

      // Log both passwords for debugging purposes
      // console.log(`Provided password for email ${email}: ${password}`);
      // console.log(
      //   `Stored hashed password for email ${email}: ${user.password}`
      // );

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.error(`Password mismatch for email ${email}`);
        throw new Error("Invalid credentials");
      }

      // Check if the user is verified
      if (!user.verify) {
        throw new Error("User email not verified");
      }
      
      const companyInfo = await CompanyInfo.findOne({ where: { id: user.company_info_id } });
    if (!companyInfo) throw new Error("Company not found");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: email, company_id: companyInfo.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "14d",
      }
    );
      return { user, token, email };
    } catch (error) {
      console.error(`Login error for email ${email}: ${error.message}`);
      throw error;
    }
  }
  async changePassword(email, oldPassword, newPassword) {
    const userInfo = await UserInfo.findOne({ where: { email } });
    if (!userInfo) throw new Error("User not found");

    const user = await User.findOne({ where: { user_info_id: userInfo.id } });
    if (!user) throw new Error("User not found");

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) throw new Error("Invalid current password");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return user;
  }
  async editUserInfo(userId, userData) {
    const { phone, email } = userData;

    try {
      const user = await UserInfo.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (phone) {
        user.Phone = phone;
      }

      if (email) {
        const existingUser = await UserInfo.findOne({ where: { Email: email } });
        if (existingUser && existingUser.id !== userId) {
          throw new Error("Email already in use by another user");
        }
        user.Email = email;
      }

      await user.save();
      return user;
    } catch (error) {
      console.error("User update error:", error.message);
      throw error;
    }
  }
}

module.exports = new UserService();
