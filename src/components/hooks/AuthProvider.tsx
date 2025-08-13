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
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (username: string) => {
    const data = await apiClient.get(`/users/user-profile/${username}`);
    return User.fromApiResponse(data);
  };

  const fetchUser = async () => {
    try {
      const data = await apiClient.get("/auth/me");
      const fetchedUser = await fetchUserProfile(data.username);
      setUser(fetchedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetchUser();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, refreshUser }}
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
