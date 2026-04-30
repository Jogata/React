import User from "../../../backend/models/User";

const Users = () => {
    const {
        users,
        isLoading,
        isSuccess,
        isError,
        error
    } = {
        users: [], 
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: {}
    };

    console.log(isLoading);

    let content;

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error.message}</p>
    }

    if (isSuccess) {
        const tableContent = users.length > 0 ? (
            ids.map(user => (
                // <div className="user" key={user._id}>
                //     <h1>{user.name}</h1>
                // </div>
                <User userId={user._id} key={user._id} />
            ))
        ) : (
            <p>no users to display</p>
        )

        content = (
            <table className="table users">
                <thead className="table-thead">
                    <tr>
                        <th className="table-th user-username">Username</th>
                        <th className="table-th user-roles">Roles</th>
                        <th className="table-th user-edit">Edit</th>
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

export default Users;