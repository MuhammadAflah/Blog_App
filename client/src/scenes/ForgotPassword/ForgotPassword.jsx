import { useTheme } from "@emotion/react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { postDataAPI } from "utils/fetchData";

export const ForgotPassword = () => {
  const theme = useTheme();
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      if (email === "") {
        toast.error("email is required", {
          position: "bottom-center",
        });
      } else if (!email.includes("@")) {
        toast.warning("includes @ in your email!", {
          position: "bottom-center",
        });
      } else {
        const { data } = await postDataAPI(`/auth/forgot-password`, {
          email,
        });
        if(data){
          setIsVerified(true);
          setEmail("");
        }
      }
    } catch (err) {
       (({ response }) => {
        toast.error(response?.data?.message, {
          position: "bottom-center",
        });
      })(err);
    }
  };

  return !isVerified ? (
    <form>
    <MDBContainer className="my-5 main">

            <MDBCard>
              <MDBRow className='g-0 body'>

                <MDBCol md='6'>
                  <MDBCardImage src='https://cdn.mos.cms.futurecdn.net/pk2A58d5MnYCSGKAi2mGVS-1200-80.jpg' alt="login form" className='p-5 img-fluid' style={{ objectFit: "cover", height: "100%", width: "100%", display: "inlineblock" }} />
                </MDBCol>

                <MDBCol md='6'>
                  <MDBCardBody className='d-flex flex-column mt-5 d-flex align-items-centeryy'>

                    <div className='d-flex flex-row mt-2'>
                      <MDBIcon fas icon="fa-doutone fa-hashtag fa-3x me-3" style={{ color: '#ff6219' }} />

                      <span className="h1 fw-bold mb-0">HashTag</span>
                    </div>
                    {/* { message ? <p style={{color:"green", fontWeight:"bold"}}>Passowrd updated successfully</p> : ""} */}

                    <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Enter your New Password</h5>
                    <Box>
                      <TextField
                        name="email"
                        label="Enter your email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        
                      />
                      
                      <Button onClick={handleClick} type="submit" variant="contained" color="primary" fullWidth>
                        Send
                      </Button>
                      <Link to="/">
                      <Button sx={{marginTop:"10px"}}  type="submit" variant="contained" color="primary" fullWidth>
                        Back to login page
                      </Button>
                      </Link>
                    </Box>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBContainer>
          <Toaster />
        </form>
  ) : (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>URL has sended to your email,Check email and Go to the URL</h2>
    </div>
  );
};

export default ForgotPassword;
