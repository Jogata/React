import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const Restaurant = () => {
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: [],
    };

    const [restaurant, setRestaurant] = useState(initialRestaurantState);

    const { id } = useParams();

    const getRestaurant = (id) => {
        RestaurantDataService.getRestaurant(id)
            .then((response) => {
                console.log(response);
                const data = response.json();
                return data;
            })
            .then((data) => {
                console.log(data);
                setRestaurant(data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        getRestaurant(id);
    }, [id]);

    return (
        <div>
            {restaurant ? (
                <div>
                    <h1>{restaurant.name}</h1>
                    <p>
                        <strong>Cuisine: </strong>
                        {restaurant.cuisine}
                        <br />
                        <strong>Address: </strong>
                        {restaurant.address.building} {restaurant.address.street},{" "}
                        {restaurant.address.zipcode}
                    </p>
                    <Link
                        to={"/restaurants/" + "id" + "/review"}
                        className="btn btn-primary"
                    >
                        Add Review
                    </Link>
                    <h4> Reviews </h4>
                    <div className="row">
                        {restaurant.reviews.length > 0 ? (
                            restaurant.reviews.map((review, index) => {
                                return (
                                    <div key={index}>
                                        <div className="card">
                                            <div className="card-body">
                                                <p className="card-text">
                                                    {review.text}
                                                    <br />
                                                    <strong>User: </strong>
                                                    {review.name}
                                                    <br />
                                                    <strong>Date: </strong>
                                                    {review.date}
                                                </p>
                                                {props.user && props.user.id === review.user_id && (
                                                    <div className="row">
                                                        <a
                                                            href="/#"
                                                            onClick={() => deleteReview(review._id, index)}
                                                            className="btn btn-primary col-lg-5 mx-1 mb-1"
                                                        >
                                                            Delete
                                                        </a>
                                                        <Link
                                                            to={{
                                                                pathname:
                                                                    "/restaurants/" +
                                                                    props.match.params.id +
                                                                    "/review",
                                                                state: {
                                                                    currentReview: review,
                                                                },
                                                            }}
                                                            className="btn"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div>
                                <p>No reviews yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <br />
                    <p>No restaurant selected.</p>
                </div>
            )}
        </div>
    );
};

export default Restaurant;