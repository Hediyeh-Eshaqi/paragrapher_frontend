import React from "react";
import CreatecommunityPic1 from "../../assets/CreatecommunityPic1.png";
import CreatecommunityPic2 from "../../assets/CreatecommunityPic2.svg";
import miniPic1 from "../../assets/miniPic1.svg";
import miniPic2 from "../../assets/miniPic2.svg";
import miniPic3 from "../../assets/miniPic3.svg";
import CommunityExamples from "./CommunityExamples";
import axios from "axios";
import { makeURL } from "../../Utils/Common";
import references from "../../assets/References.json";
class CreateCommunity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {check:"0",
    name:"",
    bio:"",
    password:"",
    passwordConfirm:"",
    isPublic:0,
    };
  }

  componentDidMount() {
    
  }
  CreateCommunity = async () => {
    document.getElementById("bioErr").innerHTML=""
    document.getElementById("nameErr").innerHTML=""
    let message = ""
    if (this.state.bio=="") {
        document.getElementById("bioErr").innerHTML="بیو نمیتواند خالی باشد"
    }
    else{
        
        await axios
            .post(makeURL(references.url_create_community), {
                name:this.state.name,
                bio:this.state.bio
            })
            .then((response) => {
                //window.alert(response)
                console.log(response)
                window.location.replace("/profile");
            })
            .catch((error) => {
                
                console.log(error,"&&&&&", error.response.data.message,"####");
                if ("A community with the same Name already exist. "==error.response.data.message) {
                    document.getElementById("nameErr").innerHTML="کامیونیتی دیگری با این نام وجود دارد، لطفا نام دیگری انتخاب کنید"
                }
                if(error.response.status == 401) {
                    message = error.response.data.message;
                } else {
                    message = error.response.data;
                }
            })
    }
    
    return message;
}
  Checkbox(){
    if(this.state.check==="0"){
        document.getElementById("communityPassConfirm").style.display="none";
        document.getElementById("confirmLable").style.display="none";
        document.getElementById("communityPass").style.display="none";
        document.getElementById("PassLable").style.display="none";
        this.setState({ check: "1" });
    }
    if(this.state.check==="1"){
        document.getElementById("communityPassConfirm").style.display="block";
        document.getElementById("confirmLable").style.display="block";
        document.getElementById("communityPass").style.display="block";
        document.getElementById("PassLable").style.display="block";
        this.setState({ check: "0" });
    }
      
  }

  render() {
    return (
        <div className="container">
            <div className="row">
                <br/>
                <br/>
                <p/>
                <br/>
                <br/>
                <p/>
                <p/>
            </div>
            <div className="row align-items-center">
                <div className="col-md-5 mb-md-0 mb-5 pb-md-0 pb-3"><img className="w-100 mx-md-0 mx-auto w3-animate-zoom" src={CreatecommunityPic1} alt="Illustration"/></div>
                <div className="col-lg-6 offset-lg-1 col-md-7 text-md-start text-center">
                    <div className="mx-md-0 mx-auto" >
                        <h2 className="mb-md-5 mb-4">چرا باید کامیونیتی بسازیم؟</h2>
                    
                        <div className="d-md-flex align-items-start d-block mb-4 pb-2"><img className="me-md-4 mb-md-0 mb-4" src={miniPic1} alt="Icon"/>
                            <div className="ps-md-2">
                                <h3 className="h6 mb-2">اشتراک گزاری پاراگراف</h3>
                                <p className="mb-0 fs-sm">با ساخت کامیونیتی شما میتوانید با دوستان خود پاراگراف های خود را به اشتراک بگذارید و منبعی از پاراگراف های خاص را جمع آوری کنید</p>
                            </div>
                        </div>
                
                        <div className="d-md-flex align-items-start d-block mb-4 pb-2"><img className="me-md-4 mb-md-0 mb-4" src={miniPic2} alt="Icon"/>
                            <div className="ps-md-2">
                                <h3 className="h6 mb-2">رقابت با سایر کامیونیتی ها</h3>
                                <p className="mb-0 fs-sm">شما میتوانید با سایر کامیونیتی ها رقابت کنید و اعضای خود را افزایش دهید</p>
                            </div>
                        </div>
                
                        <div className="d-md-flex align-items-start d-block"><img className="me-md-4 mb-md-0 mb-4" src={miniPic3} alt="Icon"/>
                            <div className="ps-md-2">
                                <h3 className="h6 mb-2">داشتن فروشگاه کتاب</h3>
                                <p className="mb-0 fs-sm">بعد از ساخت کامیونیتی شما میتوانید یک فروشگاه کتاب بسازید و از طریق آن کسب درآمد کنید</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <br/>
                <br/>
            </div>
            <div className="row align-items-center">
                <div className="col"></div>
                <div className="col-12 col-sm-10 col-lg-5">
                    <a href='#communityForm'>
                        <button type="button" class="w-100 btn btn-lg btn-warning">همین حالا کامیونیتی خود را بسازید</button>
                    </a>
                    
                </div>
                <div className="col"></div>
                <br/>
                <br/>
                <p/>
                <br/>
                <br/>
                <p/>
                
            </div>
            <div className="row align-items-center">
                <div className="col-12 col-lg-6 my-2">
                    <CommunityExamples/>
                </div>
                <div className="col-12 col-lg-6">
                <img className="w3-animate-zoom w-100" src={CreatecommunityPic2} alt="Illustration"/>
                </div>
                
            </div>
            <div className="row">
                <p/>
                <p/>
                <p/>
            </div>
            <div className="row align-items-center" >

                <div className="col-12 col-lg-6">
                    <h3>راهنمای ایجاد کامیونیتی</h3>
                    <br/>
                    <br/>
                    <h6><li>نام</li></h6>
                    {/* <br/> */}
                    <p>نام همان اسمی است که کاربران سایت از کامیونیتی شما میبینند</p>
                    <br/>
                    <h6><li>بیو</li></h6>
                    {/* <br/> */}
                    <p>بیو حداکثر شامل دو خط در رابطه با کامیونیتی شما است</p>
                    
                    {/* <h6><li>کامیونیتی عمومی</li></h6>
                    <p>اگر کامیونیتی شما عمومی باشد همه میتوانید در آن عضو شوند</p>
                    <h6><li>کامیونیتی غیر عمومی</li></h6>
                    <p>اگر کامیونیتی شما خصوصی باشد فقط افرادی که رمز آن را دارند میتوانند در آن عضو شوند</p>
                    <h6><li>رمز ورود</li></h6>
                    <p>اگر کامیونیتی شما خصوصی است یک رمز برای آن تعیین کنید تا افراد مورد نظرتان را از آن طریق به کامیونیتی خود دعوت کنید</p> */}
                    


                </div>


                <div className="col-12 col-lg-6">
                    <div class="card-body" id="communityForm">
                        
                            <div class="form-floating mb-3">
                                <input
                                 type="text" class="form-control form-control-flush"
                                  id="cardName" 
                                  placeholder="Name" 
                                  onChange={(e) =>
                                this.setState({ name: e.target.value })}/>
                                <label for="cardName">نام کامیونیتی</label>
                                <span id="nameErr" style={{color:"red"}}></span>
                            </div>
                            <div class="form-floating mb-3">
                                <textarea class="form-control"
                                    placeholder="Leave a comment here"
                                    id="floatingTextarea2"
                                    onChange={(e) =>
                                        this.setState({ bio: e.target.value })}
                                    style={{height: "100px"}}>

                                </textarea>
                                <label for="floatingTextarea2">بیو کامیونیتی</label>
                                <span id="bioErr" style={{color:"red"}}></span>
                            </div>
                            {/* <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={()=>this.Checkbox()}/>
                                <label class="form-check-label" for="flexCheckChecked">
                                    کامیونیتی عمومی
                                </label>
                            </div> */}
                            {/* <div class="form-floating mb-3">
                                <input type="password"
                                    class="form-control form-control-flush"
                                    id="communityPass"
                                    onChange={(e) =>
                                    this.setState({ password: e.target.value })}
                                placeholder="Name"/>
                                <label for="cardName" id="PassLable">رمز ورود</label>
                            </div> */}
                            {/* <div class="form-floating mb-3">
                                <input type="password"
                                    class="form-control form-control-flush" 
                                    id="communityPassConfirm"
                                    onChange={(e) =>
                                    this.setState({ passwordConfirm: e.target.value })}
                                placeholder="Name"/>
                                <label for="cardName" id="confirmLable">تکرار رمز ورود</label>
                            </div> */}
                            <div class="mt-6">
                                <button class="btn w-100 btn-primary lift" onClick={()=>{this.CreateCommunity()}}>
                                ساخت کامیونیتی
                                </button>
                            </div>
                        
                    </div>
                </div>
                
            </div>
            <div className="row">
                <p/>
                <p/>
                <p/>
                <p/>
            </div>
        </div>
    );
  }
}
export default CreateCommunity;
