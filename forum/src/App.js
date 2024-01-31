import './App.css';
import {ThemeProvider} from '@mui/material/styles';
import {Box, List, ListItem, ListItemText, Typography} from "@mui/material";
import theme from './materialUITheme';
import Navbar from "./components/Navbar";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Navbar/>
                <Box p={3}>
                    <Typography variant="h4">Main Content</Typography>
                </Box>

                <List>
                    <ListItem>
                        <ListItemText primary="Item 1"/>
                    </ListItem>
                </List>
                <Box component="footer" p={3}>
                    <Typography variant="body1">My Footer</Typography>
                </Box>
            </ThemeProvider>

            <Routes>
                <Route path={"/"} element={<Typography variant={"body1"}>Home</Typography>}></Route>
                <Route path={"/about"} element={<Typography variant={"body1"}>About</Typography>}></Route>
                <Route path={"/login"} element={<Typography variant={"body1"}>Login</Typography>}></Route>
                <Route path={"/register"} element={<Typography variant={"body1"}>Register</Typography>}></Route>
            </Routes>
        </BrowserRouter>


    );
}

export default App;
