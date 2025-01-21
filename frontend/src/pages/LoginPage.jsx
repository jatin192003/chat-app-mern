import React, { useState } from 'react';
import { RiMessage3Fill } from "react-icons/ri";
import { LuMail } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();

    const onSubmit = (data) => {
        console.log("Form data submitted", data);

        dispatch(login(data))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                // Handle errors from the login action
                if (error === "Invalid credentials") {
                    // Example of setting a general error (not tied to a specific field)
                    setError("root", {
                        type: "manual",
                        message: "Invalid credentials",
                    });
                } else if (error === "user not found") {
                    setError("root", {
                        type: "manual",
                        message: "user not found",
                    });
                }
                else {
                    // Handle other errors (e.g., network issues)
                    setError("root", {
                        type: "manual",
                        message: "Login failed. Please try again later.",
                    });
                    console.log(error);

                }
            });
    };

    return (
        <div className='h-screen'>
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
                            >
                                <RiMessage3Fill className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Sign in to your account</p>
                        </div>
                    </div>

                    {/* Display general error message (if any) */}
                    {errors.root && (
                        <div className="alert alert-error">
                            <span>{errors.root.message}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email or username Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email or Username</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LuMail className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Enter Username or Email"
                                    {...register('username', { required: 'Username or Email is required' })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LuLock className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="••••••••"
                                    {...register('password', {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaRegEyeSlash className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <FaRegEye className="h-5 w-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full">
                            Sign In
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="link link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}