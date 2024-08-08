import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useEnsureUser = (username: string) => {
    const router = useRouter();

    useEffect(() => {
        if (username === "") {
            router.push("/");
        }
    }, [username, router]);
};

export default useEnsureUser;