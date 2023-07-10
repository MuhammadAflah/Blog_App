import { ManageAccountsOutlined } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDataAPI } from "utils/fetchData";
import { setIsEditing } from "state/authSlice";
import { CSVLink } from "react-csv";

const headers = [
  { label: "UserName", key: "username" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Picture_Path", key: "picturepath" },
  { label: "CreatedAt", key: "createdat" },
  { label: "Bio", key: "bio" },


]

const UserWidget = ({
  userId,
  picturePath,
  isEditUser,
}) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const token = useSelector((state) => state?.token);
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const csvDownloadRef = useRef(null)
  const csvData = [
    {
      UserName: userData.username,
      Email: userData.email,
      Name: userData.name,
      picturePath: userData.picturePath,
      CreatedAt: userData.createdAt,
      Bio:userData.bio
    },
  ];


  const handleDownloadClick = async () => {
    try {
      const response = await getDataAPI(`/users/${userId}`, token);
      const userData = response.data.user;

      const csvData = [
        {
          UserName: userData.username,
          Email: userData.email,
          Name: userData.name,
          picturePath: userData.picturePath,
          CreatedAt: userData.createdAt,
          Bio:userData.bio
        },
      ];

      const csvContent = "data:text/csv;charset=utf-8,"
        + Object.keys(csvData[0]).join(",") + "\n"
        + csvData.map(item => Object.values(item).join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "user_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  let handleEditClick = () => {
    dispatch(setIsEditing({ isEditing: true }));
  };

  
  if (!user) {
    return null;
  }
  const { username, name, bio } = user;
  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="0.5rem">
          <UserImage
            image={picturePath}
          // isProfile={!isFriendData && isProfile}
          />
          <Box mb="1rem">
            <Typography
              variant="h4"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette?.primary?.light,
                  cursor: "pointer",
                },
              }}
            >
              {username}
              <Box>
                <Typography>
                  {bio}
                </Typography>
              </Box>
            </Typography>
          </Box>

        </FlexBetween>

        {isEditUser && (
          <ManageAccountsOutlined
            style={{ cursor: "pointer" }}
            onClick={handleEditClick}
          />
        )}
      </FlexBetween>
      {/* <Divider/>
      <Typography>
        {name}
      </Typography> */}
      {!isEditUser && (
        <Box mt="1rem">
          <CSVLink
            data={csvData}
            headers={headers}
            filename="user_data.csv"
            target="_blank"
            ref={csvDownloadRef}
          />
          <Button variant="contained" onClick={handleDownloadClick}>Download User Details</Button>
        </Box>
      )}


    </WidgetWrapper>
  );
};
export default UserWidget;
