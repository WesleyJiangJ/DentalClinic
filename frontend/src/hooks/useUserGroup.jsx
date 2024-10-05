import React from 'react';
import { useUser } from '../contexts/UserContext.jsx';

export function useUserGroup() {
    const { userGroup, userID } = useUser();
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        if (userGroup !== null || userID !== null) {
            setIsLoading(false);
        }
    }, [userGroup]);
    return { isLoading, userGroup, userID };
}