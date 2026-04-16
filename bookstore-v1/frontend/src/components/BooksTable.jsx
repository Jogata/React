import { Link } from "react-router-dom";

const BooksTable = ({ books }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Title</th>
          <th className="author-col">Author</th>
          <th className="year-col">Publish Year</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={book._id}>
            <td>
              {index + 1}
            </td>
            <td>
              {book.title}
            </td>
            <td className="author-col">
              {book.author}
            </td>
            <td className="year-col">
              {book.publishYear}
            </td>
            <td>
              <div>
                <Link to={`/books/details/${book._id}`}>
                    <i className="ri-information-line"></i>
                </Link>
                <Link to={`/books/edit/${book._id}`}>
                    <i className="ri-edit-line"></i>
                </Link>
                <Link to={`/books/delete/${book._id}`}>
                    <i className="fa fa-trash-o"></i>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BooksTable;