import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const AddReview = ({ user }) => {
    const [review, setReview] = useState("");
    const { id: restaurantId } = useParams();
    const { state } = useLocation();
    console.log(state);
    // console.log(restaurantId);
    // let user = {};
    let submitted = true;
    const editing = Boolean(state?.currentReview);
    // let editing = false;

    // if (state) {
    //     if (state.currentReview) {
    //         editing = true;
    //     }
    // }

    // if (state && state.currentReview) {
    //         editing = true;
    // }

    if (submitted) {
        return <SubmitSuccess restaurantId={restaurantId} />;
    }

    return (
        <div>
            {user ? (
                <div className="submit-form">
                    {submitted ? (
                        <SubmitSuccess restaurantId={restaurantId} />
                        // <div>
                        //     <h4>You submitted successfully!</h4>
                        //     <Link
                        //         to={"/restaurants/" + restaurantId}
                        //         className="btn btn-success"
                        //     >
                        //         Back to Restaurant
                        //     </Link>
                        // </div>
                    ) : (
                        <div>
                            {/* <span className="flex items-center gap-2">
            <svg 
                className="animate-spin h-5 w-5 text-white" 
        xmlns="http://w3.org" 
        fill="none" 
        viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
        </svg> 
        Saving Review...
          </span> */}
                            <div className="form-group">
                                <label htmlFor="description">
                                    {editing ? "Edit" : "Create"} Review
                                </label>
                                <input
                                    type="text"
                                    id="text"
                                    name="text"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <button className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>Please log in.</div>
            )}
        </div>
    );
};

function SubmitSuccess({ restaurantId }) {
    return (
        <div className="response-section">
            <h1>You submitted successfully!</h1>
            <Link
                to={`/restaurants/${restaurantId}`}
            >
                Back to Restaurant
            </Link>
        </div>
    );
}

export default AddReview;