import { useEffect, useState } from "react";

export function Notification({ toast, onDismiss }) {
    const [fadeout, setFadeout] = useState(false)
    const id = toast.id;

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeout(true);
        }, 6000);

        return () => clearTimeout(timer);
    }, [onDismiss, id]);

    // const accessibilityRole = toast.type === "error" ? "alert" : "status";
    const notificationClassName = fadeout ? `toast-box ${toast.type} fade-out` : `toast-box ${toast.type}`;

    return (
        // <div className={`toast-box ${toast.type}`} role={accessibilityRole}>
        <div className={notificationClassName} onAnimationEnd={() => onDismiss(id)}>
            <p>{toast.message}</p>
            <button
                type="button"
                onClick={() => onDismiss(id)}
                aria-label="Dismiss alert"
            >
                <span>X</span>
            </button>
        </div>
    );
}  