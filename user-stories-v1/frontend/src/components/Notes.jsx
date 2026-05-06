import Loader from "./Loader";

const Notes = () => {
    const isLoading = false;
    const isError = false;
    const error = {};
    const isSuccess = true;
    const tableContent = [];

    let content;

    // if (isLoading) content = <p>Loading...</p>
    if (isLoading) content = <Loader />

    if (isError) {
        content = <p>{error.message}</p>
    }

    if (isSuccess) {
        content = (
            <table className="table notes">
                <thead className="table-thead">
                    <tr>
                        <th className="table-th note-status">Username</th>
                        <th className="table-th note-created">Created</th>
                        <th className="table-th note-updated">Updated</th>
                        <th className="table-th note-title">Title</th>
                        <th className="table-th note-username">Owner</th>
                        <th className="table-th note-edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content;
}

export default Notes;