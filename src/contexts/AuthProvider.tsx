import { useEffect, useState } from "react"
import { useApi } from "../hooks/useApi";
import { AuthContext } from "./AuthContext";

export type User = {
    createdAt: string;
    email: string;
    name: string;
    password: string;
    user_id: string;
}

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null); 

    const api = useApi();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const storageData = localStorage.getItem('authorization');
                if (storageData) {
                    const data = await api.verifyToken(storageData);
                    if (data.success) { 
                        setUser(data.data); 
                        setToken(storageData);
                    } else { 
                        console.log(data.error);
                    }  
                }
            } catch(err) {  
                console.log(err);
            }
        }
        validateToken();
    }, []);

    const signin = async (email: string, password: string) => {
        const data = await api.authenticateUser(email, password);
        if (data.data) {
            setUser(data.data.user);
            setToken(data.data.token);
            localStorage.setItem('authorization', data.data.token); 

            return true;            
        } 
        return false;
    }

    return (
        <AuthContext.Provider value={{ user, token, signin }}>
            { children }
        </AuthContext.Provider>
    );
};