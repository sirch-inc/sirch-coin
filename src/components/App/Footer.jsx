export default function Footer() {
  return (
    <>
      <footer>
        <small><strong>
        Copyright © 2024 Sirch Inc. All Rights Reserved.  
        <span>
          {"  " + import.meta.env.VITE_BUILD_VERSION}
        </span>
        </strong></small>
      </footer>
    </>
  );
}