export default function Header() {
  return (
    <>
      {import.meta.env.DEV &&
        <header>
          <small><strong>
          {import.meta.env.VITE_BUILD_VERSION_VERBOSE} DEV
          </strong></small>
        </header>
      }
    </>
  );
}