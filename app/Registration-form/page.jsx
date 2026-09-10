"use client";

import React, { useEffect, useState, useRef } from "react";
import { registrationData, checkEmailSubmitted } from "../action";
import { useForm } from "react-hook-form";

const IICRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onBlur",
  });

  const [isFormAlreadySubmitted, setIsFormAlreadySubmitted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMessageType, setFlashMessageType] = useState("error");
  const isSubmittingRef = useRef(false);

  const getSubmittedEmails = () => {
    try {
      const saved = localStorage.getItem("iic_submitted_emails");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const saveSubmittedEmail = (email) => {
    try {
      if (!email) return;
      const normalized = email.trim().toLowerCase();
      const existing = getSubmittedEmails();
      if (!existing.includes(normalized)) {
        const updated = [...existing, normalized];
        localStorage.setItem("iic_submitted_emails", JSON.stringify(updated));
      }
      localStorage.setItem("skjghwfjbadfbsuasf", "782478");
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  const isEmailSubmitted = (email) => {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    const existing = getSubmittedEmails();
    return existing.includes(normalized);
  };

  useEffect(() => {
    const formStatus = localStorage.getItem("skjghwfjbadfbsuasf");
    if (formStatus === "782478") {
      setIsFormAlreadySubmitted(true);
    }
  }, []);

  const emailValue = watch("email");

  const handleEmailBlur = async () => {
    if (!emailValue) return;
    const normalized = emailValue.trim().toLowerCase();
    if (isEmailSubmitted(normalized)) {
      setFlashMessage("You have already submitted form with this email address!");
      setFlashMessageType("error");
      return;
    }
    try {
      const isAlreadyOnServer = await checkEmailSubmitted(normalized);
      if (isAlreadyOnServer) {
        saveSubmittedEmail(normalized);
        setFlashMessage("You have already submitted form with this email address!");
        setFlashMessageType("error");
      }
    } catch (err) {
      console.error("Error checking email status on server:", err);
    }
  };

  const departments = [
    "Computer Science & Engineering",
    "CSE (Cyber Security)",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology",
    "Chemical Engineering",
    "Metallurgical Engineering",
    "Production & Industrial Engineering",
    "Mining Engineering",
  ];

  const onSubmit = async (data) => {
    // Prevent multiple submissions if already submitting
    if (isSubmittingRef.current || isSubmitting) {
      console.warn("Submission already in progress. Ignoring multiple click.");
      return;
    }

    const normalizedEmail = data.email?.trim().toLowerCase();

    // Check if user already submitted with this email address (local or server)
    if (isEmailSubmitted(normalizedEmail)) {
      setFlashMessage("You have already submitted form with this email address!");
      setFlashMessageType("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const isAlreadyOnServer = await checkEmailSubmitted(normalizedEmail);
      if (isAlreadyOnServer) {
        saveSubmittedEmail(normalizedEmail);
        setFlashMessage("You have already submitted form with this email address!");
        setFlashMessageType("error");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    } catch (err) {
      console.error("Error checking server for existing email:", err);
    }

    // Synchronous lock to block double clicks
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setFlashMessage("");

    try {
      console.log("Form submitted:", data);
      const response = await registrationData(data);
      console.log("Server response:", response);

      if (
        response?.status === "already_submitted" ||
        (response?.message && response.message.toLowerCase().includes("already submitted"))
      ) {
        saveSubmittedEmail(normalizedEmail);
        setFlashMessage("You have already submitted form with this email address!");
        setFlashMessageType("error");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (response?.status === "success" || response?.status === 200) {
        saveSubmittedEmail(normalizedEmail);
        setSubmitMessage(response?.message || "Registration submitted successfully!");
        setSubmitStatus("success");
        reset();
        setFormSubmitted(true);
      } else {
        setFlashMessage(response?.message || "Failed to submit form. Please check your details and try again.");
        setFlashMessageType("error");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setFlashMessage("An error occurred while submitting. Please try again.");
      setFlashMessageType("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {formSubmitted ? (
        // Show message if form submitted
        <div className="bg-white max-w-3xl mx-auto shadow-xl rounded-2xl p-8 md:p-10 text-center">
          <div className="mb-6">
            {submitStatus === "success" ? (
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.95a1 1 0 00-1.414-1.414L10 8.586 7.879 6.464a1 1 0 00-1.414 1.414L8.586 10l-2.121 2.121a1 1 0 101.414 1.414L10 11.414l2.121 2.121a1 1 0 001.414-1.414L11.414 10l2.121-2.121z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {submitMessage}
            </h2>
            {submitStatus === "success" ? (
              <p className="text-gray-600">
                Thanks for your response. We will get back to you soon. For any
                queries, please mail us at{" "}
                <a
                  href="mailto:iicbits@bitsindri.ac.in"
                  className="text-orange-500 hover:underline"
                >
                  iicbits@bitsindri.ac.in
                </a>
              </p>
            ) : (
              <p className="text-gray-600">
                If you want to change the details, please mail your required
                changes at{" "}
                <a
                  href="mailto:iicbits@bitsindri.ac.in"
                  className="text-orange-500 hover:underline"
                >
                  iicbits@bitsindri.ac.in
                </a>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Registration Form
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the Institution's Innovation Council and be part of fostering
              innovation and entrepreneurship
            </p>
          </div>

          {isFormAlreadySubmitted ? (
            // Show message if form already submitted
            <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Form Already Submitted
                </h2>
                <p className="text-gray-600">
                  You have already filled the IIC registration form. If you want
                  to change the details, please mail your required changes at{" "}
                  <a
                    href="mailto:iicbits@bitsindri.ac.in"
                    className="text-orange-500 hover:underline"
                  >
                    iicbits@bitsindri.ac.in
                  </a>
                </p>
              </div>
            </div>
          ) : (
            // Registration form

            <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10">
              {/* Flash Message Banner */}
              {flashMessage && (
                <div
                  className={`mb-6 p-4 rounded-xl shadow-sm flex items-center justify-between transition-all duration-300 ${
                    flashMessageType === "error"
                      ? "bg-red-50 border-l-4 border-red-500 text-red-700"
                      : "bg-amber-50 border-l-4 border-amber-500 text-amber-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-base">{flashMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlashMessage("")}
                    className="text-gray-400 hover:text-gray-600 font-bold ml-4 p-1 transition-colors"
                    aria-label="Close notification"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form
                method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)(e);
                }}
                className="space-y-8"
              >
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-orange-100 pb-2">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email address is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                          },
                          onBlur: handleEmailBlur,
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: {
                            value: 3,
                            message: "Full name must be at least 2 characters",
                          },
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        {...register("rollNumber", {
                          required: "Roll number is required",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          errors.rollNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your roll number"
                      />
                      {errors.rollNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.rollNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        {...register("contactNumber", {
                          required: "Contact number is required",
                          pattern: {
                            value: /^[+]?[\d\s-()]{10,}$/,
                            message: "Please enter a valid contact number",
                          },
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          errors.contactNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="+91 9876543210"
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      {...register("department", {
                        required: "Please select your department",
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.department ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills & Experience */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-orange-100 pb-2">
                    Skills & Experience
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Skills (If any)
                    </label>
                    <textarea
                      {...register("technicalSkills")}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="e.g., Programming languages, frameworks, tools, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Do you possess any additional skills, like photography or
                      videography?
                    </label>
                    <textarea
                      {...register("additionalSkills")}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="Share your creative and additional skills"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have you ever held a role involving management or
                      organizing tasks? If Yes, share with us?
                    </label>
                    <textarea
                      {...register("managementExperience")}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="Describe your leadership and management experiences"
                    />
                  </div>
                </div>

                {/* Self Assessment */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-orange-100 pb-2">
                    Self Assessment
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Communication Skills (Out of 10) *
                      </label>
                      <select
                        {...register("communicationSkills", {
                          required: "Please rate your communication skills",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          errors.communicationSkills
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Rating</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      {errors.communicationSkills && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.communicationSkills.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Writing Skills (Out of 10) *
                      </label>
                      <select
                        {...register("writingSkills", {
                          required: "Please rate your writing skills",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                          errors.writingSkills
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Rating</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      {errors.writingSkills && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.writingSkills.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-orange-100 pb-2">
                    Additional Information
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Do you have any startup idea? If yes, share with us in
                      brief.
                    </label>
                    <textarea
                      {...register("startupIdea")}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="Describe your startup idea or innovation concept"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to join IIC? *
                    </label>
                    <textarea
                      {...register("whyJoinIIC", {
                        required: "Please tell us why you want to join IIC",
                        minLength: {
                          value: 20,
                          message:
                            "Please provide a more detailed response (at least 20 characters)",
                        },
                      })}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
                        errors.whyJoinIIC ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Share your motivation and what you hope to contribute to IIC"
                    />
                    {errors.whyJoinIIC && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.whyJoinIIC.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Any Queries?
                    </label>
                    <textarea
                      {...register("queries")}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="Feel free to ask any questions or clarifications"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 ${
                      isSubmitting
                        ? "opacity-75 cursor-not-allowed bg-orange-400 hover:bg-orange-400"
                        : "transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Please ensure all required fields are filled before
                    submitting
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IICRegistrationForm;
