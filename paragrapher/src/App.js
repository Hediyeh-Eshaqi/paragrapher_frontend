import React, {useState,Modal} from 'react';
import { AppContainer } from "./components/common";
import PopupAccountBox from './components/AccountBox/PopupAccountBox';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import RegisterationForm from './components/RegisterationForm/RegisterationForm';
import Header from './components/Header/Header';
import RegistrationForm from './components/RegisterationForm/RegisterationForm';
import AccountBox from './components/AccountBox/AccountBox';
import { Drawer,List,ListItem,ListItemIcon,ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import Profile from './components/Profile/Profile';
function App() {
  const [drawerAnchor, setDrawerAnchor] = useState(false);
  const [accountBoxTrigger, setAccountBoxTrigger] = useState(false);
  return (
    <Router>
      <div className="App">
        <Header/>
        
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
            <button className="btn btn-danger" id="logout" style={{display: "none"}}>خروج</button> 
              <AppContainer>
              </AppContainer>
              <p>
                
              </p>
            </Route>
            <Route path="/profile" exact={true}>
              <Profile/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )  
}
export default App;