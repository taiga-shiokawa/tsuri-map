import { sendForgetPasswordEmail } from "../emails/emailHandlers.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/storage.js";

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
        profilePicture: true,
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

// 画像アップロード
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

export const userProfileEdit = async (req, res) => {
  try {
    upload.single('profileImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "ファイルアップロードエラー" });
      }

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "認証されていません" });
      }

      // 現在のユーザー情報を取得
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { profilePicture: true }
      });

      // 既存の画像がある場合は削除
      if (currentUser?.profilePicture) {
        try {
          await deleteFromCloudinary(currentUser.profilePicture);
        } catch (error) {
          console.error("既存画像の削除エラー:", error);
          // 既存画像の削除に失敗しても、新しい画像のアップロードは継続
        }
      }

      // 新しい画像のアップロードとURLの取得
      let profilePicture = null;
      if (req.file) {
        try {
          profilePicture = await uploadToCloudinary(req.file);
        } catch (error) {
          console.error("画像アップロードエラー:", error);
          return res.status(500).json({ message: "画像のアップロードに失敗しました" });
        }
      }

      // ユーザープロフィールの更新
      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          profilePicture
        },
        select: {
          id: true,
          name: true,
          email: true,
          about: true,
          age: true,
          gender: true,
          profilePicture: true,
          createdAt: true,
          fishingPosts: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  about: true
                }
              },
              photos: true
            }
          },
          savedPosts: true
        }
      });

      return res.status(200).json(updatedUser);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "プロフィール画像の更新に失敗しました" });
  }
};