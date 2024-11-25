import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, age, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age,
        gender,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password: _, ...userInfo } = newUser;

    res.cookie("token", token, {
      httpOnly: true, // XSS攻撃対策
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // CSRF対策
      secure: process.env.NODE_ENV === "production",
    })
    .status(201)
    .json(userInfo);

    console.log("New user created: ", newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { name },
      include: {
        fishingPosts: {
          include: {
            user: {          // ここを追加
              select: {
                id: true,
                name: true,
                about: true
              }
            },
            photos: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: "Login failed" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(404).json({ message: "Login failed "});

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password: _, ...userInfo } = user;

    res.cookie("token", token, {
      httpOnly: true, // XSS攻撃対策
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // CSRF対策
      secure: process.env.NODE_ENV === "production",
    })
    .status(201)
    .json(userInfo);

    console.log("Login successfully: ", userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.status(200).json({ message: "ログアウト済み" });
    }
    
    res.clearCookie("token").status(200).json({ message: "ログアウト成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};