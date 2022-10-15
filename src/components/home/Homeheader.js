import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

function Homeheader() {
  let selectinput = useRef();
  let navigate = useNavigate();

  let [restaurantlist, setrestaurantlist] = useState([]);
  let [searchOutput, setsearchOutput] = useState([]);
  let [locationlist, setlocationlist] = useState([]);
  let [disabled, setdisabled] = useState(true);

  let getlocation = async () => {
    try {
      let { data } = await axios.get("http://localhost:6001/api/get-location");
      if (data.status === true) {
        setlocationlist([...data.output]);
      } else {
        setlocationlist([]);
      }
    } catch (error) {
      alert("Server error");
    }
  };
  let getlocationid = async (event) => {
    let value = event.target.value;
    if (value !== "") {
      try {
        let url = "http://localhost:6001/api/getbylocID/" + value;
        let { data } = await axios.get(url);
        // console.log(data);
        if (data.status === true) {
          if (data.output.length !== 0) {
            setdisabled(false);
            setrestaurantlist(data.output);
            setsearchOutput(data.output);
          } else {
            setdisabled(true);
            setrestaurantlist([]);
            setsearchOutput([]);
          }
        }
      } catch (error) {
        alert(error);
      }
    } else {
      setdisabled(true);
      setrestaurantlist([]);
      setsearchOutput([]);
    }
  };
  let gotorestaurant = (res_id) => {
    navigate("/restaurant/" + res_id);
  };
  let searchRes = (event) => {
    let input = event.target.value.toUpperCase();
    let resultList = restaurantlist.filter((restaurant) => {
      return restaurant.name.toUpperCase().includes(input);
    });
    setsearchOutput(resultList);
  };

  useEffect(() => {
    getlocation();
  }, []);
  return (
    <section className="container-fluid bgimage">
      <Header color="" display="d-none" justify="justify-content-end" />
      {/* <!-- logo --> */}
      <div className="d-flex justify-content-center">
        <div className="rounded-circle m-md-4 mt-5 text-center fw-bold bg-white homepage-logo">
          e!
        </div>
      </div>
      <div className="row m-sm-3 mt-4 mb-4 justify-content-center">
        <p className="text-white text-center h1 big-title">
          Find the best restaurants, cafés, and bars
        </p>
      </div>
      {/* <!-- search bars --> */}
      <div className="row m-1 pb-3 justify-content-center">
        {/* <!-- location search --> */}
        <div className="d-flex col-lg-3 col-sm-11 mb-1 mb-lg-0 ms-md-3 loca-search flex-column">
          <select
            ref={selectinput}
            onChange={getlocationid}
            className="form-select rounded-0 p-3"
            name=""
            id=""
          >
            <option className="text-secondary" value="">
              Select location
            </option>
            {locationlist.map((location, index) => {
              return (
                <option key={index} value={location.location_id}>
                  {location.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* <!-- restaurant search --> */}
        <div className="d-flex col-lg-5 col-sm-11 mt-1 mt-sm-0 me-md-3 flex-column">
          <div className="input-group m-lg-0 ms-md-3 mt-md-1">
            <span
              className="input-group-text pl-4 bg-white border-0 rounded-0"
              id="basic-addon"
            >
              <i className="fa fa-search ps-2" aria-hidden="true"></i>
            </span>
            <input
              id="dropdown"
              onChange={searchRes}
              type="text"
              className="form-control h-100 p-3 rounded-0 border-0"
              placeholder="Search for restaurants"
              disabled={disabled}
            />
          </div>
          <div className="card bg-transparent home-res-list ms-md-3 mt-1 ms-lg-0">
            <ul className="list-group  list-group-flush">
              {searchOutput.map((restaurants, index) => {
                return (
                  <li
                    onClick={() => gotorestaurant(restaurants._id)}
                    key={index}
                    className="hand list-group-item"
                  >
                    <div className="d-flex ">
                      <img
                        className="drop-img rounded-circle"
                        src={"Images/" + restaurants.image}
                        alt=""
                      />
                      <div className="ms-3">
                        <p className="h6 mb-0 font-blue fw-bold">
                          {restaurants.name}
                        </p>
                        <p className="descript font-small mb-0 text-secondary">
                          {restaurants.locality},{restaurants.city}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Homeheader;
