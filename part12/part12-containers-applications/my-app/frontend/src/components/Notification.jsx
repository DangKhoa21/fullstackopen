import { useContext } from "react";
import { Snackbar, Alert } from '@mui/material';
import NotificationContext from "../contexts/NotificationContext";

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  const { message, type } = notification;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    notificationDispatch({ type: 'CLEAR' }); // Clear notification on close
  };

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
