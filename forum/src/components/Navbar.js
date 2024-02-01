import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import routes from "../routes";
import SearchBar from "./SearchBar";

function Navbar() {
  const [_, setMobileMoreAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleDrawerOpen = () => {
    setMobileDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const pageProps = [
    { to: routes.home, text: "Home" },
    { to: routes.about, text: "About" },
    { to: routes.login, text: "Login" },
    { to: routes.register, text: "Register" },
  ];

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Drawer anchor="left" open={mobileDrawerOpen} onClose={handleDrawerClose}>
      <List style={{ width: "250px" }}>
        {pageProps.map(({ to, text }) => (
          <ListItemButton key={to} onClick={handleDrawerClose} href={to}>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );

  const appBarSx = {
    paddingLeft: { xs: 0, md: 15 },
    paddingRight: { xs: 0, md: 15 },
  };

  return (
    <div>
      <AppBar position="fixed" sx={appBarSx}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            &pi; and bytes
          </Typography>

          {!isMobile && <SearchBar />}
          {!isMobile && (
            <div>
              {pageProps.map(({ text, to }) => (
                <Button key={to} href={to} color="inherit">
                  {text}
                </Button>
              ))}

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Paper></Paper>

      {renderMobileMenu}
      {isMobile && (
        <Box
          sx={{
            borderRadius: 0,
            backgroundColor: "primary.main",
          }}
        >
          <SearchBar />
        </Box>
      )}
    </div>
  );
}

export default Navbar;
