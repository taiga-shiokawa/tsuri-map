import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadToCloudinary = async (file) => {
  try {
    // Buffer to Base64
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'c9ac59d81b0963512d786440b2ad8c93ed', // 指定のフォルダ
      resource_type: 'auto'
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinaryアップロードエラー:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (url) => {
  try {
    // フォルダを含むpublic_idを抽出
    const urlParts = url.split('/');
    const folder = urlParts[urlParts.length - 2]; // フォルダ名を取得
    const filename = urlParts[urlParts.length - 1].split('.')[0]; // ファイル名を取得
    const publicId = `${folder}/${filename}`; // フォルダ名/ファイル名の形式で結合
    
    console.log('Deleting from Cloudinary:', publicId); // デバッグ用

    // Cloudinaryから画像を削除
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log('Successfully deleted from Cloudinary:', publicId); // デバッグ用
      return true;
    } else {
      console.error('Failed to delete from Cloudinary:', result); // デバッグ用
      throw new Error('画像の削除に失敗しました');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('画像の削除に失敗しました');
  }
};