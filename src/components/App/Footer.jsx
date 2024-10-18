import { Tooltip } from 'react-tooltip'


export default function Footer() {
  return (
    <footer>
      <small><strong>
        Copyright © 2024 Sirch Inc. All Rights Reserved.  
        <span className='environment-indicator'>
          {"  " + import.meta.env.VITE_BUILD_VERSION}
        </span>
        {
          import.meta.env.MODE !== 'production' &&    
            <span>
              { " (" + import.meta.env.MODE.toUpperCase() + ")" }
            </span>
        }
      </strong></small>

      <Tooltip anchorSelect='.environment-indicator' clickable>
        {import.meta.env.VITE_BUILD_VERSION_VERBOSE}
      </Tooltip>
    </footer>
  );
}