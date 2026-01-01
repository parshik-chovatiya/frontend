// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Mail, Lock, ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// import { authApi } from "@/lib/api/authApi";
// import { useAppDispatch } from "@/store/hooks";
// import { setUser } from "@/store/slices/_authSlice";

// export default function RegisterPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e?: React.FormEvent) => {
//     e?.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//       const res = await authApi.register({
//         email,
//         password,
//         password2: confirmPassword,
//         timezone,
//       });

//       const { user } = res.data;

//       dispatch(setUser(user));
//       toast.success("Account created successfully");

//       router.push("/onboarding");
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.detail ||
//         err?.response?.data?.email?.[0] ||
//         "Registration failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md space-y-8">
//           <h1 className="text-3xl font-bold">Create Account</h1>

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div>
//               <Label>Email</Label>
//               <Input value={email} onChange={(e) => setEmail(e.target.value)} />
//             </div>

//             <div>
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label>Confirm Password</Label>
//               <Input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>

//             <Button className="w-full" disabled={loading}>
//               {loading ? "Creating..." : "Create Account"}
//             </Button>
//           </form>

//           <p className="text-sm text-center">
//             Already have an account?{" "}
//             <Link href="/login" className="text-primary">
//               Sign in
//             </Link>
//           </p>

//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             <Link href="/">Back to Home</Link>
//           </Button>
//         </div>
//       </div>

//       <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
//         <Image src="/images/Sign_up.png" alt="" width={420} height={420} />
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { markOnboardingComplete } from '@/store/slices/onboardingSlice';
import { RootState } from '@/store/store';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const onboardingData = useSelector((state: RootState) => state.onboarding.data);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const registerResponse = await axiosInstance.post('/auth/register/', formData);
      const userData = registerResponse.data.user;

      dispatch(setUser(userData));

      if (onboardingData) {
        await axiosInstance.post('/onboarding/', onboardingData);
        dispatch(markOnboardingComplete());
      }

      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}