import { useState, useEffect } from "react";
import {User} from "../interfaces/User";

function useFetchUsers(apiUrl: string) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            const mappedUsers = data.map((item: any) => ({
                username: item.username,
                score: item.score,
                profile_pic: item.profile_pic,
            }));

            setUsers(mappedUsers);
        } catch (error: any) {
            setError(error.message || "An error occurred while fetching users.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [apiUrl]);

    return { users, isLoading, error, refetch: fetchUsers };
}

export default useFetchUsers;
