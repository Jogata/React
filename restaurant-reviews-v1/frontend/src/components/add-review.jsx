import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import RestaurantDataService from "../services/restaurant";

const AddReview = ({ user }) => {
    const [submitted, setSubmitted] = useState(false);

    const { id: restaurantId } = useParams();
    const { state } = useLocation();
    console.log(state);
    // console.log(restaurantId);
    // let submitted = true;
    const editing = Boolean(state?.currentReview);

    if (!user) {
        return (
            <div className="message-section">
                <h1>Please log in.</h1>
                <Link to="/login">Login</Link>
            </div>
        );
    }

    if (submitted) {
        return <SubmitSuccess restaurantId={restaurantId} />;
    }

    return (
        <ReviewInputForm
            editing={editing}
            user={user}
            restaurantId={restaurantId}
            setSubmitted={setSubmitted}
            currentReview={state?.currentReview}
        />
    );
};

function SubmitSuccess({ restaurantId }) {
    return (
        <div className="message-section">
            <h1>You submitted successfully!</h1>
            <Link
                to={`/restaurants/${restaurantId}`}
            >
                Back to Restaurant
            </Link>
        </div>
    );
}

function ReviewInputForm({ editing, setSubmitted, restaurantId, user, currentReview }) {
    const [review, setReview] = useState(() => editing ? currentReview.text : "");

    const handleInputChange = (event) => {
        setReview(event.target.value);
    };

    async function onSubmit(e) {
        e.preventDefault();

        // if (isSubmitting) return;

        const data = {
            text: review,
            name: user.name,
            user_id: user.id,
            restaurant_id: restaurantId,
        };
        // console.log(data);

        if (editing) {
            data.review_id = currentReview._id;
            RestaurantDataService.updateReview(data)
                .then((response) => {
                    console.log(response);
                    setSubmitted(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            try {
                const response = await RestaurantDataService.createReview(data);
                console.log(response);
                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    setSubmitted(true);
                } else {
                    throw new Error("Review wasn't created");
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    return (
        <form onSubmit={onSubmit} className="submit-form">
            <div className="form-group">
                <label htmlFor="description">
                    {editing ? "Edit" : "Create"} Review
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                    value={review}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </form>
    );
}

export default AddReview;