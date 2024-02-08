export default function NavBar() {
  return (
    <>
      <ul className="navbar">
        <li className="navbar-item">
          <a href="/">
            <img
              src="/sirch_logo.png"
              alt="Sirc Logo"
              style={{ width: "60px", height: "auto" }}
            />
          </a>
        </li>
        <li className="navbar-item">
          <a href="/"> SirchCoin </a>
        </li>
        <li>
          <a href="login">Login</a>
        </li>
      </ul>
    </>
  );
}
