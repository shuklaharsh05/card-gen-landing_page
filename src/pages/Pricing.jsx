"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useRazorpay } from "../hooks/useRazorpay.js";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PricingClient() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'error' | null
  const [paymentMessage, setPaymentMessage] = useState("");

  const { user } = useAuth();
  const { initiatePayment, loading: paymentLoading, error: paymentError } = useRazorpay();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Base",
      priceMonthly: 80,
      priceYearly: 800,
      description: "For most businesses that want to optimize web queries.",
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
      buttonText: "Get Started",
      featured: false,
    },
    {
      name: "Pro",
      priceMonthly: 120,
      priceYearly: 1200,
      description: "For most businesses that want to optimize web queries.",
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
      buttonText: "Get Started",
      featured: true,
    },
    {
      name: "Enterprise",
      priceMonthly: 260,
      priceYearly: 2600,
      description: "For most businesses that want to optimize web queries.",
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
      buttonText: "Get Started",
      featured: false,
    },
  ];

  const getPrice = (plan) => {
    return billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  };

  const handlePlanSelect = async (plan) => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login", { state: { from: "/pricing", selectedPlan: plan.name } });
      return;
    }

    // Check if user has an inquiry ID (required for payment)
    // For now, we'll use a placeholder. In production, you'd get this from user's active inquiry
    const inquiryId = user.inquiries?.[0]?._id || user.inquiries?.[0];

    if (!inquiryId) {
      setPaymentStatus("error");
      setPaymentMessage("Please create a business card inquiry first before purchasing a plan.");
      return;
    }

    setSelectedPlan(plan.name);
    setPaymentStatus(null);
    setPaymentMessage("");

    const amount = getPrice(plan);

    initiatePayment({
      inquiryId,
      amount,
      customerName: user.name || "",
      customerEmail: user.email || "",
      customerPhone: user.phone || "",
      onSuccess: (data) => {
        setPaymentStatus("success");
        setPaymentMessage(`Payment successful! Your ${plan.name} plan is now active.`);
        setSelectedPlan(null);
        // Optionally redirect or refresh user data
        // navigate('/dashboard');
      },
      onFailure: (errorMessage) => {
        setPaymentStatus("error");
        setPaymentMessage(errorMessage || "Payment failed. Please try again.");
        setSelectedPlan(null);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9ff] py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1a1a3d]">
          Simple, transparent pricing
        </h1>
        <p className="text-gray-500 mt-2">No contracts. No surprise fees.</p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex bg-[#e6ebff] rounded-full p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-[#2563eb] shadow-md"
                : "text-gray-600"
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === "yearly"
                ? "bg-white text-[#2563eb] shadow-md"
                : "text-gray-600"
            }`}
          >
            YEARLY
          </button>
        </div>
      </div>

      {/* Payment Status Messages */}
      {paymentStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 max-w-md w-full mx-auto p-4 rounded-xl flex items-start gap-3 ${
            paymentStatus === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {paymentStatus === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm ${
              paymentStatus === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {paymentMessage}
          </p>
        </motion.div>
      )}

      {paymentError && !paymentStatus && (
        <div className="mb-8 max-w-md w-full mx-auto p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{paymentError}</p>
        </div>
      )}

      {/* Pricing cards */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full">
        {plans.map((plan, i) => {
          const isProcessing = paymentLoading && selectedPlan === plan.name;
          const price = getPrice(plan);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative flex flex-col justify-between text-center p-8 w-full sm:w-[340px] rounded-3xl shadow-lg ${
                plan.featured
                  ? "bg-gradient-to-b from-[#567cff] to-[#4361ee] text-white scale-105"
                  : "bg-white text-[#1a1a3d]"
              }`}
            >
              {/* Most popular badge */}
              {plan.featured && (
                <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h2
                  className={`text-4xl font-bold ${
                    plan.featured ? "text-white" : "text-[#1a1a3d]"
                  }`}
                >
                  Rs. {price}
                  <span className="text-lg font-medium">
                    {" "}
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </h2>
                <h3 className="text-xl font-semibold mt-4">{plan.name}</h3>
                <p
                  className={`mt-2 text-sm ${
                    plan.featured ? "text-white/90" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-left">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 ${
                        plan.featured ? "text-white" : "text-gray-700"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-[#60a5fa] flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={paymentLoading}
                className={`mt-8 w-full py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  plan.featured
                    ? "bg-white text-[#2563eb] hover:bg-gray-100 disabled:bg-gray-200"
                    : "bg-[#e6ebff] text-[#1a1a3d] hover:bg-[#dce3ff] disabled:bg-gray-200"
                } disabled:cursor-not-allowed`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Info text for non-logged in users */}
      {!user && (
        <p className="mt-8 text-sm text-gray-500 text-center">
          Please{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#2563eb] font-medium hover:underline"
          >
            sign in
          </button>{" "}
          to purchase a plan.
        </p>
      )}
    </div>
  );
}
