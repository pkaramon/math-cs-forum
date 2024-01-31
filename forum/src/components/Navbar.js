import React, {useState} from 'react';
import {
    AppBar,
    Button,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import routes from "../routes";

function Navbar() {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        setMobileDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setMobileDrawerOpen(false);
    };

    const pageProps = [
        {to: routes.home, text: "Home"},
        {to: routes.about, text: "About"},
        {to: routes.login, text: "Login"},
        {to: routes.register, text: "Register"},
    ]

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={handleDrawerClose}
        >
            <div style={{width: 250}}>
                <List>
                    {pageProps.map(({to, text}) => (
                        <ListItemButton key={to} onClick={handleDrawerClose}>
                            <ListItemText primary={text}/>
                        </ListItemButton>
                    ))}
                </List>
            </div>
        </Drawer>
    );


    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon/>
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap style={{flexGrow: 1}}>
                        My Website
                    </Typography>
                    {!isMobile && (
                        <div>
                            {pageProps.map(({text, to}) =>
                                <Button href={to} color="inherit">{text}</Button>
                            )}

                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </div>
    );
}

export default Navbar;
