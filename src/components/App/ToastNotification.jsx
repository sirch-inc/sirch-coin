import { ToastContainer } from 'react-toastify';


export const ToastNotification = () => (
  <ToastContainer
    position='top-right'
    autoClose={false}
    newestOnTop={false}
    closeOnClick
    draggable
    theme='colored'
  />
);

// export all the toastify components as well
// eslint-disable-next-line react-refresh/only-export-components
export * from 'react-toastify';
