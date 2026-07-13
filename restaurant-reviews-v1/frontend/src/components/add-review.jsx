import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const AddReview = ({ user }) => {
    const [review, setReview] = useState("");
    const { id: restaurantId } = useParams();
    const { state } = useLocation();
    console.log(state);
    // console.log(restaurantId);
    let submitted = true;
    const editing = Boolean(state?.currentReview);

    if (!user) {
        return (
            <div className="message-section">
                <h1>Please log in.</h1>
                <Link to="/login">Login</Link>
            </div>
        );
    }

    const handleInputChange = (event) => {
        setReview(event.target.value);
    };

    if (submitted) {
        return <SubmitSuccess restaurantId={restaurantId} />;
    }

    return (
        <div>
            {user ? (
                <div className="submit-form">
                    {submitted ? (
                        <SubmitSuccess restaurantId={restaurantId} />
                    ) : (
                        <ReviewInputForm editing={editing} />
                        // <div>
                        //     <div className="form-group">
                        //         <label htmlFor="description">
                        //             {editing ? "Edit" : "Create"} Review
                        //         </label>
                        //         <input
                        //             type="text"
                        //             id="text"
                        //             name="text"
                        //             className="form-control"
                        //             required
                        //         />
                        //     </div>
                        //     <button className="btn btn-primary">
                        //         Submit
                        //     </button>
                        // </div>
                    )}
                </div>
            ) : (
                // <div>Please log in.</div>
                null
            )}
        </div>
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

function ReviewInputForm({ editing }) {
    function onSubmit() {
        console.log("todo create review");
    }

    return (
        <form onSubmit={onSubmit} className="submit-form">
            <div className="flex flex-col gap-1">
                <label htmlFor="description">
                    {editing ? "Edit" : "Create"} Review
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
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