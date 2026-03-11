import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCart,
  loginUser,
  logoutUser,
  setAuthToken,
} from "../services/api";

const AppContext = createContext({
  isAuthenticated: false,
  cartCount: 0,
  isCartLoading: false,
  login: async () => { },
  logout: async () => { },
  refreshCart: async () => { },
});

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("velora_token") : null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    setIsCartLoading(true);
    try {
      const cart = await getCart();
      const products = cart?.products ?? [];
      const totalCount = products.reduce(
        (sum, item) => sum + Math.max(1, Number(item.quantity) || 0),
        0,
      );
      setCartCount(totalCount);
    } catch (error) {
      setCartCount(0);
    } finally {
      setIsCartLoading(false);
    }
  }, [token]);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      setIsAuthenticated(true);
      refreshCart();
    } else {
      setIsAuthenticated(false);
      setCartCount(0);
    }
  }, [token, refreshCart]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "velora_token") {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(
    async (values) => {
      const data = await loginUser(values);
      const newToken = data.accessToken;
      if (newToken) {
        localStorage.setItem("velora_token", newToken);
        setToken(newToken);
      }
      return data;
    },
    [setToken],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      // ignore logout errors
    }
    localStorage.removeItem("velora_token");
    setToken(null);
    setCartCount(0);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      cartCount,
      isCartLoading,
      login,
      logout,
      refreshCart,
    }),
    [isAuthenticated, cartCount, isCartLoading, login, logout, refreshCart],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
