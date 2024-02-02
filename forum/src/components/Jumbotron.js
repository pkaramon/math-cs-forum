import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import backgroundImage from "../img/pi.png";
import routes from "../routes"; // adjust the path as needed

const Jumbotron = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: isMobile ? "50vh" : "93.34vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: { lg: "fixed" },
      }}
    >
      <Card sx={{ maxWidth: 500, backgroundColor: "white" }} elevation={24}>
        <CardContent>
          <Typography variant="h4" component="h1">
            Welcome to the Computer Science and Mathematics Forum
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is a place for enthusiasts and professionals to discuss, learn,
            and share knowledge about computer science and mathematics. Whether
            you're a student, a researcher, or a professional in the field,
            you'll find a wealth of resources and a community of like-minded
            individuals here.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" href={routes.login}>
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href={routes.about}
            sx={{ ml: 2 }}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Jumbotron;
