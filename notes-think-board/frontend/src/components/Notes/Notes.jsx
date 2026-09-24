import NoteCard from "./NoteCard";

function Notes({ notes, handleDeleteNote, openModal, setNote }) {
    console.log("notes rerendered");
    return (
        <div className="section notes-section">
            <h1 className="section-title">Notes</h1>
            <div className="notes">
                {notes.map(note => (
                    <NoteCard 
                        key={note._id} 
                        note={note} 
                        handleDeleteNote={handleDeleteNote} 
                        openModal={openModal}
                        setNote={setNote}
                    />
                ))}
            </div>
        </div>
    )
}

export default Notes;