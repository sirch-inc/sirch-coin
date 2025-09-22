import { AuthContext } from '../../_common/AuthContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoinQuote } from '../../../../hooks';
import { RefreshButton } from '../../../../components/HeroUIFormComponents';


export default function NavBar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBlurred, setIsBlurred] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { quote, calculateUsdValue, refreshQuote, isLoading } = useCoinQuote();

  const startBlurTimer = () => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setTimeout(() => {
      setIsBlurred(true);
    }, 30000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Reset timer when user reveals balance
    if (isBlurred) {
      setIsBlurred(false);
      startBlurTimer();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset timer when user stops hovering
    startBlurTimer();
  };

  useEffect(() => {
    startBlurTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <nav className="w-full bg-black text-white">
      <ul className="flex justify-between items-center px-2 py-2 mb-0">
        <li className="flex items-center">
          <div className="flex items-center">
            <img
              src='/sirch-coin-favicon.ico'
              alt="Sirch Coins Logo"
              className="w-16 h-16 mr-3 cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div 
              className="flex items-center gap-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
                <span className="text-3xl text-green-500 transition-all duration-500">
                  {auth?.userInTable && auth?.userBalance && (
                    (isBlurred && !isHovered)
                      ? "••••••••••" 
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
                      isLoading={isLoading}
                      className="text-gray-400 hover:text-green-500"
                      title="Refresh quote"
                    />
                  );
                })()}
              </div>
          </div>
        </li>
        <li className="text-3xl">
          {auth?.userInTable && auth.userInTable.full_name + " / @" + auth.userInTable.user_handle}
        </li>
      </ul>
    </nav>
  );
}
