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
                <>
                <Card restaurant={restaurant} />
                <Card1>
                <RestaurantName name={"test"} />
                </Card1>
                </>
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

function Card({ restaurant1 }) {
    const [restaurant, setRestaurant] = useState({
        name: "res1", 
        cuisine: "cuisine1", 
        reviews: [], 
        address: {
            building: "1", 
            street: "street1", 
            zipcode: "1000"}
        });

    const changeState = () => {
        setRestaurant(old => {
            // console.log(old);
            const newRes = {...old};
            return newRes;
        })
    }

    return (
        <div className="restaurant-card">
            {/* <h1>{restaurant.name}</h1> */}
            <RestaurantName name={restaurant.name} />
            <RestaurantName2 restaurant={restaurant} />
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
            <button onClick={changeState}>Change State</button>
            <h2> Reviews </h2>
            <Reviews reviews={restaurant.reviews} restaurantId={restaurant._id} />
        </div>
    )
}

function Card1({children}) {
    const [restaurant, setRestaurant] = useState({
        name: "res2", 
        cuisine: "cuisine1", 
        reviews: [], 
        address: {
            building: "1", 
            street: "street1", 
            zipcode: "1000"}
        });

    const changeState = () => {
        setRestaurant(old => {
            // console.log(old);
            const newRes = {...old};
            return newRes;
        })
    }

    return (
        <div className="restaurant-card">
            {/* <h1>{restaurant.name}</h1> */}
            {/* <RestaurantName name={"test"} /> */}
            <RestaurantName2 restaurant={restaurant} />
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
            <button onClick={changeState}>Change State</button>
            <h2> Reviews </h2>
            <Reviews reviews={restaurant.reviews} restaurantId={restaurant._id} />
        </div>
    )
}

function Reviews({ reviews, restaurantId }) {
    return (
        <div className="row">
            {reviews.length > 0 ? (
                reviews.map((review, index) => {
                    return (
                        <Review review={review} restaurantId={restaurantId} />
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

function Review({ review, restaurantId }) {
    return (
        <div className="review" key={index}>
            <div className="card">
                <div className="card-body">
                    {/* <p className="card-text">
                        {review.text}
                        <br />
                        <strong>User: </strong>
                        {review.name}
                        <br />
                        <strong>Date: </strong>
                        {review.date}
                    </p> */}
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

function RestaurantName({name}) {
    console.log("179" + name);
    return (
        <h1>{name}</h1> 
    )
}

function RestaurantName2({restaurant}) {
    console.log("186" + restaurant.name);
    return (
        <h1>{restaurant.name}</h1> 
    )
}

export default Restaurant;