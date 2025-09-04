import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../../interfaces/User";
import { apiClient } from "./ApiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // solo para estado de sesión inicial
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // solo durante init

  const fetchUser = async () => {
    try {
      const data = await apiClient.get("/auth/me");
      const fetchedUser = await apiClient.get(
        `/users/user-profile/${data.username}`
      );
      setUser(User.fromApiResponse(fetchedUser));
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // inicializa sesión si hay cookie/token
  useEffect(() => {
    const init = async () => {
      try {
        await fetchUser();
      } catch {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async () => {
    // espera a que cookie/token ya esté lista tras apiClient.login()
    setLoading(true);
    await fetchUser();
  };

  const logout = async () => {
    await apiClient.post("/auth/logout");
    setUser(null);

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
