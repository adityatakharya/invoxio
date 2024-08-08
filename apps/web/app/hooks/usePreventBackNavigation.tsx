import { useEffect } from 'react';

const usePreventBackNavigation = () => {
    useEffect(() => {
        const handlePopState = () => {
            window.location.replace("/");
        };

        history.pushState(null, window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);
};

export default usePreventBackNavigation;
