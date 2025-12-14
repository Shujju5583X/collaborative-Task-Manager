import { useQuery } from '@tanstack/react-query';
import { authService } from '../services';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => authService.getUsers(),
    });
};
