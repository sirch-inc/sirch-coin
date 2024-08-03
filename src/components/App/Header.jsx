export default function Header() {
  return (
    <>
      {import.meta.env.DEV &&
        <header>
          <small><strong>
          <span>{import.meta.env.VITE_BUILD_VERSION_VERBOSE} DEV</span>
          </strong></small>
        </header>
      }
    </>
  );
}