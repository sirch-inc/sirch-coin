import { Tooltip } from 'react-tooltip'


export default function Header() {
  return (
    <>
      {import.meta.env.DEV &&    
        <header>
          <small><strong>
          <span className="environment-indicator">TEST ENVIRONMENT</span>
          </strong></small>
        </header>
      }
      <Tooltip anchorSelect=".environment-indicator" clickable>
        {import.meta.env.VITE_BUILD_VERSION_VERBOSE}
      </Tooltip>
    </>
  );
}