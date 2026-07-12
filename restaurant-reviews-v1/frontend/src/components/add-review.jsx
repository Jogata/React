import { Link } from "react-router-dom";

const AddReview = (props) => {
    const [review, setReview] = useState("");
    let submitted = true;
    let editing = true;

    return (
        <div>
            {props.user ? (
                <div className="submit-form">
                    {submitted ? (
                        <div>
                            <h4>You submitted successfully!</h4>
                            <Link
                                // to={"/restaurants/" + id}
                                className="btn btn-success"
                            >
                                Back to Restaurant
                            </Link>
                        </div>
                    ) : (
                        <div>
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
                            <button className="btn">
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

export default AddReview;