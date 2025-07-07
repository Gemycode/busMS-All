"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for form data and UI controls
  const [activeTab, setActiveTab] = useState("signin")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [image, setImage] = useState(null)

  // Form data
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [userRole, setUserRole] = useState("")
  const [phone, setPhone] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Form validation errors
  const [formErrors, setFormErrors] = useState({})

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.user);
  const fileInputRef = useRef();

  // Validation functions
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }))
      return false
    } else if (!emailRegex.test(email)) {
      setFormErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      return false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
      return true
    }
  }

  const validatePassword = () => {
    if (!password) {
      setFormErrors((prev) => ({ ...prev, password: "Password is required" }))
      return false
    } else if (password.length < 8) {
      setFormErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }))
      return false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.password
        return newErrors
      })
      return true
    }
  }

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password" }))
      return false
    } else if (confirmPassword !== password) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
      return false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.confirmPassword
        return newErrors
      })
      return true
    }
  }

  const validateName = () => {
    let isValid = true

    if (!firstName) {
      setFormErrors((prev) => ({ ...prev, firstName: "First name is required" }))
      isValid = false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.firstName
        return newErrors
      })
    }

    if (!lastName) {
      setFormErrors((prev) => ({ ...prev, lastName: "Last name is required" }))
      isValid = false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.lastName
        return newErrors
      })
    }

    return isValid
  }

  const validateUserRole = () => {
    if (!userRole) {
      setFormErrors((prev) => ({ ...prev, userRole: "Please select your role" }))
      return false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.userRole
        return newErrors
      })
      return true
    }
  }

  const validateTerms = () => {
    if (!agreeTerms) {
      setFormErrors((prev) => ({ ...prev, agreeTerms: "You must agree to the terms" }))
      return false
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreeTerms
        return newErrors
      })
      return true
    }
  }

  // Check password strength
  const checkPasswordStrength = () => {
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1

    // Contains number
    if (/[0-9]/.test(password)) strength += 1

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)

    if (strength === 0) {
      setPasswordMessage("")
    } else if (strength <= 2) {
      setPasswordMessage("Weak")
    } else if (strength <= 4) {
      setPasswordMessage("Good")
    } else {
      setPasswordMessage("Strong")
    }
  }

  // Form submission handlers
  const submitSignIn = (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (isEmailValid && isPasswordValid) {
      dispatch(loginUser({ email, password })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          // توجيه حسب الدور
          const role = res.payload.user?.role || res.payload.user?.userRole;
          if (role === 'admin') navigate('/admin-dashboard');
          else if (role === 'manager') navigate('/manager-dashboard');
          else if (role === 'driver') navigate('/driver-dashboard');
          else if (role === 'parent') navigate('/parent-dashboard');
          

          else navigate('/attendance-management');
        }
      });
      
    }
  }

  const submitSignUp = (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()
    const isConfirmPasswordValid = validateConfirmPassword()
    const isNameValid = validateName()
    const isUserRoleValid = validateUserRole()
    const isTermsValid = validateTerms()
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    dispatch(setUser(response.data.user));

    if (
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isNameValid &&
      isUserRoleValid &&
      isTermsValid
    ) {
      dispatch(
        registerUser({
          firstName,
          lastName,
          email,
          password,
          role: userRole,
          image,
          phone,
          licenseNumber,
        })
      ).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setFormSubmitted(true);
        }
      });
    }
  }

  const submitForgotPassword = (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail()

    if (isEmailValid) {
      // In a real application, this would call an API
      setTimeout(() => {
        setForgotPasswordSubmitted(true)
      }, 1000)
    }
  }

  const resetForm = () => {
    setActiveTab("signin")
    setShowForgotPassword(false)
    setFormSubmitted(false)
    setForgotPasswordSubmitted(false)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFirstName("")
    setLastName("")
    setCompanyName("")
    setUserRole("")
    setPhone("")
    setLicenseNumber("")
    setRememberMe(false)
    setAgreeTerms(false)
    setFormErrors({})
    setImage(null)
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Main Content */}
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center">
                <i className="fas fa-bus text-brand-dark-blue text-3xl mr-2"></i>
                <span className="font-display font-bold text-3xl text-brand-dark-blue">BusTrack</span>
              </Link>
              <p className="text-gray-600 mt-2">Secure, Efficient Bus Management System</p>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Sign In Success State */}
              {formSubmitted && activeTab === "signin" && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <i className="fas fa-check-circle text-3xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                  <p className="text-gray-600 mb-6">You have successfully signed in to your account.</p>
                  <div className="flex justify-center">
                    <button className="px-6 py-3 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105">
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {/* Sign Up Success State */}
              {formSubmitted && activeTab === "signup" && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <i className="fas fa-check-circle text-3xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    Your account has been created successfully. Please check your email to verify your account.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Success State */}
              {forgotPasswordSubmitted && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                    <i className="fas fa-envelope text-3xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a password reset link to your email address. Please check your inbox and follow the
                    instructions.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Auth Forms */}
              {!formSubmitted && !forgotPasswordSubmitted && (
                <>
                  {/* Tabs */}
                  {!showForgotPassword && (
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab("signin")}
                        className={`flex-1 py-4 text-center transition-colors duration-200 ${activeTab === "signin"
                          ? "bg-brand-beige text-brand-dark-blue font-bold"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 py-4 text-center transition-colors duration-200 ${activeTab === "signup"
                          ? "bg-brand-beige text-brand-dark-blue font-bold"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}

                  {/* Forgot Password Header */}
                  {showForgotPassword && (
                    <div className="bg-brand-beige py-4 text-center">
                      <h2 className="font-bold text-brand-dark-blue">Reset Your Password</h2>
                    </div>
                  )}

                  {/* Sign In Form */}
                  {activeTab === "signin" && !showForgotPassword && (
                    <div className="p-8">
                      <form onSubmit={submitSignIn}>
                        <div className="mb-6">
                          <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-envelope text-gray-400"></i>
                            </div>
                            <input
                              type="email"
                              id="signin-email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={validateEmail}
                              className={`pl-10 w-full h-12 border ${formErrors.email ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue`}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>

                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword(true)}
                              className="text-sm text-brand-medium-blue hover:text-brand-dark-blue"
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              id="signin-password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onBlur={validatePassword}
                              className={`pl-10 pr-10 w-full h-12 border ${formErrors.password ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue`}
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                              </button>
                            </div>
                          </div>
                          {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                        </div>

                        <div className="mb-6">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Remember me</span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full h-12 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
                        >
                          Sign In
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Sign Up Form */}
                  {activeTab === "signup" && !showForgotPassword && (
                    <div className="p-8">
                      <form onSubmit={submitSignUp}>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label htmlFor="signup-firstname" className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="signup-firstname"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              onBlur={validateName}
                              className={`w-full h-12 border ${formErrors.firstName ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue px-3`}
                              placeholder="John"
                              required
                            />
                            {formErrors.firstName && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="signup-lastname" className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="signup-lastname"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              onBlur={validateName}
                              className={`w-full h-12 border ${formErrors.lastName ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue px-3`}
                              placeholder="Doe"
                              required
                            />
                            {formErrors.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>}
                          </div>
                        </div>

                        <div className="mb-6">
                          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-envelope text-gray-400"></i>
                            </div>
                            <input
                              type="email"
                              id="signup-email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={validateEmail}
                              className={`pl-10 w-full h-12 border ${formErrors.email ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue`}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>

                        <div className="mb-6">
                          <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-2">
                            Company/Organization (Optional)
                          </label>
                          <input
                            type="text"
                            id="signup-company"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue px-3"
                            placeholder="Your School District"
                          />
                        </div>

                        <div className="mb-6">
                          <label htmlFor="signup-role" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Role
                          </label>
                          <select
                            id="signup-role"
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            onBlur={validateUserRole}
                            className={`w-full h-12 border ${formErrors.userRole ? "border-red-500" : "border-gray-300"
                              } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue px-3`}
                            required
                          >
                            <option value="">Select your role</option>
                            <option value="parent">Parent/Guardian</option>
                            <option value="driver">Bus Driver</option>
                            <option value="manager">Transportation Manager</option>
                            <option value="admin">System Administrator</option>
                            <option value="school">School Staff</option>
                          </select>
                          {formErrors.userRole && <p className="mt-1 text-sm text-red-600">{formErrors.userRole}</p>}
                        </div>

                        {userRole === "driver" && (
                          <>
                            <div className="mb-6">
                              <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                id="signup-phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue px-3"
                                placeholder="Your Phone Number"
                                required
                              />
                            </div>

                            <div className="mb-6">
                              <label htmlFor="signup-license" className="block text-sm font-medium text-gray-700 mb-2">
                                License Number
                              </label>
                              <input
                                type="text"
                                id="signup-license"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue px-3"
                                placeholder="Your License Number"
                                required
                              />
                            </div>
                          </>
                        )}

                        <div className="mb-6">
                          <label htmlFor="signup-image" className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image
                          </label>
                          <input
                            type="file"
                            id="signup-image"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>

                        <div className="mb-6">
                          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              id="signup-password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                checkPasswordStrength()
                              }}
                              onFocus={() => setShowPasswordRequirements(true)}
                              onBlur={() => {
                                validatePassword()
                                setShowPasswordRequirements(false)
                              }}
                              className={`pl-10 pr-10 w-full h-12 border ${formErrors.password ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue`}
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                              </button>
                            </div>
                          </div>
                          {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}

                          {/* Password Strength Indicator */}
                          {password && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Password strength:</span>
                                <span
                                  className={`text-xs font-medium ${passwordStrength <= 2
                                    ? "text-red-600"
                                    : passwordStrength <= 4
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                    }`}
                                >
                                  {passwordMessage}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength <= 2
                                    ? "bg-red-500"
                                    : passwordStrength <= 4
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    }`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Password Requirements */}
                          {showPasswordRequirements && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li className={`flex items-center ${password.length >= 8 ? "text-green-600" : ""}`}>
                                  <i className={`fas ${password.length >= 8 ? "fa-check" : "fa-times"} mr-2`}></i>
                                  At least 8 characters
                                </li>
                                <li className={`flex items-center ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                                  <i className={`fas ${/[a-z]/.test(password) ? "fa-check" : "fa-times"} mr-2`}></i>
                                  One lowercase letter
                                </li>
                                <li className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                                  <i className={`fas ${/[A-Z]/.test(password) ? "fa-check" : "fa-times"} mr-2`}></i>
                                  One uppercase letter
                                </li>
                                <li className={`flex items-center ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                                  <i className={`fas ${/[0-9]/.test(password) ? "fa-check" : "fa-times"} mr-2`}></i>
                                  One number
                                </li>
                                <li
                                  className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}`}
                                >
                                  <i
                                    className={`fas ${/[^A-Za-z0-9]/.test(password) ? "fa-check" : "fa-times"} mr-2`}
                                  ></i>
                                  One special character
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="signup-confirm-password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Confirm Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="signup-confirm-password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              onBlur={validateConfirmPassword}
                              className={`pl-10 pr-10 w-full h-12 border ${formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue`}
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                              </button>
                            </div>
                          </div>
                          {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                          )}
                        </div>

                        <div className="mb-6">
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                              onBlur={validateTerms}
                              className={`h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded mt-1 ${formErrors.agreeTerms ? "border-red-500" : ""
                                }`}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              I agree to the{" "}
                              <Link to="/terms" className="text-brand-medium-blue hover:text-brand-dark-blue">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link to="/privacy" className="text-brand-medium-blue hover:text-brand-dark-blue">
                                Privacy Policy
                              </Link>
                            </span>
                          </label>
                          {formErrors.agreeTerms && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.agreeTerms}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full h-12 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105 disabled:opacity-60"
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Create Account'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Forgot Password Form */}
                  {showForgotPassword && (
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <p className="text-gray-600">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      <form onSubmit={submitForgotPassword}>
                        <div className="mb-6">
                          <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-envelope text-gray-400"></i>
                            </div>
                            <input
                              type="email"
                              id="forgot-email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={validateEmail}
                              className={`pl-10 w-full h-12 border ${formErrors.email ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue`}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>

                        <button
                          type="submit"
                          className="w-full h-12 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105 mb-4"
                        >
                          Send Reset Link
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(false)}
                          className="w-full h-12 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                          Back to Sign In
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Additional Links */}
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                Need help?{" "}
                <Link to="/contact" className="text-brand-medium-blue hover:text-brand-dark-blue">
                  Contact Support
                </Link>
              </p>
            </div>

            {/* Specialized Login Links */}
            <div className="mt-6 p-4 bg-brand-beige rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Specialized Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link
                  to="/login-admin"
                  className="flex items-center justify-center px-4 py-3 bg-brand-dark-blue text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
                >
                  <i className="fas fa-shield-alt mr-2"></i>
                  Admin Login
                </Link>
                <Link
                  to="/login-driver"
                  className="flex items-center justify-center px-4 py-3 bg-brand-medium-blue text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  <i className="fas fa-bus mr-2"></i>
                  Driver Login
                </Link>
                <Link
                  to="/register-parent"
                  className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Parent Registration
                </Link>
              </div>
            </div>

            {/* Accessibility Options */}
            <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Accessibility Options</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <i className="fas fa-text-height mr-2 text-brand-medium-blue"></i>
                  Increase Text Size
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <i className="fas fa-adjust mr-2 text-brand-medium-blue"></i>
                  High Contrast Mode
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <i className="fas fa-pause mr-2 text-brand-medium-blue"></i>
                  Reduce Motion
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <i className="fas fa-volume-up mr-2 text-brand-medium-blue"></i>
                  Screen Reader Mode
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
