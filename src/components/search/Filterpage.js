import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function Filterpage() {
  let navigate = useNavigate();
  // { meal_type, location, cuisine, hcost, lcost, sort, page }
  let { meal_id } = useParams();
  let [restaurantlist, setRestaurantlist] = useState([]);
  let [locationlist, setlocationlist] = useState([]);
  let [filter, setfilter] = useState({ meal_type: meal_id, page: 1 });
  let [cuisine, setcuisine] = useState([]);

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
  let filterOperation = async (filter) => {
    let URL = "http://localhost:6001/api/filter";

    try {
      let { data } = await axios.post(URL, filter);
      let { status, result } = data;
      if (status === true) {
        setRestaurantlist([...result]);
      } else {
        setRestaurantlist([]);
      }
    } catch (error) {
      alert(" filter server error");
      console.log(error);
    }
  };
  let cuisineadding = (value) => {
    let index = cuisine.indexOf(value);
    if (index === -1) {
      cuisine.unshift(value);
    } else {
      cuisine.splice(index, 1);
    }
    setcuisine(cuisine);
  };
  let makefilteration = (event, type) => {
    let value = event.target.value;
    let _filter = filter;
    switch (type) {
      case "location":
        _filter["location"] = value;
        break;
      case "cuisine":
        cuisineadding(value);
        filter["cuisine"] = cuisine;
        break;
      case "sort":
        _filter["sort"] = value;
        break;
      case "cost-for-two":
        _filter["hcost"] = value.split("-")[1];
        _filter["lcost"] = value.split("-")[0];
        break;
      case "page":
        if (value === "add") {
          if (_filter.page !== 5) {
            _filter["page"] = Number(_filter.page) + 1;
            break;
          } else {
            break;
          }
        }
        if (value === "sub") {
          if (_filter.page !== 1) {
            _filter["page"] = Number(_filter.page) - 1;
            break;
          } else {
            break;
          }
        }
        _filter["page"] = value;
        break;
      default:
    }
    setfilter(_filter);
    filterOperation(filter);
    console.log(filter);
  };
  let getrestaurantdetail = (res_id) => {
    navigate("/restaurant/" + res_id);
  };
  useEffect(() => {
    filterOperation(filter);
    getlocation();
  }, []);

  return (
    <section className="container-md font-blue">
      <div className="h2 fw-bold py-4">Breakfast Places in Mumbai</div>
      <section className="d-flex justify-content-between">
        <div className="d-none d-sm-block">
          <div className="filters shadow p-3 d-flex flex-column bg-dangr">
            <div className="h6 fw-bold">Filters</div>
            <div className="d-flex flex-column py-3">
              <label htmlFor="location" className="w-100">
                Select Location
              </label>
              <select
                onChange={(event) => makefilteration(event, "location")}
                name="location"
                className="py-1 my-1 form-select"
                id=""
              >
                <option value="">select location</option>
                {locationlist.map((location, index) => {
                  return (
                    <option key={index} value={location.location_id}>
                      {location.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <div className="py-2">Cuisine</div>
              <div>
                <input
                  value="1"
                  onChange={(event) => makefilteration(event, "cuisine")}
                  id="North Indian"
                  className="hand py-1"
                  type="checkbox"
                />
                <label htmlFor="North Indian" className="text-secondary">
                  North Indian
                </label>
              </div>
              <div>
                <input
                  value="2"
                  onChange={(event) => makefilteration(event, "cuisine")}
                  id="South Indian"
                  className="hand py-1"
                  type="checkbox"
                />
                <label htmlFor="South Indian" className="text-secondary">
                  South Indian
                </label>
              </div>
              <div>
                <input
                  value="3"
                  onChange={(event) => makefilteration(event, "cuisine")}
                  id="Chinese"
                  className="hand py-1"
                  type="checkbox"
                />
                <label htmlFor="Chinese" className="text-secondary">
                  Chinese
                </label>
              </div>
              <div>
                <input
                  value="4"
                  onChange={(event) => makefilteration(event, "cuisine")}
                  id="Fast Food"
                  className="hand py-1"
                  type="checkbox"
                />
                <label htmlFor="Fast Food" className="text-secondary">
                  Fast Food
                </label>
              </div>
              <div>
                <input
                  value="5"
                  onChange={(event) => makefilteration(event, "cuisine")}
                  id="Street Food"
                  className="hand py-1"
                  type="checkbox"
                />
                <label htmlFor="Street Food" className="text-secondary">
                  Street Food
                </label>
              </div>
            </div>
            <div className="py-1">
              <div className="py-2">Cost For Two</div>
              <div>
                <input
                  value="0-500"
                  onChange={(event) => makefilteration(event, "cost-for-two")}
                  id="500"
                  className="hand py-1"
                  type="radio"
                  name="CFT"
                />
                <label htmlFor="500" className="text-secondary">
                  Less than `500
                </label>
              </div>
              <div>
                <input
                  value="500-1000"
                  onChange={(event) => makefilteration(event, "cost-for-two")}
                  id="1000"
                  className="hand py-1"
                  type="radio"
                  name="CFT"
                />
                <label htmlFor="1000" className="text-secondary">
                  `500 to `1000
                </label>
              </div>
              <div>
                <input
                  value="1000-1500"
                  onChange={(event) => makefilteration(event, "cost-for-two")}
                  id="1500"
                  className="hand py-1"
                  type="radio"
                  name="CFT"
                />
                <label htmlFor="1500" className="text-secondary">
                  `1000 to `1500
                </label>
              </div>
              <div>
                <input
                  value="1500-2000"
                  onChange={(event) => makefilteration(event, "cost-for-two")}
                  id="2000"
                  className="hand py-1"
                  type="radio"
                  name="CFT"
                />
                <label htmlFor="2000" className="text-secondary">
                  `1500 to `2000
                </label>
              </div>
              <div>
                <input
                  value="2000-999999"
                  onChange={(event) => makefilteration(event, "cost-for-two")}
                  id="2000+"
                  className="hand py-1"
                  type="radio"
                  name="CFT"
                />
                <label htmlFor="2000+" className="text-secondary">
                  `2000+
                </label>
              </div>
            </div>
            <div className=" py-1">
              <div className="py-2">Sort</div>
              <div>
                <input
                  value="1"
                  onChange={(event) => makefilteration(event, "sort")}
                  id="low to high"
                  className="hand py-1"
                  type="radio"
                  name="sort"
                />
                <label htmlFor="low to high" className="text-secondary">
                  Price low to high
                </label>
              </div>
              <div>
                <input
                  value="-1"
                  onChange={(event) => makefilteration(event, "sort")}
                  id="high to low"
                  className="hand py-1"
                  type="radio"
                  name="sort"
                />
                <label htmlFor="high to low" className="text-secondary">
                  Price high to low
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-sm-75 w-100 d-flex flex-column px-sm-5 p-0">
          {restaurantlist.map((restaurant, index) => {
            return (
              <article
                onClick={() => {
                  getrestaurantdetail(restaurant._id);
                }}
                key={index}
                className="shadow px-sm-5 hand px-3 py-4 mb-4"
              >
                <div className="d-flex">
                  <img
                    className="res-img rounded-4"
                    src={restaurant.image}
                    alt="big chill"
                  />

                  <div className="px-sm-5 px-3 d-flex flex-column justify-content-center">
                    <div className="h3 fw-bold">{restaurant.name}</div>
                    <div className="fs-small fw-bold">{restaurant.city}</div>
                    <div className="text-secondary fs-small">
                      <i className="fa fa-map-marker text-danger pe-1"></i>
                      {restaurant.locality},{restaurant.city}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex">
                  <div className="text-secondary">
                    <div className="fs-small">CUISINES:</div>
                    <div className="fs-small">COST FOR TWO:</div>
                  </div>
                  <div className="px-5">
                    <div className="fs-small">
                      {restaurant.cuisine.reduce((pValue, cValue) => {
                        return pValue.name + ", " + cValue.name;
                      })}
                    </div>
                    <div className="fs-small">
                      &#x20B9;{restaurant.min_price}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="row justify-content-center">
            <div className="d-flex p-sm-5 col-11 col-sm-9 col-md-9 col-lg-6 justify-content-between">
              <div>
                <button
                  value="sub"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary"
                >
                  &lt;
                </button>
              </div>
              <div>
                <button
                  value="1"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary px-3"
                >
                  1
                </button>
              </div>
              <div>
                <button
                  value="2"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary"
                >
                  2
                </button>
              </div>
              <div>
                <button
                  value="3"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary"
                >
                  3
                </button>
              </div>
              <div>
                <button
                  value="4"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary"
                >
                  4
                </button>
              </div>
              <div>
                <button
                  value="5"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary"
                >
                  5
                </button>
              </div>
              <div>
                <button
                  value="add"
                  onClick={(event) => makefilteration(event, "page")}
                  className="btn btn-outline-secondary"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Filterpage;
