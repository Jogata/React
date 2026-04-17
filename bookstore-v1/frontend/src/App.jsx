import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateBook from "./pages/CreateBook";
import BookDetails from "./pages/BookDetails";
import DeleteBook from "./pages/DeleteBook";
import EditBook from "./pages/EditBook";

function App() {
  return (
    // <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/create" element={<CreateBook />} />
        <Route path="/books/details/:id" element={<BookDetails />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/delete/:id" element={<DeleteBook />} />
      </Routes>
    // </>
  )
}

export default App;
