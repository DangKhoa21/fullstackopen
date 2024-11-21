const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={`notif ${type}`}>{message}</div>;
};

export default Notification;
