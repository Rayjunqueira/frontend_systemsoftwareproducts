import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { InvalidRoute } from "../App";

export const RequireNotAuth = ({ children }: { children: JSX.Element }) => {
    const auth = useContext(AuthContext);

    if (auth.user) {
        return <InvalidRoute />
    }

    return children;
}