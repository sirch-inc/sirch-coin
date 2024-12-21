import { Tooltip } from 'react-tooltip'


export default function Footer() {
  return (
    <footer>
      <small><strong>
        Copyright © 2024 The Sirch Engine, Inc. All Rights Reserved.&nbsp;
        <a className='footer-link' href='/contact-us'>Contact Us</a>&nbsp;
        <a className='footer-link' href='/terms-of-service'>Terms</a>

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