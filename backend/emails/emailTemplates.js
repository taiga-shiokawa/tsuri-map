export function createWelcomeEmailTemplate(name, url) {
  return `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>みゃ〜く釣りマップへようこそ</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #5fced8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">みゃ〜く釣りマップへようこそ！</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #000000;"><strong>${name}様</strong></p>
      <p>会員登録、誠にありがとうございます！</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #5fced8; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">みゃ〜く釣りマップへ移動</a>
      </div>
      <p>ご不明な点やお困りのことがございましたら、サポートチームが常時対応させていただきます。</p>
      <p>※このメールに心当たりがない場合は、無視していただいて構いません。</p><br
      <p>よろしくお願いいたします。<br>みゃ〜く釣りマップチーム</p>
    </div>
  </body>
  </html>
  `;
}

export function createForgetPasswordEmailTemplate(url) {
  return `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>みゃ〜く釣りマップへようこそ</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #5fced8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">みゃ〜く釣りマップへようこそ！</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p>パスワードの再設定を行ってください。</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #5fced8; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">再設定</a>
      </div>
      <p>ご不明な点やお困りのことがございましたら、サポートチームが常時対応させていただきます。</p>
      <p>※このメールに心当たりがない場合は、無視していただいて構いません。</p><br
      <p>よろしくお願いいたします。<br>みゃ〜く釣りマップチーム</p>
    </div>
  </body>
  </html>
  `;
}