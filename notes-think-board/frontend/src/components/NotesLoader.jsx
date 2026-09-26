import { Outlet } from "react-router";
import { useEffect, useState } from "react";

import { notesApi } from "../services/notes";
import { useNotes } from "../context/NotesProvider";

function NotesLoader() {
    const [ loading, setLoading ] = useState(false);

    const { notes, initializeNotes } = useNotes();

    useEffect(() => {
        let controller = new AbortController();

        if (notes == null) {
            console.log(notes);
            loadNotes();
        }

        async function loadNotes() {
            setLoading(true);
            try {
                const notes = await notesApi.getAllNotes(controller);
                initializeNotes(notes);
                // setError(null);
                controller = null;
            } catch (error) {
                // setError(err.message);
                if (error.name === "AbortError") {
                    console.log("Fetch safely aborted by layout unmount");
                    return;
                }

                controller = null;
                console.log("Error fetching notes");
                console.log(error.message);
                console.log("Failed to load notes");
            } finally {
                if (controller === null) {
                    setLoading(false);
                }
            }
        }

        return () => {
            if (controller) {
                controller.abort();
            }
        }
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return <Outlet />;
}

const Spinner = () => {
    return (
        <span
            className="loader"
            role="status"
            aria-live="polite"
        >
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
            <span className="sr-only">Loading content, please wait.</span>
        </span>
    )
}  

export default NotesLoader;