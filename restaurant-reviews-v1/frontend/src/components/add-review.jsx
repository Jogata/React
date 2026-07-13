import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const AddReview = ({ user }) => {
    // const [review, setReview] = useState("");
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

    // const handleInputChange = (event) => {
    //     setReview(event.target.value);
    // };

    // function onSubmit() {
    //     console.log("todo create review");
    // }

    // const handleInputChange = (event) => {
    //     setReview(event.target.value);
    // };

    return <ReviewInputForm editing={editing} restaurantId={restaurantId} setSubmitted={setSubmitted} user={user} />;

    // return (
    //     <div>
    //         {user ? (
    //             <div className="submit-form">
    //                 {submitted ? (
    //                     <SubmitSuccess restaurantId={restaurantId} />
    //                 ) : (
    //                     <ReviewInputForm editing={editing} />
    //                 )}
    //             </div>
    //         ) : (
    //             null
    //         )}
    //     </div>
    // );
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

function ReviewInputForm({ editing, setSubmitted, restaurantId, user }) {
    const [review, setReview] = useState("review description 1");

    const handleInputChange = (event) => {
        setReview(event.target.value);
    };

    function onSubmit(e) {
        e.preventDefault();
        console.log("todo create review");
        const data = {
            text: review,
            name: user.name,
            user_id: user.id,
            restaurant_id: restaurantId,
        };
        console.log(data);
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