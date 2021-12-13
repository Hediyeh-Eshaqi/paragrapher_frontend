/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import rtl from "jss-rtl";
import {
  TextField,
  Typography,
  Switch,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
} from "@material-ui/core";
import { theme } from "../theme";
import { ThemeProvider } from "@material-ui/styles";
import { jssPreset } from "@material-ui/styles";
import { menuItemClasses } from "@mui/material";
import Button from "@material-ui/core/Button";
import {
  // CreateComment,
  CreateParagraph,
  EditParagraph,
  GetParagraph,
} from "../../Utils/Connection";
import Chip from "@material-ui/core/Chip";
import { useParams } from "react-router";
import { withRouter } from "react-router";
import references from "../../assets/References.json";
import { getUser, makeURL } from "../../Utils/Common";
import axios from "axios";
import Paragraph from "./Paragraph";
class ParagraphCommentor extends React.Component {
  state = {
    isShown: true,
    comIsVisible: false,
    communityName: "",
    author: "",
    book: "",
    paragraph: "",
    tag: "",
    tags: [],
    error: false,
    helperText: "",
    p_id: "",
    user: "",
    paragraph2: "",
    date: "2020-10-12",
  };
  async componentDidMount() {
    // console.log(this.props.match.params);
    // this.props.history.
    // console.log("this is a mother fucker", window.location.toString());
    console.log(this);
    var splitted = window.location.toString().split("/");
    await this.setState({ p_id: splitted.pop() });
    await this.setState({ communityName: splitted.pop() });
    console.log(this);

    // if (this.props.p_id) {
    //   this.setState({ p_id: this.props.p_id });
    // }
    // if (this.props.book) {
    //   this.setState({ book: this.props.book });
    // }
    // if (this.props.author) {
    //   this.setState({ author: this.props.author });
    // }
    // if (this.props.paragraph) {
    //   this.setState({ paragraph: this.props.paragraph });
    // }
    // if (this.props.tags) {
    //   this.setState({ tags: this.props.tags });
    // }
    // if (this.props.community) {
    //   this.setState({ community: this.props.community });
    //   this.setState({ comIsVisible: false });
    // }
    // if (this.props.isShown) {
    //   this.setState({ isShown: this.props.isShown });
    // }
    await this.loadData(this.state.communityName, this.state.p_id.toString());
  }
  loadData = async (communityName, p_id) => {
    await axios
      .patch(
        makeURL(
          references.url_create_paragraph + "/" + communityName + "/paragraph"
        ),
        {
          p_id: p_id,
        }
      )
      .then((response) => {
        console.log(response);
        this.setState({ communityName: response.data.community_name });
        this.setState({ author: response.data.author });
        this.setState({ book: response.data.ref_book });
        this.setState({ tags: response.data.tags.split(",") });
        this.setState({ paragraph: response.data.p_text });
        this.setState({ user: response.data.user_name });
        this.setState({ date: response.data.date });
      })
      .catch((error) => {
        window.alert(error);
        window.history.back();
      });
  };
  handleCreateParagraph = () => {
    // CreateComment(
    //   this.state.communityName,
    //   this.state.paragraph2,
    //   this.state.p_id
    // );
  };
  handleParagraphChange = (e) => {
    this.setState({ paragraph2: e.target.value });
  };
  render() {
    return (
      <div
        className={this.props.classes.paragraphDiv}
        style={{ minHeight: "86.3vh" }}
      >
        <ThemeProvider theme={theme}>
          <Paragraph
            user={this.state.user}
            date={this.state.date}
            text={this.state.paragraph}
            author={this.state.author}
            book={this.state.book}
            tags={this.state.tags}
            communityName={this.state.communityName}
          />
          <Card style={{ padding: "4vh 4vh" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      lg={4}
                      md={4}
                      xs={12}
                      style={{ marginBottom: "2vh" }}
                    >
                      <Typography>
                        کامیونیتی : {this.state.communityName}
                      </Typography>

                      {/* <FormControl disabled style={{ width: "100%" }}>
                        <InputLabel id="community-name">کامیونیتی</InputLabel>
                        <Select
                          id="community-name"
                          onChange={this.handleCommunity}
                          value={this.state.communityName ?? ""}
                        >
                          <MenuItem value="اول">اول</MenuItem>
                          <MenuItem value="دوم">دوم</MenuItem>
                          <MenuItem value="سوم">سوم</MenuItem>
                        </Select>
                      </FormControl> */}
                    </Grid>
                    {/* <Grid item lg={8} md={8} xs={0} />
                    <Grid item lg={3} md={3} xs={12}>
                      <Typography>نوع پاراگراف: </Typography>
                    </Grid> */}
                    {/* <Grid item lg={5} md={5} xs={12}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          lg={3}
                          md={3}
                          xs={3}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <Typography>کتابی</Typography>
                        </Grid>
                        <Grid
                          item
                          lg={3}
                          md={3}
                          xs={3}
                          style={{ textAlign: "center" }}
                        >
                          <Switch
                            onChange={() => {
                              this.setState({ isShown: !this.state.isShown });
                              this.setState({ book: "" });
                              this.setState({ author: "" });
                            }}
                            checked={this.state.isShown}
                          />
                        </Grid>
                        <Grid
                          item
                          lg={3}
                          md={3}
                          xs={3}
                          style={{ textAlign: "center" }}
                        >
                          <Typography style={{ top: "50%" }}>شخصی</Typography>
                        </Grid>
                      </Grid>
                    </Grid> */}
                  </Grid>
                </Grid>
                {/* {this.state.isShown ? (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          variant="filled"
                          label="نام کتاب"
                          style={{
                            direction: "rtl",
                            textAlign: "right",
                            width: "100%",
                          }}
                          onChange={this.handleBookChange}
                          value={this.state.book}
                          inputProps={{
                            textAlign: "right",
                            fontFamily: "BYekan",
                          }}

                          // InputLabelProps={{
                          //   classes: {
                          //     root: this.props.classes.labelRoot,
                          //     shrink: this.props.classes.shrink,
                          //   },
                          // }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          variant="filled"
                          label="نام نویسنده"
                          value={this.state.author}
                          onChange={this.handleAuthorChange}
                          style={{ width: "100%" }}
                          // InputLabelProps={{
                          //   classes: {
                          //     root: this.props.classes.labelRoot,
                          //     shrink: this.props.classes.shrink,
                          //   },
                          // }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )} */}
                <Grid item xs={12}>
                  <TextField
                    label="متن پاراگراف"
                    multiline
                    minRows={4}
                    style={{ width: "100%" }}
                    onChange={this.handleParagraphChange}
                    value={this.state.paragraph2}
                    variant="filled"
                  />
                </Grid>
                {/* <Grid item xs={6} lg={3}>
                  <TextField
                    error={this.state.error}
                    label="تگ"
                    value={this.state.tag}
                    onChange={this.handleTagChange}
                    variant="filled"
                    helperText={this.state.helperText}
                  />
                </Grid>
                <Grid item xs={6} lg={3}>
                  <Button
                    variant="contained"
                    size="large"
                    style={{
                      maxWidth: "100%",
                    }}
                    color="primary"
                    onClick={this.handleCreateTag}
                  >
                    افزودن تگ
                  </Button>
                </Grid>
                <Grid item lg={6} xs={12}>
                  {Array.isArray(this.state.tags)
                    ? this.state.tags.map((e) => {
                        return (
                          <Chip
                            variant="default"
                            className={this.props.classes.typography}
                            color="secondary"
                            style={{ margin: "0.3rem 0.2rem 0 0" }}
                            size="small"
                            label={e}
                            onDelete={this.handleDelete(e)}
                            key={e}
                          />
                        );
                      })
                    : ""}
                </Grid>
                <Grid item xs={0} lg={5}></Grid>
                <Grid item xs={0} lg={5}></Grid> */}
                <Grid item xs={12} lg={2} style={{ padding: "2vh 2vh" }}>
                  <Button
                    variant="contained"
                    size="large"
                    style={{
                      minWidth: "100%",
                    }}
                    color="secondary"
                    onClick={this.handleCreateParagraph}
                  >
                    ثبت
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </ThemeProvider>
      </div>
    );
  }
}

export default ParagraphCommentor;
