import {
  Typography,
  Button,
  Grid,
  ButtonGroup,
  TextField,
  ThemeProvider,
  Avatar,
} from "@material-ui/core";
import React, { Component } from "react";
import { theme } from "./theme";
import communityBgImage from "../assets/CommunityTestBg.png";
class CommunityMainPage extends React.Component {
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
                    style={{ marginTop: "12vh" }}
                  >
                    <Button>One</Button>
                    <Button>Two</Button>
                    <Button>Three</Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </div>
          </div>
          <div style={{ padding: "1vh 10vw" }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item lg={6} md={6} xs={6}>
                    <Grid container>
                      <Grid item>
                        <Typography>کامیونیتی تست</Typography>
                      </Grid>
                      <Grid item>
                        <Typography>10000 عضو</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={6} md={6} xs={6}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
                  استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و
                  مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی
                  تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای
                  کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و
                  آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم
                  افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص
                  طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این
                  صورت می توان امید داشت که تمام و دشواری موجود در ارائه
                  راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل
                  حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای
                  موجود طراحی اساسا مورد استفاده قرار گیرد.
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div></div>
        </div>
      </ThemeProvider>
    );
  }
}

export default CommunityMainPage;
