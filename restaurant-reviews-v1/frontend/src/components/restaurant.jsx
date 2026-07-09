import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState(null);

    const { id } = useParams();

    const getRestaurant = (id) => {
        RestaurantDataService.getRestaurant(id)
            .then((response) => {
                // console.log(response);

                if (response.ok) {
                    const data = response.json();
                    return data;
                } else {
                    throw new Error("not found");
                }
            })
            .then((data) => {
                // console.log(data);
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
                <Card restaurant={restaurant} />
            ) : (
                <NotFound />
            )}
        </div>
    );
};

function NotFound() {
    return (
        <div className="not-found-section">
            <h1>Restaurant not found</h1>
        </div>
    )
}

function Card({ restaurant }) {
    return (
        <div className="restaurant-card">
            <h1>{restaurant.name}</h1>
            <dl>
                <div className="row">
                    <dt>Cuisine:</dt>
                    <dd>{restaurant.cuisine}</dd>
                </div>

                <div className="row">
                    <dt>Address:</dt>
                    <dd>
                        {restaurant.address.building} {restaurant.address.street},{" "}
                        {restaurant.address.zipcode}
                    </dd>
                </div>
            </dl>
            <Link
                to={"/restaurants/" + restaurant._id + "/review"}
                className="btn btn-primary"
            >
                Add Review
            </Link>
            <h4> Reviews </h4>
            <Reviews reviews={restaurant.reviews} />
        </div>
    )
}

function Reviews({ reviews }) {
    return (
        <div className="row">
            {reviews.length > 0 ? (
                reviews.map((review, index) => {
                    return (
                        <div className="review" key={index}>
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
                                                        restaurant._id +
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
    )
}

export default Restaurant;