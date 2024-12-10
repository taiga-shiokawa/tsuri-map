import { Resend } from "resend";
import dotenv from "dotenv";

import { createWelcomeEmailTemplate, createForgetPasswordEmailTemplate } from "./emailTemplates.js";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const IS_TEST = process.env.NODE_ENV === 'production';
export const resend = new Resend(RESEND_API_KEY);

const TEST_SENDER = {
  email: 'onboarding@resend.dev',
  name: 'Miyakobook Test'
};

// 本番環境用の送信元アドレス
// const PROD_SENDER = {
//   email: process.env.EMAIL_FROM,
//   name: process.env.EMAIL_FROM_NAME
// };

// 環境に応じて送信元を切り替え
export const sender = TEST_SENDER;

const getTestEmailAddress = (originalEmail) => {
  return IS_TEST ? 'delivered@resend.dev' : originalEmail;
};

export const sendWelcomeEmail = async (email, name, url) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [getTestEmailAddress(name, email)],
      subject: "みゃーく釣りマップへようこそ",
      html: createWelcomeEmailTemplate(url),
      tags: [ { name: "category", value: "Welcome" }]
    });

    console.error("メール送信に成功しました");
    return response;
  } catch (error) {
    console.error("メール送信に失敗しました", error);
    throw error;
  }
};

export const sendForgetPasswordEmail = async (email, url) => {
  try {
    const response = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [getTestEmailAddress(email)],
      subject: "みゃーく釣りマップ パスワード再設定",
      html: createForgetPasswordEmailTemplate(url),
      tags: [{ name: "category", value: "PasswordReset" }]
    });

    console.error("メール送信に成功しました");
    return response;
  } catch (error) {
    console.error("メール送信に失敗しました", error);
    throw error;
  }
};