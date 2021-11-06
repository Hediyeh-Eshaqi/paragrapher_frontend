import { alpha, createTheme, makeStyles } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    primary: { main: "#606C38", textColor: "#283618" },
    secondary: { main: "#DDA15E" },
  },
});

export const useStyles = makeStyles((theme) => ({
  typography: {
    fontFamily: '"BYekan"',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    alignItems: "center",
    display: "inline-block",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 10,
    width: "auto",
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(6),
      marginLeft: theme.spacing(0),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0.9, 1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
  },
  inputRoot: {
    fontFamily: '"BYekan"',
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 5, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  icons: {
    padding: theme.spacing(0, 0, 0, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(em + ${theme.spacing(0)}px)`,
    transition: theme.transitions.create("width"),
    width: "auto",
    [theme.breakpoints.up("md")]: {
      width: "auto",
    },
    display: "flex",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));
