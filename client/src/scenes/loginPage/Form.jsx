import { useState } from "react";
import {
  Box,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUserData } from "state/authSlice";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast, Toaster } from "react-hot-toast";
import { postDataAPI } from "utils/fetchData";
import LoadingButton from "@mui/lab/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import config from "../../utils/config.js"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";

const loginSchema = yup.object().shape({
  emailOrUsername: yup
    .string()
    .test(
      "email-or-username",
      "Please enter a valid email or username",
      function (value) {
        const isEmail = yup.string().email().isValidSync(value);
        const isUsername = /^[a-z0-9A_Z ]+$/.test(value);
        return isEmail || isUsername;
      }
    )
    .required("Email or username is required"),
  password: yup
  .string()
  .required("required")
  .min(6, "Password must be at least 6 characters long")
  .max(20, "Password must be at most 20 characters long")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number"),
});

const initialValuesRegister = {
  username: "",
  email: "",
  password: "",
  picture: "",
};

const initialValues = {
  emailOrUsername: "",
  password: "",
};

const LoginPage = () => {
  const [pageType, setPageType] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";


  const login = async (values, onSubmitProps) => {
    try {
      const { data } = await postDataAPI(`/auth/login`, values);
      const loggedIn = data;
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(
          setLogin({
            token: loggedIn?.token,
          })
        );
        dispatch(
          setUserData({
            user: loggedIn?.user,
          })
        );
        navigate("/home");
      }
    } catch (err) {
      (({ response }) => {
        toast.error(response?.data?.msg, {
          position: "bottom-center",
        });
      })(err);
    }
  };

  return (
    <Formik
      onSubmit={login}
      initialValues={initialValues}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <MDBContainer className="my-5 main">

            <MDBCard>
              <MDBRow className='g-0 body'>

                <MDBCol item md='6'>
                  <MDBCardImage src='https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-blogging_516790-1495.jpg' alt="login form" className='p-5 img-fluid' style={{ objectFit: "cover", height: "100%" }} />
                </MDBCol>

                <MDBCol item md='6'>
                  <MDBCardBody className='d-flex flex-column mt-5 d-flex align-items-centeryy'>

                    <div className='d-flex flex-row mt-2'>
                      <MDBIcon fas icon="fa-doutone fa-rss fa-3x me-3" style={{ color: '#ff6219' }} />
                      {/* <Tag style={{ color: '#ff6219' }} /> */}

                      <span className="h1 fw-bold mb-0">BlogSpot</span>
                    </div>

                    <Typography variant="h5" className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                      Login to your account
                    </Typography>
                    <Box>

                      <TextField
                        label="Email or username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.emailOrUsername}
                        name="emailOrUsername"
                        fullWidth
                        error={
                          Boolean(touched?.emailOrUsername) && Boolean(errors?.emailOrUsername)
                        }
                        helperText={touched?.emailOrUsername && errors?.emailOrUsername}
                        sx={{ gridColumn: "span 4" }}
                      />

                      <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.password}
                        name="password"
                        fullWidth
                        error={Boolean(touched?.password) && Boolean(errors?.password)}
                        helperText={touched?.password && errors?.password}
                        sx={{ gridColumn: "span 4", mt: 3 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Box>
                        <LoadingButton
                          loading={loading}
                          fullWidth
                          type="submit"
                          sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette?.primary?.main,
                            color: palette?.background?.alt,
                            "&:hover": {
                              color: palette?.primary?.main,
                              backgroundColor: palette?.primary?.light
                            },
                            color: "#FFFFFF"
                          }}
                        >
                          Login
                        </LoadingButton>
                        <Box  sx={{display:"flex", justifyContent:"space-between", mb:3}}>
                          <Typography >
                            Dont have an account?{" "}
                            <Link to="/register">
                              Register
                            </Link>
                          </Typography>

                          <Link to="/forgot-password">
                            <Typography
                              sx={{
                                textAlign: "right",
                                textDecoration: "underline",
                                color: palette?.primary?.main,
                                "&:hover": {
                                  cursor: "pointer",
                                  color: palette?.primary?.light,
                                },
                              }}
                            >
                              Forgot Password
                            </Typography>
                          </Link>
                        </Box>

                      </Box>

      
                    </Box>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBContainer>
          <Toaster />
        </form>
      )}
    </Formik>
  );
};

export default LoginPage;