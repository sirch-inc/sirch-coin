import { AuthContext } from '../../_common/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { useCoinQuote } from '../../../../hooks';
import { RefreshButton } from '../../../../components/HeroUIFormComponents';


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
                    <RefreshButton 
                      onRefresh={() => {
                        refreshQuote();
                      }}
                      className="text-gray-400 hover:text-green-500"
                      title="Refresh quote"
                    />
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
