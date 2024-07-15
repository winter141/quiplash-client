import {createTheme} from "@mui/material";
import {deepOrange, yellow, red, blue, grey} from "@mui/material/colors";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#FFDE59",
            dark: "#FFDF59"
        },
        secondary: {
            main: "#FBE590",
        },
        info: {
            main: "#000000"
        }
    },
    components: {
        MuiTextField: {
            defaultProps: {
                color: "info"
            },
        }
    }
});