import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "scenes/homePage/HomePage";
import LoginPage from "scenes/loginPage/Form";
import ProfilePage from "scenes/profilePage/ProfilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import useOnline from "utils/useOnline";
import ForgotPassword from "scenes/ForgotPassword/ForgotPassword";
import ResetPassword from "scenes/resetPassword/ResetPassword";
import ErrorPage from "scenes/ErrorPage/ErrorPage";
import RegistrationForm from "scenes/RegisterPage/Form";


function App() {
  // const mode = useSelector((state) => state?.mode);
  const theme = useMemo(() => createTheme(themeSettings()));
  const isAuth = Boolean(useSelector((state) => state?.token));

  const isOnline = useOnline();
  if (!isOnline)
    return (
      <>
        <Typography
          variant="h4"
          sx={{
            color: theme?.palette?.error?.main,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          You are offline. Please check your internet connection and try again.
        </Typography>
      </>
    );

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <HomePage /> : <LoginPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
 
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;