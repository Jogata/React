import { Link } from "react-router-dom";

const RestaurantsList = () => {
    const restaurants = [{
        _id: "1",
        name: "res1",
        cuisine: "cuisine1",
        address: {
            building: "1",
            street: "str1",
            zipcode: "zcode1"
        }
    }, {
        _id: "2",
        name: "res2",
        cuisine: "cuisine2",
        address: {
            building: "2",
            street: "str2",
            zipcode: "zcode2"
        }
    }, {
        _id: "3",
        name: "res3",
        cuisine: "cuisine1",
        address: {
            building: "3",
            street: "str3",
            zipcode: "zcode3"

        }
    }];

    return (
        <div>
            <div className="row">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-secondary"
                            type="button"
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
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-secondary"
                            type="button"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <select>
                    </select>
                    <div className="input-group-append">
                        <button
                            className="btn btn-secondary"
                            type="button"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                {restaurants.map((restaurant) => {
                    const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
                    return (
                        <div className="cards" key={restaurant._id}>
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