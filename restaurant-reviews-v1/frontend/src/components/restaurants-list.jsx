import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const retrieveRestaurants = (setRestaurants, setCuisines) => {
    RestaurantDataService.getAllRestaurants()
        .then((response) => {
            const data = response.json();
            return data;
        })
        .then((data) => {
            setTimeout(() => {
                setRestaurants(data.restaurants);
                const cuisines = data.restaurants.reduce((acc, restaurant) => {
                    if (!acc.includes(restaurant.cuisine)) {
                        acc.push(restaurant.cuisine);
                        return acc;
                    }
                }, ["All Cuisines"]);
                setCuisines(cuisines);
            }, 5000);
        })
        .catch((e) => {
            console.log(e);
        });
};

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [cuisines, setCuisines] = useState(["All Cuisines"]);
    // const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");

    useEffect(() => {
        // const retrieveCuisines = () => {
        //     RestaurantDataService.getCuisines()
        //         .then((response) => {
        //             const data = response.json();
        //             return data;
        //         })
        //         .then((data) => {
        //             setCuisines(["All Cuisines"].concat(data.cuisines));
        //         })
        //         .catch((e) => {
        //             console.log(e);
        //         });
        // };

        retrieveRestaurants(setRestaurants, setCuisines);
        // retrieveCuisines();
    }, []);

    if (restaurants.length == 0) {
        return (
            <Loader />
        )
    }

    const refreshList = () => {
        retrieveRestaurants(setRestaurants, setCuisines);
    };

    const find = (query, by) => {
        RestaurantDataService.findRestaurants(query, by)
            .then((response) => {
                const data = response.json();
                return data;
            })
            .then((data) => {
                setRestaurants(data.restaurants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // const findByName = () => {
    //     find(searchName, "name");
    // };

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

    // const onChangeSearchName = (e) => {
    //     const searchName = e.target.value;
    //     setSearchName(searchName);
    // };

    const onChangeSearchZip = (e) => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };

    const onChangeSearchCuisine = (e) => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    };

    return (
        <div className="main-content">
            <Filters find={find} cuisines={cuisines} />
            <Restaurants restaurants={restaurants} />
            {/* {restaurants.length > 0 ? (
                <Restaurants restaurants={restaurants} />
            ) : (
                <p style={{
                    fontSize: "2rem",
                    padding: "5rem 2%",
                    textAlign: "center"
                }}>
                     Loading...
                </p>
            )} */}
        </div>
    );
};

function Filters({
    // searchName,
    // onChangeSearchName,
    // findByName,
    searchZip,
    onChangeSearchZip,
    findByZip,
    onChangeSearchCuisine,
    findByCuisine,
    cuisines
}) {
    return (
        <div className="row">
            <InputField />
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
    )
}

function Restaurants({ restaurants }) {
    return (
        <div className="cards">
            {restaurants.map((restaurant) => {
                return <Restaurant restaurant={restaurant} key={restaurant._id} />
            })}
        </div>
    )
}

function Restaurant({ restaurant }) {
    const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">{restaurant.name}</h2>
                <p className="card-text">
                    <strong>Cuisine: </strong>
                    {restaurant.cuisine}
                </p>
                <p className="card-text">
                    <strong>Address: </strong>
                    {address}
                </p>
                <div className="row links">
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
    );
}

function InputField() {
    const [searchName, setSearchName] = useState("");

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const findByName = () => {
        find(searchName, "name");
    };

    return (
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
    )
}

function Loader() {
    return (
        <span className="loader">
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
        </span>
    )
}

export default RestaurantsList;