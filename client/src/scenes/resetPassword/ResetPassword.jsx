import { useTheme } from "@emotion/react";
import { EditOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import WidgetWrapper from "components/WidgetWrapper";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { putDataAPI } from "utils/fetchData";

export const ResetPassword = () => {
  const theme = useTheme();
  const location = useLocation();
  const code = location.search.split("?")[1];
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      if (!password) {
        toast.error("Enter new password", {
          position: "bottom-center",
        });
      }

      const { data } = await putDataAPI(`/auth/reset-password/?${code}`, {
        password,
      });
      if (data) {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        err?.response?.data?.error.forEach((err) => {
          toast.error(err, {
            position: "bottom-center",
          });
        });
      }
    }
  };

  return (
    <form>
      <MDBContainer className="my-5 main">

        <MDBCard>
          <MDBRow className='g-0 body'>

            <MDBCol md='6'>
              <MDBCardImage src='https://cdn.mos.cms.futurecdn.net/pk2A58d5MnYCSGKAi2mGVS-1200-80.jpg' alt="login form" className='p-5 img-fluid' style={{ objectFit: "cover", height: "100%", width: "100%", display: "inlineblock" }} />
            </MDBCol>

            <MDBCol md='6'>
              <MDBCardBody className='d-flex flex-column mt-5 d-flex align-items-centeryy'>

                {/* <div className='d-flex flex-row mt-2'>
                      <MDBIcon fas icon="fa-doutone fa-hashtag fa-3x me-3" style={{ color: '#ff6219' }} />

                      <span className="h1 fw-bold mb-0">HashTag</span>
                    </div> */}
                {/* { message ? <p style={{color:"green", fontWeight:"bold"}}>Passowrd updated successfully</p> : ""} */}

                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Enter your New Password</h5>
                <Box>
                  <TextField
                    name="password"
                    label="Enter new Password"
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
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

                  <Button onClick={handleClick} type="submit" variant="contained" color="primary" fullWidth>
                    Send
                  </Button>
                  {/* <Link to="/">
                    <Button sx={{ marginTop: "10px" }} type="submit" variant="contained" color="primary" fullWidth>
                      Back to login page
                    </Button>
                  </Link> */}
                </Box>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
      <Toaster />
    </form>
  );
};

export default ResetPassword;
