import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

function Restaurantpage() {
  let initvalue = {
    _id: -1,
    name: "",
    city: "",
    location_id: -1,
    city_id: -1,
    locality: "",
    thumb: [],
    aggregate_rating: 0,
    rating_text: "",
    min_price: 0,
    contact_number: "",
    cuisine_id: [],
    cuisine: [],
    image: "assets/breakfast.png",
    mealtype_id: "1",
  };
  let { res_id } = useParams();
  let [tab, settab] = useState(1);
  let [restaurant, setrestaurant] = useState({ ...initvalue });
  let [menuitem, setmenuitem] = useState([]);
  let [subtotal, setsubtotal] = useState(0);
  let [disabled, setdisabled] = useState(true);
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
  let [userdetail, setuserdetail] = useState(gettokenDetails());

  let getmenuitems = async (res_id) => {
    let URL = "https://zomatoapi.up.railway.app/api/getMenuitems/" + res_id;
    try {
      let { data } = await axios.get(URL);
      let { status, output } = data;
      if (status === true) {
        setmenuitem([...output]);
      } else {
        setmenuitem([]);
      }
    } catch (error) {
      alert("server menu data error");
      console.log(error);
    }
  };
  let addmenuitem = (index) => {
    setdisabled(false);
    let _subtotal = subtotal;
    let _menuitem = menuitem;
    _menuitem[index].qty += 1;
    _subtotal += Number(_menuitem[index].price);
    setmenuitem(_menuitem);
    setsubtotal(_subtotal);
  };
  let submenuitem = (index) => {
    let _subtotal = subtotal;
    let _menuitem = menuitem;
    if (Number(_menuitem[index].qty > 0)) {
      _menuitem[index].qty -= 1;
      _subtotal -= Number(_menuitem[index].price);
    }
    if (_subtotal === 0) {
      setdisabled(true);
    }
    setmenuitem(_menuitem);
    setsubtotal(_subtotal);
  };
  let getrestaurantdetails = async () => {
    let URL =
      "https://zomatoapi.up.railway.app/api/getbyRestaurantID/" + res_id;
    try {
      let { data } = await axios.get(URL);
      let { status, output } = data;

      if (status === true) {
        setrestaurant({ ...output });
      } else {
        setrestaurant({ ...initvalue });
      }
    } catch (error) {
      console.log(error);
    }
  };
  let loadScript = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  };

  let makePayment = async () => {
    let isLoaded = await loadScript();
    if (isLoaded === true) {
      alert("sdk is not loaded");
      return false;
    }
    var orderData = { total: subtotal };
    var { data } = await axios.post(
      "https://zomatoapi.up.railway.app/api/payment/genId/",
      orderData
    );
    var { order } = data;
    var options = {
      key: "rzp_test_nUftjVlE01TOBR", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato_clone",
      description: "zomato Test Transaction",
      image:
        "https://www.citypng.com/public/uploads/preview/zomato-logo-transparent-background-11662674104vmdxh5lcfn.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        var sendData = {
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        };
        var { data } = await axios.post(
          "https://zomatoapi.up.railway.app/api/payment/verify",
          sendData
        );
        console.log(data);
        if (data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Payment Successfull",
            text: "",
          }).then(() => {
            window.location.replace("/");
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Payment Failed,try again",
            text: "",
          });
        }
      },
      prefill: {
        name: userdetail.name,
        email: userdetail.email,
        contact: "9999999999",
      },
    };
    var razorpayObject = window.Razorpay(options);
    // rzp1.on("payment.failed", function (response) {
    //   alert(response.error.code);
    //   alert(response.error.description);
    //   alert(response.error.source);
    //   alert(response.error.step);
    //   alert(response.error.reason);
    //   alert(response.error.metadata.order_id);
    //   alert(response.error.metadata.payment_id);
    // });
    razorpayObject.open();
  };

  useEffect(() => {
    getrestaurantdetails();
  }, []);
  return (
    <>
      <Header color="bg-red" justify="justify-content-between" />
      {/* modals */}
      <div
        className="modal fade"
        id="ordering"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content px-4">
            <div className="modal-header border-0">
              <h5
                className="modal-title font-blue fw-bold h3"
                id="exampleModalToggleLabel"
              >
                {restaurant.name}
              </h5>
              <button
                onClick={() => {
                  setsubtotal(0);
                  setdisabled(true);
                }}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {menuitem.map((item, index) => {
                // console.log("again");
                return (
                  <div key={index}>
                    <section className="d-flex">
                      <div>
                        <p className="font-blue fw-bold m-0">{item.name}</p>
                        <p className="m-0">&#x20B9;{item.price}</p>
                        <p className="font-small">{item.description}</p>
                      </div>
                      <div className="position-relative d-flex justify-content-center ms-5">
                        <img
                          className="modal-img rounded-1 "
                          src={"./" + item.image}
                          alt=""
                        />
                        {subtotal === 0 ? (
                          <button
                            onClick={() => addmenuitem(index)}
                            className="position-absolute py-0 add-btn  btn btn-light shadow rounded-0 text-success"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="add-btn  d-flex position-absolute">
                            <button
                              onClick={() => submenuitem(index)}
                              className="btn rounded-0 px-1 text-success py-0 btn-light"
                            >
                              -
                            </button>
                            <button className="btn rounded-0 px-1 text-dark  py-0 btn-light">
                              {item.qty}
                            </button>
                            <button
                              onClick={() => addmenuitem(index)}
                              className="btn rounded-0 px-1 text-success py-0 btn-light"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </section>
                    <hr />
                  </div>
                );
              })}
            </div>
            <div className="modal-footer justify-content-between  border-0 ">
              <div>
                <span className="fw-bold font-blue">Subtotal : </span>
                <span className="fw-bold font-blue">{subtotal}</span>
              </div>
              <button
                className="btn btn-danger bg-red"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
                disabled={disabled}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content px-4">
            <div className="modal-header border-0">
              <h5
                className="modal-title fw-bold h3 font-blue"
                id="exampleModalToggleLabel2"
              >
                {restaurant.name}
              </h5>
              <button
                onClick={() => {
                  setsubtotal(0);
                  setdisabled(true);
                }}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-column pb-4">
                <label className="form-label font-blue" htmlFor="myname">
                  Name
                </label>
                <input
                  onChange={() => {}}
                  id="myname"
                  readOnly={true}
                  value={userdetail.name}
                  className="form-control rounded-0"
                  placeholder="Enter your name"
                  type="text"
                />
              </div>
              <div className="d-flex flex-column pb-4">
                <label className="form-label font-blue" htmlFor="emailaddress">
                  Email Address
                </label>
                <input
                  onChange={() => {}}
                  id="emailaddress"
                  readOnly={true}
                  value={userdetail.email}
                  className="form-control rounded-0"
                  placeholder="Enter your mobile number"
                  type="text"
                />
              </div>
              <div className="d-flex flex-column pb-4">
                <label className="form-label font-blue" htmlFor="address">
                  Address
                </label>
                <textarea
                  className="form-control rounded-0"
                  name=""
                  id=""
                  cols="20"
                  rows="5"
                  placeholder="Enter your address"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer border-0 d-flex justify-content-between">
              <button
                className="btn btn-danger bg-red"
                data-bs-target="#ordering"
                data-bs-toggle="modal"
              >
                Go Back
              </button>
              <button onClick={makePayment} className="btn btn-success">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="carouselmodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body px-4">
              <div
                id="carouselExampleControls"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {restaurant.thumb.map((images, index) => {
                    return (
                      <div key={index} className="carousel-item active">
                        <img
                          src={"./" + images}
                          className="d-block w-100"
                          alt="..."
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="row m-0 justify-content-center">
        <div className="col-11 py-5 position-relative">
          <img className="detail-img" src={"./" + restaurant.image} alt="" />
          <button
            referrerPolicy="no-referrer"
            data-bs-toggle="modal"
            data-bs-target="#carouselmodal"
            className="btn btn-light gallery-btn font-blue fw-bold position-absolute"
          >
            Click to see Image Gallery
          </button>
        </div>

        <div className="col-11 d-flex justify-content-between">
          <h1 className="fw-bold font-blue">{restaurant.name}</h1>
          {userdetail ? (
            <button
              onClick={() => {
                getmenuitems(restaurant._id);
              }}
              className="btn btn-danger bg-red text-light"
              data-bs-toggle="modal"
              href="#ordering"
            >
              Place Online Order
            </button>
          ) : (
            <button
              data-bs-toggle="modal"
              data-bs-target="#loginmodal"
              className="btn btn-danger bg-red text-light"
            >
              Login to place Order
            </button>
          )}
        </div>
        <section className="col-11">
          <div className="d-flex">
            <div
              className="p-3 hand overview"
              onClick={() => {
                settab(1);
              }}
            >
              Overview
            </div>
            <div
              className="p-3 hand contact "
              onClick={() => {
                settab(2);
              }}
            >
              Contact
            </div>
          </div>
          <hr className="m-0" />
          {tab === 1 ? (
            <section className="font-blue">
              <div className=" fw-bold py-4 h5">About this place</div>
              <div>
                <p className="mb-2 fw-bold">Cuisine</p>
                <p>
                  {restaurant.cuisine.length > 0
                    ? restaurant.cuisine.reduce((pValue, cValue) => {
                        return pValue.name + ", " + cValue.name;
                      })
                    : null}
                </p>
              </div>
              <div>
                <p className="mb-2 fw-bold">Average Cost</p>
                <p>
                  &#x20B9;{restaurant.min_price} for two people
                  &#40;approx&#41;.
                </p>
              </div>
            </section>
          ) : (
            <section className="font-blue res-contact">
              <div className=" fw-bold py-4 h5">Contact</div>
              <div>
                <p className="mb-2 fw-bold">Phone Number</p>
                <p className="text-danger ">+{restaurant.contact_number}</p>
              </div>
              <div>
                <p className="mb-2 fw-bold">{restaurant.name}</p>
                <p>
                  {restaurant.locality},{restaurant.city}
                </p>
              </div>
            </section>
          )}
        </section>
      </section>
    </>
  );
}
export default Restaurantpage;
