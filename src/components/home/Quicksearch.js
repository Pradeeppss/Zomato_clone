import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quicksearch() {
  let navigate = useNavigate();

  let [mealtypelist, setMealtypelist] = useState([]);

  let getmealtype = async () => {
    try {
      let response = await axios.get(
        "https://zomato-api-pradeep.herokuapp.com/api/mealtype"
      );
      let data = response.data;
      if (data.status === true) {
        setMealtypelist([...data.output]); //spread operator for recreating array
      } else {
        setMealtypelist([]);
      }
    } catch (error) {
      alert("server error");
    }
  };

  let getQuicksearchpage = (id, name) => {
    navigate("/search/" + id, { state: { mealtype: name } });
  };

  useEffect(() => {
    getmealtype();
  }, []);
  //if [],useEffect() only run once
  return (
    <>
      <section className="container my-5">
        <div className="row">
          <p className="h2 col-12 col-sm-10 fw-bold font-blue">
            Quick Searches
          </p>
        </div>
        <div className="row">
          <p className="h5 col-12 py-2 col-sm-10 text-secondary">
            Discover restaurants by type of meal
          </p>
        </div>
        <div className="row py-4 justify-content-center">
          {mealtypelist.map((mealtype, index) => {
            return (
              <section key={index} className="col-lg-4 col-sm-6 col-12 p-3 ">
                <div
                  onClick={() =>
                    getQuicksearchpage(mealtype.meal_type, mealtype.name)
                  }
                  className="shadow hand d-flex "
                >
                  <img
                    className="card-img"
                    src={"./Images/" + mealtype.image}
                    alt=""
                  />
                  <div className="p-4 pe-md-1 pe-sm-3 pe-lg-0">
                    <div className="fw-bold font-blue h4">{mealtype.name}</div>
                    <div className="text-secondary">{mealtype.content} </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Quicksearch;
