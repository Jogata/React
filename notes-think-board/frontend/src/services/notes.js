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

export const notesApi = {
    getAllNotes, 
    getNoteByID, 
    createNote, 
    updateNote, 
    deleteNote
}