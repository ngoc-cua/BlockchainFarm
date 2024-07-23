const UserService = require("../services/User.services");
const ResponseHandler = require("../utils/ErrorHandler");
const Validator = require("../validation/User.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  constructor() {
    this.blacklist = []; // Initialize blacklist as an instance property
  }

  async register(req, res) {
    try {
      const { email, company_name, username, password, role_id } = req.body;

      const { error } = Validator.validate(Validator.RegisterSchema, {
        email,
        company_name,
        username,
        password,
        re_password: password,
        role_id,
      });
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);

      const user = await UserService.registerUser(
        username,
        email,
        company_name,
        password,
        role_id
      );
      ResponseHandler.created(
        res,
        "User registered successfully. Please check your email for the verification code.",
        user
      );
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }

  async verify(req, res) {
    try {
      let { code } = req.body; // Use let for reassignment
      code = String(code); // Ensure code is a string

      const { error } = Validator.validate(Validator.VerifySchema, { code });
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);

      const user = await UserService.verifyCode(code);
      ResponseHandler.success(res, "Verification successful", user);
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }

  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const { error } = Validator.validate(Validator.ResendVerificationSchema, {
        email,
      });
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);

      const user = await UserService.resendVerificationCode(email);
      ResponseHandler.success(
        res,
        "New verification code sent successfully",
        user
      );
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      const { error } = Validator.validate(Validator.LoginSchema, {
        email,
        password,
      });
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);

      // Login user
      const { user, token } = await UserService.loginUser(email, password);

      // Check if the user is verified
      if (!user.verify) {
        return ResponseHandler.forbidden(res, "User email not verified");
      }

      ResponseHandler.success(res, "Login successful", { user, token });
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }

  async logout(req, res) {
    const userController = new UserController();
    const token = req.headers.authorization;

    if (!token) {
      return ResponseHandler.unauthorized(res, "Unauthorized");
    }

    userController.blacklist.push(token); // Accessing instance property

    return ResponseHandler.success(res, "Logout successful");
  }

  static async checkTokenBlacklist(req, res, next) {
    const token = req.headers.authorization;

    // Check if the token exists in the instance's blacklist
    if (
      UserController.instance &&
      UserController.instance.blacklist.includes(token)
    ) {
      return ResponseHandler.error(
        res,
        "Token revoked. Please log in again.",
        401
      );
    }

    next();
  }
  async changePassword(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token)
        return ResponseHandler.badRequest(
          res,
          "Authorization header is required"
        );

      // Decode the JWT token to get the email
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      console.log(decoded.email);

      // Extract old_password and new_password from the request body
      const { old_password, new_password, re_new_password } = req.body;

      // Validate the input
      const { error } = Validator.validate(Validator.ChangePasswordSchema, {
        old_password,
        new_password,
        re_new_password,
      });
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);

      // Change password
      const user = await UserService.changePassword(
        email,
        old_password,
        new_password
      );
      ResponseHandler.success(res, "Password changed successfully", user);
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }
  async editUserInfo(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token)
        return ResponseHandler.badRequest(
          res,
          "Authorization header is required"
        );

      // Decode the JWT token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Extract user data from the request body
      const userData = req.body;

      // Validate the input
      const { error } = Validator.validate(
        Validator.UpdateUserInfoSchema,
        userData
      );
      if (error)
        return ResponseHandler.badRequest(res, error.details[0].message);

      // Update user info
      const user = await UserService.editUserInfo(userId, userData);
      ResponseHandler.success(
        res,
        "User information updated successfully",
        user
      );
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }
}

// Singleton instance to maintain state across requests
UserController.instance = new UserController();

module.exports = UserController.instance;
