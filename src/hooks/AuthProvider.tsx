import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../interfaces/User";
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>; // ⬅️ nuevo
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetchUser(token);
    }
  };

  const fetchUserProfile = async (username: string) => {
    try {
      const response = await fetch(
        `https://api.gamedev.study/users/user-profile/${username}`
      );

      if (!response.ok) {
        throw new Error("Invalid username or user not found");
      }

      const data = await response.json();
      console.log("User profile fetched:", data);
      const fetchedUser = User.fromApiResponse(data);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };
  // Función para obtener user desde /auth/me
  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("https://api.gamedev.study/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();
      fetchUserProfile(data.username);

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Restaurar sesión al montar el provider
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // En AuthProvider
  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    await fetchUser(token); // 👈
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
