import {createTheme} from '@mui/material/styles';
import {LinkBehavior} from "./router";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1565C0',
            light: '#5E92F3',
            dark: '#003C8F',
        },
        secondary: {
            main: '#FF8F00',
            light: '#FFC046',
            dark: '#C56000',
        },
        error: {
            main: '#D32F2F',
        },
        background: {
            default: '#F5F5F5',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    }
});

export default theme;
