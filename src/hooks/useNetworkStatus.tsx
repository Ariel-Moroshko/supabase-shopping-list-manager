import { useSyncExternalStore } from "react";

const getNetworkStatusSnapshot = () =>
  navigator.onLine ? "online" : "offline";
const subscribeToNetworkStatus = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};
const getServerSnapshot = () => "online";

export function useNetworkStatus() {
  return useSyncExternalStore(
    subscribeToNetworkStatus,
    getNetworkStatusSnapshot,
    getServerSnapshot,
  );
}
