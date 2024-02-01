import Navbar from "../components/Navbar";
import {Outlet} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../materialUITheme";
import {Box, Typography} from "@mui/material";

function Layout() {
    return <>
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Box p={3}>
                <Typography variant="h4">Main Content</Typography>
            </Box>
            <Box component="footer" p={3}>
                <Outlet/>
            </Box>
        </ThemeProvider>

    </>
}

export default Layout;