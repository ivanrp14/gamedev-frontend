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
  login: () => Promise<void>; // ya no requiere argumentos
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await apiClient.get("/auth/me"); // obtiene usuario logueado
      const fetchedUser = await apiClient.get(
        `/users/user-profile/${data.username}`
      );
      setUser(User.fromApiResponse(fetchedUser));
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // consulta al backend al cargar
  }, []);

  const login = async () => {
    // login ahora solo refresca el usuario después de apiClient.login
    await fetchUser();
  };

  const logout = async () => {
    await apiClient.post("/auth/logout"); // borra cookie en backend
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
