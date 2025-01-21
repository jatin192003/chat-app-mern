import React, { useState } from 'react';
import { RiMessage3Fill } from "react-icons/ri";
import { LuMail } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register as registerUser } from "../store/slice/authSlice"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form data submitted", data);
    // Add your registration logic here
    dispatch(registerUser(data)).unwrap().then(() => {
      navigate("/login");
    }).catch((error) => {
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
    })
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className="p-4 sm:p-8 w-full max-w-2xl">
        <div className="space-y-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <RiMessage3Fill className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create an Account</h1>
              <p className="text-base-content/60">Get started by filling in the information below</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                    {...register('fullName', { required: "Full Name is required" })}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>

              {/* Username Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 ${errors.username ? 'border-red-500' : ''}`}
                    placeholder="johndoe123"
                    {...register('username', { required: "Username is required" })}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuMail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="you@example.com"
                    {...register('email', {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      }
                    })}
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

              {/* Confirm Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirm Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuLock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: "Confirm Password is required",
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

              {/* Gender Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Gender</span>
                </label>
                <div className="flex">
                  <label className="cursor-pointer label">
                    <input type="radio" name="gender" value="male" className="radio checked:bg-primary"
                      {...register('gender', { required: "Gender is required" })}
                    />
                    <span className="label-text ml-2">Male</span>
                  </label>
                  <label className="cursor-pointer label ml-4">
                    <input type="radio" name="gender" value="female" className="radio checked:bg-primary"
                      {...register('gender', { required: "Gender is required" })}
                    />
                    <span className="label-text ml-2">Female</span>
                  </label>
                </div>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              Sign Up
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}