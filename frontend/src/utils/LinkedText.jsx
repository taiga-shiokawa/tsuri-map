const LinkedText = ({ text, className = "" }) => {
  if (!text) return null;
  
  // URLを検出する正規表現
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // テキストをURLとそれ以外のパーツに分割
  const parts = text.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, i) => {
        // URLにマッチする部分をリンクに変換
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words"
            >
              {part}
            </a>
          );
        }
        // 通常のテキスト
        return <span key={i} className="break-words">{part}</span>;
      })}
    </span>
  );
};

export default LinkedText;