import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useUserService } from "../context/UserServiceContext";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import LoadingIndicator from "../components/LoadingIndicator";

export const UserProfilePage = () => {
  const { userId, role } = useAuth();
  const userService = useUserService();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (userId) {
      userService.getUserDetails(userId).then((user) => {
        setUserDetails(user);
      });
    }
  }, [userId, userService]);

  if (!userDetails) {
    return <LoadingIndicator isLoading={true} />;
  }

  return (
    <Card sx={{ maxWidth: "md", mx: "auto", mt: 10 }} elevation={12}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: deepOrange[500], width: 56, height: 56 }}>
              {userDetails.firstName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5">
              {userDetails.firstName} {userDetails.lastName}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {userDetails.email}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => {}}>
              Edit
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemText primary="User ID" secondary={userId} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Role" secondary={role} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Birth Date"
              secondary={userDetails.birthDate.toDateString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="About"
              secondary={userDetails.about || "N/A"}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;
