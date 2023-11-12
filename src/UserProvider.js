import {createContext, useState} from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const alreadyLogged = JSON.parse(sessionStorage.getItem('authUser'))
    const [isAuthorized, setIsAuthorized] = useState(alreadyLogged ?? false);

    const value = {
        isAuthorized,
        setIsAuthorized
    };

    sessionStorage.setItem('authUser', JSON.stringify(isAuthorized))

    return (
        <UserContext.Provider value={value}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;