import prisma from "../lib/prisma.js";

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