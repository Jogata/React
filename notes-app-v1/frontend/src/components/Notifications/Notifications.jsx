import { useEffect, useRef } from "react";

export function Notifications({ notifications, removeNotification }) {
    const popoverRef = useRef(null);

    useEffect(() => {
        const popoverNode = popoverRef.current;
        if (!popoverNode) return;

        if (notifications.length > 0) {
            popoverNode.showPopover();
        } else {
            popoverNode.hidePopover();
        }
    }, [notifications.length]);

    return (
        <div className="toast-container" ref={popoverRef} popover="manual" role="status">
            {notifications.map(toast => (
                <Notification key={toast.id} toast={toast} onDismiss={removeNotification} />
            ))}
        </div>
    );
}