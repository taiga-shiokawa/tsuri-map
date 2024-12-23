import { Resend } from "resend";
import dotenv from "dotenv";

import { createWelcomeEmailTemplate, createForgetPasswordEmailTemplate } from "./emailTemplates.js";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const resend = new Resend(RESEND_API_KEY);

// 開発環境用の送信者情報
const DEV_SENDER = {
  email: 'onboarding@resend.dev',
  name: 'mya-kutsurimap Test'
};

// 本番環境用の送信者情報
const PROD_SENDER = {
  email: process.env.EMAIL_FROM,
  name: 'みゃーく釣りマップ'
};

// 環境に応じて送信者情報を切り替え
export const sender = IS_PRODUCTION ? PROD_SENDER : DEV_SENDER;

// メールアドレスを環境に応じて切り替え
const getEmailAddress = (email) => {
  return IS_PRODUCTION ? email : 'delivered@resend.dev';
};

/**
 * ウェルカムメールを送信
 * @param {string} email - 受信者のメールアドレス
 * @param {string} name - 受信者の名前
 * @param {string} url - 認証用URL
 */
export const sendWelcomeEmail = async (email, name, url) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [getEmailAddress(email)],
      subject: "みゃーく釣りマップへようこそ",
      html: createWelcomeEmailTemplate(url),
      tags: [{ name: "category", value: "Welcome" }],
      // 本番環境のみreply-toを設定
      ...(IS_PRODUCTION && { 
        reply_to: process.env.EMAIL_REPLY_TO
      })
    });

    console.info(`メール送信成功 - 送信先: ${email}`);
    return response;
  } catch (error) {
    console.error("メール送信エラー", {
      error,
      recipient: email,
      type: "welcome"
    });
    throw error;
  }
};

/**
 * パスワードリセットメールを送信
 * @param {string} email - 受信者のメールアドレス
 * @param {string} url - リセット用URL
 */
export const sendForgetPasswordEmail = async (email, url) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [getEmailAddress(email)],
      subject: "みゃーく釣りマップ パスワード再設定",
      html: createForgetPasswordEmailTemplate(url),
      tags: [{ name: "category", value: "PasswordReset" }],
      // 本番環境のみreply-toを設定
      ...(IS_PRODUCTION && {
        reply_to: process.env.EMAIL_REPLY_TO
      })
    });

    console.info(`パスワードリセットメール送信成功 - 送信先: ${email}`);
    return response;
  } catch (error) {
    console.error("メール送信エラー", {
      error,
      recipient: email,
      type: "password-reset"
    });
    throw error;
  }
};

// 必要な環境変数の検証
const validateEnvVariables = () => {
  const requiredVars = [
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'EMAIL_REPLY_TO'
  ];

  if (IS_PRODUCTION) {
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`必要な環境変数が設定されていません: ${missingVars.join(', ')}`);
    }
  }
};

// アプリケーション起動時に環境変数を検証
validateEnvVariables();