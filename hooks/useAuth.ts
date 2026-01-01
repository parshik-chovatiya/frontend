// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { setUser, clearUser } from '@/store/slices/authSlice';
// import axiosclient from '@/lib/axiosClient';

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axiosclient.get('/auth/me/');
//         dispatch(setUser(response.data));
//       } catch (error) {
//         dispatch(clearUser());
//       }
//     };

//     if (!isAuthenticated) {
//       checkAuth();
//     }
//   }, [dispatch, isAuthenticated]);

//   return { user, isAuthenticated };
// };

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { setUser, clearUser } from '@/store/slices/authSlice';
import axiosInstance from '@/lib/axios';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/me/');
        dispatch(setUser(response.data));
      } catch (error) {
        dispatch(clearUser());
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [dispatch, isAuthenticated]);

  return { user, isAuthenticated };
};

