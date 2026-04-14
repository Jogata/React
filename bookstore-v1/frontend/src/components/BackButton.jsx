import { Link } from "react-router-dom";

const BackButton = ({ destination = "/" }) => {
  return (
    <div className="back-btn" title="Back to previous page">
      <Link to={destination}>
        Back to previous page
        <i className="fa fa-angle-double-left"></i>
      </Link>
    </div>
  );
};

export default BackButton;