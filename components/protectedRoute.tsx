// // "use client";

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useAppSelector } from "@/store/hooks";

// // export function ProtectedRoute({ children }: { children: React.ReactNode }) {
// //   const router = useRouter();
// //   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
// //   const user = useAppSelector((state) => state.auth.user);

// //   useEffect(() => {
// //     // Check if user is authenticated
// //     const accessToken = localStorage.getItem('access_token');
    
// //     if (!accessToken || !isAuthenticated) {
// //       router.push('/login');
// //       return;
// //     }

// //     // Check if user has completed onboarding
// //     if (user && !user.is_onboarded) {
// //       router.push('/onboarding');
// //     }
// //   }, [isAuthenticated, user, router]);

// //   // Show loading or nothing while checking auth
// //   if (!isAuthenticated || !user?.is_onboarded) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
// //       </div>
// //     );
// //   }

// //   return <>{children}</>;
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { setUser, logout } from "@/store/slices/_authSlice";
// import { authApi } from "@/lib/api/authApi";

// type Props = {
//   children: React.ReactNode;
// };

// export  function ProtectedRoute({ children }: Props) {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const user = useAppSelector((state) => state.auth.user);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // If user already in redux → allow access
//     if (user) {
//       setLoading(false);
//       return;
//     }

//     // Otherwise verify session via backend
//     const checkSession = async () => {
//       try {
//         const res = await authApi.me(); // uses HttpOnly cookies
//         dispatch(setUser(res.data.user));
//         setLoading(false);
//       } catch (error) {
//         dispatch(logout());
//         router.replace("/login");
//       }
//     };

//     checkSession();
//   }, [user, dispatch, router]);

//   // Prevent UI flicker
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
// <div className="flex items-center justify-center pr-6">
//   <div className="animate-spin text-muted-foreground">
//     <svg
//       className="h-5 w-5"
//       viewBox="0 0 24 24"
//       fill="none"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//       />
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//       />
//     </svg>
//   </div>
// </div>
// <div>Please Wait</div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  // const { isAuthenticated } = useAuth();
  // const [checking, setChecking] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!isAuthenticated) {
  //       router.push('/login');
  //     } else {
  //       setChecking(false);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [isAuthenticated, router]);

  // if (checking) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};
