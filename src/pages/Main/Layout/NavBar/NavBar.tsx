import { AuthContext } from '../../_common/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { useCoinQuote } from '../../../../hooks';


export default function NavBar() {
  const auth = useContext(AuthContext);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { quote, calculateUsdValue, refreshQuote } = useCoinQuote();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBlurred(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="w-full bg-black text-white">
      <ul className="flex justify-between items-center px-2 py-2 mb-0">
        <li className="flex items-center">
          <a href='/' className="flex items-center no-underline">
            <div className="flex items-center">
              <img
                src='/sirch-coin-favicon.ico'
                alt="Sirch Coins Logo"
                className="w-16 h-16 mr-3"
              />
              <span className="text-3xl text-green-500 font-bold mr-2">ⓢ</span>
              <div 
                className="flex items-center gap-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="text-3xl text-green-500 transition-all duration-500 cursor-pointer">
                  {auth?.userInTable && auth?.userBalance && (
                    (isBlurred && !isHovered)
                      ? "••••• / $ •••••" 
                      : (() => {
                          const usdValue = calculateUsdValue(auth.userBalance);
                          return usdValue !== null 
                            ? `${auth.userBalance} / $ ${usdValue.toFixed(2)} USD${quote?.isStale ? ' (stale)' : ''}`
                            : `${auth.userBalance}`;
                        })()
                  )}
                </span>
                {auth?.userInTable && auth?.userBalance && (!isBlurred || isHovered) && (() => {
                  const usdValue = calculateUsdValue(auth.userBalance);
                  return usdValue !== null && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        refreshQuote();
                      }}
                      className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-green-500 transition-colors cursor-pointer bg-transparent border-none p-0"
                      title="Refresh quote"
                      style={{ minWidth: '20px', minHeight: '20px' }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ display: 'block' }}
                      >
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                      </svg>
                    </button>
                  );
                })()}
              </div>
            </div>
          </a>
        </li>
        <li className="text-3xl">
          {auth?.userInTable && auth.userInTable.full_name + " / @" + auth.userInTable.user_handle}
        </li>
      </ul>
    </nav>
  );
}
