import { Delete } from "@mui/icons-material";
import { Box, Typography, useTheme, Tooltip, IconButton } from "@mui/material";
import { ConfirmToast } from "react-confirm-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setPosts,
} from "state/authSlice";
import { deleteDataAPI } from "utils/fetchData";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  isFriendData,
  userImage=true,
}) => {
  console.log(name,"frid");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _id  = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);

  const { palette } = useTheme();
  const main = palette?.neutral?.main;
  const medium = palette?.neutral?.medium;

  const deletePost = async () => {
    const { data } = await deleteDataAPI(`/posts/${postId}`, token);
    dispatch(setPosts({ posts: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        {userImage && <UserImage image={userPicturePath} size="55px" />}
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette?.primary?.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {!isFriendData && friendId === _id ? (
        <ConfirmToast
          asModal={true}
          customCancel={"Cancel"}
          customConfirm={"Confirm"}
          customFunction={deletePost}
          message={"Do you want to delete post?"}
          position={"bottom-left"}
          showCloseIcon={true}
          theme={"snow"}
        >
          <Tooltip title="Delete">
             <IconButton sx={{  p: "0.6rem" }}>
               <Delete />
             </IconButton>
           </Tooltip>
        </ConfirmToast>
      ) : (
        <Box>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Friend;

