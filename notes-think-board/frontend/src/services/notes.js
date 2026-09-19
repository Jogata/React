async function getAllNotes() {
    const response = await fetch("http://localhost:5000/api/notes", {
        signal: controller.signal
    });

    const contentType = response.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
        result = await response.json();
    } else {
        result = await response.text();
    }

    if (response.ok) {
        return result;
    } else {
        const errorMessage = result.message || "An error occurred";
        throw new Error(errorMessage);
    }
}

async function getNoteByID(id) {
    console.log(id);
    const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        signal: controller.signal
    });

    const contentType = response.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
        result = await response.json();
    } else {
        result = await response.text();
    }

    if (response.ok) {
        return result;
    } else {
        const errorMessage = result.message || "An error occurred";
        throw new Error(errorMessage);
    }
}

async function createNote(data) {
    const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    console.log(response);

    const contentType = response.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
        result = await response.json();
    } else {
        result = await response.text();
    }
    console.log(result);

    if (response.ok) {
        return result;
    } else {
        const errorMessage = result.message || "An error occurred during creation";
        throw new Error(errorMessage);
    }
}

export const notesApi = {
    getAllNotes, 
    getNoteByID, 
    createNote, 
    updateNote, 
    deleteNote
}