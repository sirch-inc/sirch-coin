import { AuthContext } from '../../_common/AuthContext';
import { useContext } from 'react';


export default function NavBar() {
  const auth = useContext(AuthContext);

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
              <span className="text-3xl text-green-500">
                {auth?.userInTable && auth?.userBalance && (" " + auth.userBalance + " / $ " + (auth.userBalance*0.10).toFixed(2) + " USD")}
              </span>
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
