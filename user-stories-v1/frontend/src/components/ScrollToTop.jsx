import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// export default function ScrollToTop() {
//     const { pathname } = useLocation();

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [pathname]);

//     return null;
// }
export function ScrollToTop() {
    const { pathname } = useLocation();
    const top = useRef(null);
    
    useLayoutEffect(() => {
        // there is a bug - scrollTo(0, 0) doesn't work
        // window.scrollTo(1, 0);
        top.current.scrollIntoView();
        console.log("ScrollToTop");
    }, [pathname]);

    return (
        <div ref={top}></div>
    )
}