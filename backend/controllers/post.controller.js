import prisma from "../lib/prisma.js";
import multer from "multer";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/storage.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.fishingPost.findMany({
      include: {
        user: true,
        photos: true,
      },
      orderBy: {
        createdAt: "desc", // 新しい投稿から順に表示
      },
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "投稿の取得に失敗しました" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const myPosts = await prisma.fishingPost.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        user: true,
        photos: true,
      },
      orderBy: {
        createdAt: "desc", // 新しい投稿から順に表示
      },
    });
    return res.status(200).json(myPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "自分の投稿の取得に失敗しました" });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await prisma.fishingPost.findUnique({
      where: { id: postId },
      include: {
        user: true,
        photos: true,
      },
    });
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "投稿の取得に失敗しました" });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "保存した投稿の取得に失敗しました" });
  }
};

// 画像アップロード
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).array("photos", 3);

export const createPost = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "ファイルアップロードエラー" });
      }

      const {
        locationName,
        latitude,
        longitude,
        fishingDate,
        weather,
        fishingType,
        fishName,
        description,
      } = req.body;

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "認証されていません" });
      }

      // 画像のアップロードと URL の取得
      const photoUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const url = await uploadToCloudinary(file);
            photoUrls.push({ url });
          } catch (error) {
            console.error("画像アップロードエラー:", error);
            return res
              .status(500)
              .json({ message: "画像のアップロードに失敗しました" });
          }
        }
      }

      const newPost = await prisma.fishingPost.create({
        data: {
          locationName,
          location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
          fishingDate: new Date(fishingDate),
          weather,
          fishingType,
          fishName,
          description,
          user: {
            connect: {
              id: userId,
            },
          },
          photos: {
            create: photoUrls,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          photos: true,
        },
      });

      return res.status(201).json(newPost);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "投稿の作成に失敗しました" });
  }
};

export const editPost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "投稿の編集に失敗しました" });
  }
};

export const deletePost = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;

  try {
    // 投稿の存在確認と所有者チェック
    const post = await prisma.fishingPost.findUnique({
      where: { id: postId },
      include: {
        photos: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "投稿が見つかりませんでした" });
    }

    // 投稿の所有者チェック
    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "この投稿を削除する権限がありません" });
    }

    // 写真の削除処理
    if (post.photos && post.photos.length > 0) {
      // Cloudinaryからの画像削除処理をここに追加
      for (const photo of post.photos) {
        try {
          await deleteFromCloudinary(photo.url);
        } catch (error) {
          console.error("画像削除エラー:", error);
          // 画像削除エラーはログに記録するが、処理は継続する
        }
      }

      // 写真のレコードを削除
      await prisma.photo.deleteMany({
        where: {
          fishingPostId: postId,
        },
      });
    }

    // 投稿の削除
    await prisma.fishingPost.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({ message: "投稿を削除しました" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "投稿の削除に失敗しました" });
  }
};

export const searchPost = async (req, res) => {
  const { search } = req.query;

  try {
    if (!search || search.trim() === "") {
      const allPost = await prisma.fishingPost.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          photos: true,
        },
      });
      return res.status(200).json(allPost);
    }

    const posts = await prisma.fishingPost.findMany({
      where: {
        OR: [
          {
            locationName: {
              contains: search,
              mode: "insensitive", // 大文字小文字を区別しない
            },
          },
          {
            fishName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: true,
      },
      orderBy: {
        createdAt: "desc", // 新しい投稿から順に表示
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "投稿の検索に失敗しました" });
  }
};
