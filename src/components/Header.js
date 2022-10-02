import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate();
  let gohome = () => {
    navigate("/");
  };
  let gettokenDetails = () => {
    //read from localstorage
    let token = localStorage.getItem("auth_token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };
  let [userlogin, setuserlogin] = useState(gettokenDetails());

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    //save the data
    localStorage.setItem("auth_token", token);
    Swal.fire({
      icon: "success",
      title: "Login Successfull",
      text: "",
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
        setuserlogin(false);
        window.location.reload();
        Swal.fire("Your are logged out.");
      }
    });
  };
  return (
    <>
      <GoogleOAuthProvider clientId="329595307528-s5rm4k7au8tqmj01m185h6mal6qkcsck.apps.googleusercontent.com">
        <header className={" row justify-content-center  m-0 " + props.color}>
          {/* <!-- Modal --> */}
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
                  <div className="py-2 ">
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                  </div>
                  {/* <button className="btn btn-outline-secondary w-100 mb-5">
                        <i
                          className="fa fa-facebook-official"
                          aria-hidden="true"
                        ></i>
                        Continue with Facebook
                      </button> */}
                </div>
                <div className="modal-footer justify-content-start">
                  <span>Don't have account? </span>
                  <span className="text-danger">Sign UP</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            id="signupmodal"
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
                    Sign Up
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body px-4">
                  <button className="btn btn-outline-secondary w-100 mb-3">
                    <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                    Continue with Gmail
                  </button>
                  <button className="btn btn-outline-secondary w-100 mb-5">
                    <i
                      className="fa fa-facebook-official"
                      aria-hidden="true"
                    ></i>
                    Continue with Facebook
                  </button>
                </div>
                <div className="modal-footer justify-content-start">
                  <span>Already have an account? </span>
                  <span className="text-danger">Login </span>
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
                <img
                  referrerPolicy="no-referrer"
                  data-bs-toggle="modal"
                  data-bs-target="#loginmodal"
                  className="rounded-circle hand mx-3"
                  src={userlogin.picture}
                  width="45px"
                />

                <button onClick={logout} className="btn btn-outline-light">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn my-2  text-light mx-4"
                  data-bs-toggle="modal"
                  data-bs-target="#loginmodal"
                >
                  Login
                </button>

                <button
                  className="btn my-2  btn-outline-light"
                  data-bs-toggle="modal"
                  data-bs-target="#signupmodal"
                >
                  Create an account
                </button>
              </div>
            )}
          </section>
        </header>
      </GoogleOAuthProvider>
      ;
    </>
  );
}

export default Header;
