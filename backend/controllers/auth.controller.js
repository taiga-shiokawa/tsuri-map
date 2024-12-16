import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const register = async (req, res) => {
  const { name, email, password, age, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!name || !email || !password || !age || !gender) {
      return res.status(500).json({ message: "すべてのフィールドを入力してください" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      return res.status(500).json({ message: "このメールアドレスは既に登録されています" });
    };

    if (password.length < 6) {
      return res.status(400).json( { message: "パスワードは6文字以上にしてください。"} );
    }

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

    const url = process.env.CLIENT_URL;
    try {
      await sendWelcomeEmail(newUser.email, newUser.name, url);
    } catch (error) {
      console.log("Welcomeメールの送信に失敗しました");
      return res.status(500).json({ message: "Welcomeメールの送信に失敗しました" });
    }

    console.log("New user created: ", newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
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
                about: true,
                profilePicture: true
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
