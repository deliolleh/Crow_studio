import { useLocation } from "react-router-dom";

const RedirectServer = () => {
  const location = useLocation();
  const { url } = location.state;
  if (url) {
    window.location.href = url;
  }
  return null;
};

export default RedirectServer;
