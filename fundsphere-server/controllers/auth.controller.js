const { sendMail } = require("../utils/mailer");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDES)
    );

    user = new User({ username, email, password: hashed, role });
    await user.save();

    res
      .status(201)
      .json({ msg: "User registered successfully. Please login." });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not exists" });

    if (user.status !== "Active")
      return res
        .status(403)
        .json({ msg: "Account is not active. Contact Admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not exists" });

    if (user.status !== "Active")
      return res
        .status(403)
        .json({ msg: "Account is not active. Contact Admin." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    user.resetToken = token;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?t=${token}`;

    await sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="line-height: 1.6; color: #333">
          <h3 style="color: #f37656">Hello, ${user.username}</h3>
          <p>
            You have requested to reset your password on
            <strong>${process.env.CLIENT_URL}</strong>.
          </p>
          <p>Please click the button below to set a new password:</p>

          <a
            href="${resetUrl}"
            target="_blank"
            style="
              display: inline-block;
              margin: 10px 0;
              padding: 12px 20px;
              background-color: #f37656;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              letter-spacing: 2px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px; font-size: 14px; color: #555">
            This request is valid for <strong>10 minutes only</strong>.<br />
            If you did not request this change, please ignore this email.
          </p>
        
          <p style="margin-top: 30px; font-size: 12px; color: #888">
            Thank You,<br />
            <strong>Hobby Hive</strong>
          </p>
        </div>
      `,
    });

    res.status(200).json({ msg: "Reset link sent to your email." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { t } = req.query;
    const { newPassword, confirmPassword } = req.body;

    if (!t) return res.status(400).json({ msg: "Token is required" });

    const decoded = jwt.verify(t, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetToken !== t)
      return res.status(404).json({ msg: "Invalid or expired token" });

    if (confirmPassword !== newPassword)
      return res.status(422).json({ msg: "Password not matched" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
