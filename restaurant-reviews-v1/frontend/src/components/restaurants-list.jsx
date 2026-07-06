import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [cuisines, setCuisines] = useState(["All Cuisines"]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");

    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    }, []);

    const retrieveRestaurants = () => {
        RestaurantDataService.getAllRestaurants()
            .then((response) => {
                console.log(response);
                const data = response.json();
                return data;
            })
            .then((data) => {
                console.log(data);
                setRestaurants(data.restaurants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const retrieveCuisines = () => {
        RestaurantDataService.getCuisines()
            .then((response) => {
                console.log(response);
                // setCuisines(["All Cuisines"].concat(response));
            })
            .then((data) => {
                console.log(data);
                setCuisines(["All Cuisines"].concat(data.cuisines));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveRestaurants();
    };

    const find = (query, by) => {
        RestaurantDataService.find(query, by)
            .then((response) => {
                console.log(response.data);
                setRestaurants(response.data.restaurants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        find(searchName, "name");
    };

    const findByZip = () => {
        find(searchZip, "zipcode");
    };

    const findByCuisine = () => {
        if (searchCuisine === "All Cuisines") {
            refreshList();
        } else {
            find(searchCuisine, "cuisine");
        }
    };

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const onChangeSearchZip = (e) => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };

    const onChangeSearchCuisine = (e) => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    };

    return (
        <div>
            <div className="row">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by zip"
                        value={searchZip}
                        onChange={onChangeSearchZip}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={findByZip}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <select onChange={onChangeSearchCuisine}>
                        {cuisines.map((cuisine) => {
                            return (
                                <option value={cuisine} key={cuisine}>
                                    {cuisine.substring(0, 20)}
                                </option>
                            );
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={findByCuisine}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="cards">
                {restaurants.map((restaurant) => {
                    const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
                    return (
                        <div className="card" key={restaurant._id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text">
                                        <strong>Cuisine: </strong>
                                        {restaurant.cuisine}
                                        <br />
                                        <strong>Address: </strong>
                                        {address}
                                    </p>
                                    <div className="row">
                                        <Link
                                            to={"/restaurants/" + restaurant._id}
                                            className="btn btn-primary"
                                        >
                                            View Reviews
                                        </Link>
                                        <a
                                            rel="noreferrer"
                                            target="_blank"
                                            href={"https://www.google.com/maps/place/" + address}
                                            className="btn btn-primary"
                                        >
                                            View Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RestaurantsList;