import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function Header(props) {
  let userModel = {
    name: "",
    email: "",
    Mobile: "",
    Password: "",
  };
  let [temp, setTemp] = useState("");
  let [newUser, setnewUser] = useState(userModel);
  let navigate = useNavigate();
  let gohome = () => {
    navigate("/");
  };
  let gettokenDetails = () => {
    //read from localstorage
    let customuser = localStorage.getItem("logindata");
    let token = localStorage.getItem("auth_token");
    if (token === null) {
      if (customuser === null) {
        return false;
      } else {
        return JSON.parse(customuser);
      }
    } else {
      return jwt_decode(token);
    }
  };
  let [userlogin, setuserlogin] = useState(gettokenDetails());

  let adduserdetail = (event) => {
    let { name, value } = event.target;
    userModel = newUser;
    userModel[name] = value;
    setnewUser({ ...userModel });
  };
  let addnewUser = async () => {
    if (
      newUser.name !== undefined &&
      newUser.name !== "" &&
      newUser.email !== "" &&
      newUser.Password !== ""
    ) {
      if (temp === newUser.Password) {
        let URL = "http://localhost:6001/signup";
        let { data } = await axios.post(URL, newUser);
        console.log(data);
        if (data.status === false) {
          alert(data.message);
        } else {
          Swal.fire({
            icon: "success",
            title: "Account Created Successfuly",
            text: "Please login to your acccount",
          }).then(() => {
            window.location.reload();
          });
        }
      } else {
        alert("Password does not match");
      }
    } else {
      alert("Plaese fill the required fields");
    }
  };

  let loginUser = async () => {
    let URL = "http://localhost:6001/login";
    if (
      newUser.name !== undefined &&
      newUser.name !== "" &&
      newUser.Password !== ""
    ) {
      let { data } = await axios.post(URL, newUser);
      if (data.status === false) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message + ", Try again",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Login Successfull",
          text: "Welcome " + newUser.name,
        }).then(() => {
          localStorage.removeItem("auth_token");
          localStorage.setItem("logindata", JSON.stringify(data.result));
          window.location.reload();
        });
      }
    } else {
      alert("Plaese fill the required fields");
    }
  };

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    //save the data
    localStorage.removeItem("logindata");
    localStorage.setItem("auth_token", token);
    Swal.fire({
      icon: "success",
      title: "Login Successfull",
    }).then(() => {
      window.location.reload();
    });
  };
  let onError = () => {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Try again",
    });
  };
  let logout = () => {
    // remove localstoragedata
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("logindata");
        setuserlogin(false);
        Swal.fire("Your are logged out.").then(() => window.location.reload());
      }
    });
  };
  return (
    <>
      <GoogleOAuthProvider clientId="329595307528-s5rm4k7au8tqmj01m185h6mal6qkcsck.apps.googleusercontent.com">
        <header className={" row justify-content-center  m-0 " + props.color}>
          {/* <!-- create account Modal --> */}
          <div
            className="modal fade "
            id="signupmodal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header px-4 border-0">
                  <h5
                    className="modal-title fw-bold font-blue"
                    id="exampleModalLabel"
                  >
                    Create
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body px-4">
                  <div className="py-2 d-flex flex-column align-items-center">
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="name">
                        Username<i className="text-danger">*</i>
                      </label>
                      <input
                        placeholder="Enter Username"
                        name="name"
                        onBlur={adduserdetail}
                        id="name"
                        className="p-2 rounded-1"
                        type="text"
                      />
                    </div>
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="email">
                        Email<i className="text-danger">*</i>
                      </label>
                      <input
                        onBlur={adduserdetail}
                        name="email"
                        id="email"
                        className="p-2 rounded-1"
                        type="text"
                      />
                    </div>
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input
                        onBlur={adduserdetail}
                        name="Mobile"
                        id="mobile"
                        className="p-2 rounded-1"
                        type="text"
                      />
                    </div>
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="pwd">
                        Password<i className="text-danger">*</i>{" "}
                      </label>
                      <input
                        onBlur={(event) => {
                          setTemp(event.target.value);
                        }}
                        id="pwd"
                        name="tempPass"
                        className="p-2 rounded-1"
                        type="password"
                      />
                    </div>
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="cpwd">
                        Confirm Password<i className="text-danger">*</i>
                      </label>
                      <input
                        onBlur={adduserdetail}
                        name="Password"
                        id="cpwd"
                        className="p-2 rounded-1"
                        type="password"
                      />
                    </div>
                    <button
                      onClick={() => addnewUser()}
                      className="btn account btn-outline-primary my-3"
                    >
                      <i className="fa fa-file px-2" aria-hidden="true"></i>
                      Create New
                    </button>
                  </div>
                </div>
                <div className="modal-footer justify-content-start">
                  <span>Already have an account? </span>
                  <span
                    data-bs-toggle="modal"
                    data-bs-target="#loginmodal"
                    className="text-danger hand"
                  >
                    Login
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- login Modal --> */}
          <div
            className="modal fade"
            id="loginmodal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5
                    className="modal-title fw-bold font-blue"
                    id="exampleModalLabel"
                  >
                    Login
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body px-4">
                  <div className="py-2 d-flex flex-column align-items-center">
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#logintoaccount"
                      className="btn account btn-outline-primary m-3"
                    >
                      <i className="fa fa-sign-in px-2" aria-hidden="true"></i>
                      Login
                    </button>
                  </div>
                </div>
                <div className="modal-footer justify-content-start">
                  <span>Don't have an account? </span>
                  <span
                    data-bs-toggle="modal"
                    data-bs-target="#signupmodal"
                    className="text-danger hand"
                  >
                    SignUP
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* login typing modal */}
          <div
            className="modal fade "
            id="logintoaccount"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header px-4 border-0">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body px-4">
                  <div className="py-2 d-flex flex-column align-items-center">
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="Username">
                        Username<i className="text-danger">*</i>
                      </label>
                      <input
                        placeholder="Enter Username"
                        name="name"
                        onBlur={adduserdetail}
                        id="Username"
                        className="p-2 rounded-1"
                        type="text"
                      />
                    </div>
                    <div className="d-flex w-100 py-2 flex-column">
                      <label htmlFor="typepwd">
                        Password<i className="text-danger">*</i>{" "}
                      </label>
                      <input
                        onBlur={adduserdetail}
                        id="typepwd"
                        name="Password"
                        className="p-2 rounded-1"
                        type="password"
                      />
                    </div>
                    <button
                      onClick={() => loginUser()}
                      className="btn account btn-outline-primary my-3"
                    >
                      <i className="fa fa-sign-in px-2" aria-hidden="true"></i>
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section
            className={"col-11 d-flex  p-2 align-items-center " + props.justify}
          >
            <div
              onClick={() => gohome()}
              className={
                "logo hand bg-white mx-2 rounded-circle " + props.display
              }
            >
              <p className="fw-bold m-0 text-center">e!</p>
            </div>
            {userlogin ? (
              <div className="d-flex">
                {userlogin.picture ? (
                  <img
                    alt="user-img"
                    referrerPolicy="no-referrer"
                    data-bs-toggle="modal"
                    data-bs-target="#loginmodal"
                    className="rounded-circle hand mx-3"
                    src={userlogin.picture}
                    width="45px"
                  />
                ) : (
                  <img
                    alt="user-img"
                    referrerPolicy="no-referrer"
                    data-bs-toggle="modal"
                    data-bs-target="#loginmodal"
                    className="rounded-circle bg-light hand mx-3"
                    src="../Images/assets/head2.png"
                    width="45px"
                  />
                )}

                <button onClick={logout} className="btn btn-outline-light">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn my-2 login-button  text-light mx-1"
                  data-bs-toggle="modal"
                  data-bs-target="#loginmodal"
                >
                  Login
                </button>

                <button
                  className="btn my-2 login-button btn-outline-light"
                  data-bs-toggle="modal"
                  data-bs-target="#signupmodal"
                >
                  Create new Account
                </button>
              </div>
            )}
          </section>
        </header>
      </GoogleOAuthProvider>
    </>
  );
}

export default Header;
