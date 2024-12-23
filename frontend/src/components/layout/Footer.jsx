import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-md border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6 md:py-8">
          <div className="flex flex-col space-y-4 items-center md:flex-row md:justify-between md:space-y-0">
            {/* ロゴとコピーライト */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                みゃーく釣りマップ © 2024
              </span>
            </div>

            {/* リンク */}
            <nav className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
              <Link 
                to="/terms" 
                className="hover:text-gray-900 transition-colors text-center sm:text-left"
              >
                利用規約
              </Link>
              <Link 
                to="/privacy" 
                className="hover:text-gray-900 transition-colors text-center sm:text-left"
              >
                プライバシーポリシー
              </Link>
              <a 
                href="" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-900 transition-colors text-center sm:text-left"
              >
                お問い合わせ
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;