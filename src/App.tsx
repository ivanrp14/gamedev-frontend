import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./components/pages/Home/Home";
import { Footer } from "./components/Footer/Footer";
import { SignUp } from "./components/pages/Signup/Signup";
import { Login } from "./components/pages/Login/Login";
import { Main } from "./components/pages/Home/Main";
import NavBar from "./components/NavBar/NavBar";
import Tutorial from "./components/pages/Tutorial/Tutorial";
import RedirectToProperPage from "./hooks/Redirect";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import Leave from "./components/pages/Tutorial/Leave";
import GoogleCallback from "./hooks/GoogleCallback";
import GithubCallback from "./hooks/GithubCallback";
import { AuthProvider } from "./hooks/AuthProvider";
import MyStats from "./components/pages/MyStats/MyStats";
import { UserProfile } from "./components/pages/UserProfile/UserProfile";
import { AuthRedirector } from "./hooks/AuthRedirector";
import ChooseAvatar from "./components/pages/ChooseAvatar/ChooseAvatar";

function MainContent() {
  const location = useLocation();

  const showNavbarPaths = [
    "/main",
    "/mystats",
    "/about",
    "/marble",
    "/leave",
    "/user",
  ];
  const showNavbar = showNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showNavbar && <NavBar />}
      <AuthRedirector />
      <Routes location={location} key={location.pathname}>
        {/* Ruta raíz redirige según estado auth */}
        <Route path="/" element={<RedirectToProperPage />} />

        {/* Rutas públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rutas protegidas */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mystats"
          element={
            <ProtectedRoute>
              <MyStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <Leave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/choose-avatar"
          element={
            <ProtectedRoute>
              <ChooseAvatar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marble"
          element={
            <ProtectedRoute>
              <Tutorial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 opcional */}
        <Route
          path="*"
          element={<h1 style={{ textAlign: "center" }}>404 - Not Found</h1>}
        />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
      </Routes>
    </>
  );
}
function App() {
  return (
    <AuthProvider>
      <div className="app-wrapper">
        <MainContent />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
