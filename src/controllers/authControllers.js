const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { insertRecord, queryRecord } = require("../utils/sqlFunctions");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  const result = await queryRecord(query, [email]);
  return result[0] || null;
};

const getUserById = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
  }

  try {
      const query = "SELECT * FROM users WHERE userId = ? LIMIT 1";
      const result = await queryRecord(query, [userId]);

      if (!result.length) {
          return res.status(404).json({ error: "User not found" });
      }

      res.json(result[0]);
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email or Password fields cannot be empty!" });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = { userId: uuidv4(), email, password: hashedPassword };

    await insertRecord("users", user);
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email or Password fields cannot be empty!" });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAccessToken(existingUser.userId);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ userId: existingUser.userId, email: existingUser.email, access_token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "User logged out successfully!" });
};

module.exports = { getUserById, register, login, logout };
