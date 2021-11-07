import React, { Component, useState } from "react";
import { Grid, Paper, Hidden, Switch } from "@material-ui/core";
import { BrowserView, MobileView } from "react-device-detect";
import { theme, useStyles } from "../theme";
function MainPage() {
  const classes = useStyles(theme);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <>
      <Switch
        checked={darkMode}
        onChange={() => {
          setDarkMode(!darkMode);
        }}
        name="darkModeSwitch"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
      <Grid container spacing={2} justify="center">
        <Hidden xsDown>
          <Grid item lg={4} md={4} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper style={{ height: 375, width: "100%" }} />
              </Grid>
              <Grid item xs={12}>
                <Paper style={{ height: 375, width: "100%" }} />
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
        <Grid item lg={8} md={8} xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                style={{ height: 275, width: "100%" }}
                className={darkMode ? classes.paperDark : classes.paperLight}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper style={{ height: 675, width: "100%" }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default MainPage;
