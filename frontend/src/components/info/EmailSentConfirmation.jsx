const EmailSentConfirmation = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <h1 className="font-bold text-2xl mb-4">メール送信完了</h1>
        <p className="text-gray-600 mb-6">
          パスワードリセットの手順を記載したメールを送信しました。
          メールの内容に従ってパスワードの再設定を行ってください。
        </p>
        <p className="text-sm text-gray-500">
          ※メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
      </div>
    </div>
  );
};

export default EmailSentConfirmation;