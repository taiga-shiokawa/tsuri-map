import { sendForgetPasswordEmail } from "../emails/emailHandlers.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const currentUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        createdAt: true,
        fishingPosts: true,
        savedPosts: true,
        about: true,
      },
      
    });

    console.log(user);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ユーザーの取得に失敗しました" });
  }
};

export const userEdit = async (req, res) => {
  const userId = req.userId;
  const { name, about } = req.body;

  try {
    const isUserExist = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!isUserExist) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        about,
      },
    });

    console.log("更新したユーザー:", user);

    return res.status(200).json(user);
  } catch (error) {
    console.lor(error);
    return res.status(500).json({ message: "ユーザーの編集に失敗しました" });
  }
};

export const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Eメールを入力してください" });
    }
    
    const user = await prisma.user.findUnique( {
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    };

    const resetToken = jwt.sign(
      {
        userId: user.id,
        purpose: 'password-reset'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const resetUrl = `${process.env.CLIENT_URL}/password-reset/${resetToken}`;

    try {
      await sendForgetPasswordEmail(email, resetUrl);
      // メール送信成功後にレスポンスを返す
      return res.status(200).json({ 
        message: "パスワードリセット用のメールを送信しました" 
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Eメールの送信に失敗しました" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Eメールの送信に失敗しました" });
  }
}

export const passwordReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "トークンとパスワードは必須です" });
    }

    // トークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // パスワードの更新処理
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: "パスワードを更新しました" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "パスワードの更新に失敗しました" });
  }
}