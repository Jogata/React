import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";
import { UserContext } from "../App";

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        const getRestaurant = (id) => {
            RestaurantDataService.getRestaurant(id)
                .then((response) => {
    
                    if (response.ok) {
                        const data = response.json();
                        return data;
                    } else {
                        throw new Error("not found");
                    }
                })
                .then((data) => {
                    setRestaurant(data);
                })
                .catch((e) => {
                    console.log(e);
                });
        };

        getRestaurant(id);
    }, [id]);

    if (!restaurant) {
        return <Loader />;
    }

    return (
        <div className="main-content">
            {restaurant ? (
                <Card 
                    restaurant={restaurant} 
                    setRestaurant={setRestaurant} 
                    // userId={userId} 
                />
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

function Card({ restaurant, setRestaurant }) {
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
                to={`/restaurants/${restaurant._id}/review`}
                className="btn btn-primary"
            >
                Add Review
            </Link>
            <h2> Reviews </h2>
            <Reviews
                reviews={restaurant.reviews}
                restaurantId={restaurant._id}
                setRestaurant={setRestaurant}
                // userId={userId}
            />
        </div>
    )
}

function Reviews({ reviews, restaurantId, setRestaurant }) {
    // const [user] = useState(() => localStorage.getItem("user"));
    const {user} = useContext(UserContext);
    const userId = user?.id;

    useEffect(() => {
        function checkStorage() {
            console.log("storage");
        }

        window.addEventListener("storage", checkStorage);

        return () => window.removeEventListener("storage", checkStorage);
    })

    return (
        <div className="reviews cards">
            {reviews.length > 0 ? (
                reviews.map((review, index) => {
                    return (
                        <Review
                            key={index}
                            review={review}
                            restaurantId={restaurantId}
                            setRestaurant={setRestaurant}
                            userId={userId}
                            index={index}
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

function Review({ review, restaurantId, setRestaurant, userId, index }) {
    const isOwner = userId && userId === review.user_id;

    const deleteReview = (reviewId, index) => {
        const confirmed = window.confirm("Are you sure you want to permanently delete this review?");

        if (!confirmed) return;

        RestaurantDataService.deleteReview(reviewId, userId)
            .then((response) => {
                const result = response.json();
                return result;
            })
            .then(data => {
                if (data?.status === "success") {
                    setRestaurant((prevState) => {
                        const newReviews = [...prevState.reviews];
                        newReviews.splice(index, 1);
                        return {
                            ...prevState, 
                            reviews: newReviews
                        };
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            });
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
                    {isOwner && (
                        <div className="row actions">
                            <button
                                className="btn"
                                onClick={() => deleteReview(review._id, index)}
                            >
                                Delete
                            </button>
                            <Link
                                to={`/restaurants/${restaurantId}/review`}
                                state={{ currentReview: review }}
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

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {

    if (!isOpen) return null;

    return (
        <div>
            <div>
                <h3>
                    {title || "Are you sure?"}
                </h3>

                <p>
                    {message || "This action cannot be undone. Please confirm to proceed."}
                </p>

                <div>
                    <button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Restaurant;