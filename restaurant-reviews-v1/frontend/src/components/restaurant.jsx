import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const Restaurant = ({ userId }) => {
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

    if (!restaurant) {
        return <p>Loading...</p>
    }

    return (
        <div className="main-content">
            {restaurant ? (
                <Card restaurant={restaurant} userId={userId} />
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

function Card({ restaurant, userId }) {
    return (
        <div className="restaurant">
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
            <h2> Reviews </h2>
            <Reviews 
                reviews={restaurant.reviews} 
                restaurantId={restaurant._id} 
                userId={userId} 
            />
        </div>
    )
}

function Reviews({ reviews, restaurantId, userId }) {
    return (
        <div className="reviews">
            {reviews.length > 0 ? (
                reviews.map((review, index) => {
                    return (
                        <Review 
                            key={index}
                            review={review} 
                            restaurantId={restaurantId} 
                            userId={userId}
                         />
                    );
                })
            ) : (
                <div className="empty-reviews-section">
                    <p>No reviews yet.</p>
                </div>
            )}
        </div>
    )
}

function Review({ review, restaurantId, userId }) {
    const isOwner = userId && userId === review.user_id;

    const deleteReview = (reviewId, index) => {
        console.log("todo: delete review");
    };

    return (
        <div className="review">
            <div className="card">
                <div className="card-body">
                    <p className="card-text">{review.text}</p>
                    <dl>
                        <div className="row">
                            <dt>User:</dt>
                            <dd>{review.name}</dd>
                        </div>
                        <div className="row">
                            <dt>Date:</dt>
                            <dd>{new Date(review.date).toLocaleDateString()}</dd>
                        </div>
                    </dl>
                    {/* {userId && userId === review.user_id && ( */}
                    {isOwner && (
                        <div className="row">
                            <button
                                className="btn"
                                onClick={() => onDelete(review._id, index)}
                            >
                                Delete
                            </button>
                            <Link
                                to={{
                                    pathname:
                                        "/restaurants/" +
                                        restaurantId +
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
    )
}

export default Restaurant;