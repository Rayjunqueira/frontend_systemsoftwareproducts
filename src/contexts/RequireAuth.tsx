import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import Authpage from "../pages/Authpage";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const auth = useContext(AuthContext);

    if (!auth.user) {
        return <Authpage />
    }

    return children;
}