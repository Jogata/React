import { useEffect, useRef, useState } from "react";
import { notesApi } from "../../services/notes";
import { useNotes } from "../../context/NotesProvider";
import { useNotify } from "../../context/NotificationProvider";
import { useCallback } from "react";
import Notes from "../Notes/Notes";
import NotesNotFound from "../Notes/NotesNotFound";

const HomePage = () => {
    const { notes, updateNote, deleteNote } = useNotes();

    const { addNotification } = useNotify();

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ note, setNote ] = useState(null);

    const setModalMode = () => console.log("todo setModalMode");

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    if (!notes) {
        return <h1>Data not received</h1>;
    }

    if (notes.length == 0) {
        return <NotesNotFound />;
    }

    const handleDeleteNote = useCallback( async id => {
        try {
            // const response = 
            await notesApi.deleteNote(id);
            // const response = 
            // await notesApi.deleteNote("nvfdsbhk");

            deleteNote(id);
            // console.log("Note deleted successfully");
            addNotification("Note deleted successfully", "success");
        } catch (error) {
            console.log("Error in handleDelete: ", error.message);
            // console.log("Failed to delete note");
            addNotification("Failed to delete note", "error");
            addNotification(error.message, "error");
        }
    }, [])

    const handleUpdateNote = useCallback(async updatedNote => {
        if (!updatedNote.title || !updatedNote.content) {
            addNotification("Please fill in all fields.", "error");
            return;
        }

        try {
            const response = await notesApi.updateNote(updatedNote);
            setNote(null);
            updateNote(response);
            addNotification(`Note ${updatedNote.title} updated`);
            closeModal();
        } catch (error) {
            console.log(error);
            // console.log(error.status, error.errors);
            // const keys = Object.keys(error.errors);
            // console.log(keys);
            // keys.forEach(key => {
            //     console.log(key);
            //     addNotification(error.errors[key], "error")
            // });
            // error.errors.forEach(error => {
            addNotification(error.message, "error");
            // })
        }
    }, [])

    return (
        <>
            <Notes 
                notes={notes} 
                handleDeleteNote={handleDeleteNote} 
                openModal={openModal} 
                setNote={setNote} 
            />

            <Modal
                isModalOpen={isModalOpen}
                setModalMode={setModalMode}
                onClose={closeModal}
                title={"Edit Note"}
            >
                {isModalOpen ? 
                    <Form 
                        note={{ ...note }} 
                        handleUpdateNote={handleUpdateNote} 
                    /> 
                    : null
                }
            </Modal>
        </>
    )
};

function Modal({ isModalOpen, setModalMode, onClose, title, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialogNode = dialogRef.current;
        if (!dialogNode) return;

        if (isModalOpen) {
            dialogNode.showModal();
            setModalMode(true);
        } else {
            dialogNode.close();
            setModalMode(false);
        }

        return () => {
            setModalMode(false);
        };
    }, [isModalOpen]);

    return (
        <dialog
            className="modal"
            ref={dialogRef}
            onClose={onClose}
            onClick={onClose}
        >
            <header>
                <button type="button" className="icon" onClick={onClose}>
                    <span className="sr-only">Close Modal</span>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                <h2 id="modal-title">{title}</h2>
            </header>

            <div className="modal-body" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </dialog>
    );
}

function Form({ note, handleUpdateNote }) {
    const [updatedNote, setUpdatedNote] = useState(note);
    const [saving, setSaving] = useState(false);

    function handleInputChange(e) {
        setUpdatedNote(old => {
            console.log(e.target.name, e.target.value);
            return {
                ...old,
                [e.target.name]: e.target.value
            }
        })
    }

    async function handleSubmitForm(e) {
        e.preventDefault();

        if (saving) {
            console.log("The note is currently being updated.");
            return;
        }

        try {
            setSaving(true);
            await handleUpdateNote(updatedNote);
        } catch (error) {
            console.log("Note wasn't updated");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="modal-form centered"
            onSubmit={handleSubmitForm}
        >
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input
                    type="text"
                    name="title"
                    className="input input-bordered"
                    value={updatedNote.title}
                    onChange={handleInputChange}
                    placeholder="Note Title"
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Content</span>
                </label>
                <textarea
                    className="textarea textarea-bordered"
                    name="content"
                    value={updatedNote.content}
                    onChange={handleInputChange}
                    placeholder="Write your note here..."
                />
            </div>

            <button
                type="submit"
                className="btn"
            >
                {saving ? "Saving..." : "Edit Note"}
            </button>
        </form>
    )
}

// const HomePage = () => {
//     const { notes, deleteNote } = useNotes();

//     const { addNotification } = useNotify();

//     if (!notes) {
//         return <h1>Data not received</h1>;
//     }

//     if (notes.length == 0) {
//         return <NotesNotFound />;
//     }

//     async function handleDeleteNote(id) {
//         try {
//             await notesApi.deleteNote(id);

//             deleteNote(id);
//             addNotification("Note deleted successfully", "success");
//         } catch (error) {
//             console.log("Error in handleDelete: ", error.message);
//             addNotification("Failed to delete note", "error");
//             addNotification(error.message, "error");
//         }
//     };

//     return (
//         <>
//             <Notes 
//                 notes={notes} 
//                 handleDeleteNote={handleDeleteNote} 
//                 openModal={openModal} 
//                 setNote={setNote} 
//             />
//         </>
//     )
// };

export default HomePage;