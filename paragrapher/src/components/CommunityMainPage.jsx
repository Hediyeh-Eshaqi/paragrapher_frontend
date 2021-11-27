import {
  Typography,
  Button,
  Grid,
  ButtonGroup,
  TextField,
  ThemeProvider,
  Avatar,
  Hidden,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  AppBar,
  Paper,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, { Component } from "react";
import { theme } from "./theme";
import communityBgImage from "../assets/CommunityTestBg.png";
import Paragraph from "./Paragraph/Paragraph";
class CommunityMainPage extends React.Component {
  state = {
    tabValue: 0,
    allParagraphs: [],
    bio: "",
    bestParagraphs: [],
    backgroundURL: "",
    avatarURL: "",
  };
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <div
            style={{ position: "relative", height: "calc(25vh + 15vw + 10vh)" }}
          >
            <div
              style={{
                height: "calc(25vh + 15vw)",
                width: "100%",
                backgroundImage: `url(${communityBgImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                position: "absolute",
                top: "0",
                right: "0",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "calc(25vh + 15vw - 10vh)",
                right: "0",
                width: "100%",
                padding: "0 10vw",
              }}
            >
              <Grid container>
                <Grid item xs={8}>
                  <div style={{ width: "100%" }}>
                    <Avatar
                      src={communityBgImage}
                      style={{ height: "20vh", width: "20vh" }}
                    />
                  </div>
                </Grid>
                <Grid item xs={4} style={{ maxHeight: "20vh" }}>
                  <ButtonGroup
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "12vh", float: "left" }}
                  >
                    <Button style={{ fontFamily: "BYekan" }}>عضویت</Button>
                    <Button>
                      <NotificationsIcon />
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </div>
          </div>
          <div style={{ padding: "1vh 10vw" }}>
            <Grid container spacing={2}>
              <div style={{ width: "100%" }}>
                <Paper
                  style={{
                    width: "100%",
                    padding: "3vh 3vw 0 3vw",
                    marginTop: "2vh",
                  }}
                >
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item lg={6} md={6} xs={6}>
                        <Grid container spacing={2}>
                          <Grid item lg={12} md={12} xs={12}>
                            <Typography
                              style={{
                                fontFamily: "BYekan",
                                fontWeight: "Bold",
                                fontSize: "20px",
                              }}
                            >
                              کامیونیتی تست
                            </Typography>
                          </Grid>
                          <Grid item lg={12} md={12} xs={12}>
                            <Typography style={{ fontFamily: "BYekan" }}>
                              10000 عضو
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={6} md={6} xs={6}></Grid>
                    </Grid>
                  </Grid>
                  <Tabs
                    centered
                    indicatorColor="primary"
                    value={this.state.tabValue}
                  >
                    <Tab
                      label="خانه"
                      style={{ fontFamily: "BYekan" }}
                      onClick={() => this.setState({ tabValue: 0 })}
                    />
                    <Tab
                      label="پاراگراف ها"
                      style={{ fontFamily: "BYekan" }}
                      onClick={() => this.setState({ tabValue: 1 })}
                    />
                    <Tab
                      label="فروشگاه"
                      style={{ fontFamily: "BYekan" }}
                      onClick={() => this.setState({ tabValue: 2 })}
                    />
                    <Tab
                      label="درباره ما"
                      style={{ fontFamily: "BYekan" }}
                      onClick={() => this.setState({ tabValue: 3 })}
                    />
                  </Tabs>
                </Paper>
                <Box p={3} hidden={this.state.tabValue != 0}>
                  <div style={{ padding: "0 10vw" }}>
                    {this.state.bestParagraphs.map((bp) => (
                      <Paragraph
                        author={bp.author}
                        isPotd={false}
                        date={bp.date}
                        avatar="ا"
                        canAction={true}
                        text={bp.text}
                      />
                    ))}
                  </div>
                </Box>
                <Box p={3} hidden={this.state.tabValue != 1}>
                  <div style={{ padding: "0 10vw" }}>
                    {this.state.allParagraphs.map((p) => (
                      <Paragraph
                        author={p.author}
                        isPotd={false}
                        date={p.date}
                        avatar="ا"
                        canAction={true}
                        text={p.text}
                      />
                    ))}
                  </div>
                </Box>
                <Box p={3} hidden={this.state.tabValue != 3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography style={{ fontFamily: "BYekan" }}>
                          {this.state.bio}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Box>
              </div>
            </Grid>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default CommunityMainPage;