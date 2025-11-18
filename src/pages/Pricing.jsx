"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PricingClient() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Base",
      price: billingCycle === "monthly" ? "$80" : "$800",
      description: "For most businesses that want to optimize web queries.",
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
      buttonText: "Downgrade",
      featured: false,
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "$120" : "$1200",
      description: "For most businesses that want to optimize web queries.",
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
      buttonText: "Upgrade",
      featured: true,
    },
    {
      name: "Enterprise",
      price: billingCycle === "monthly" ? "$260" : "$2600",
      description: "For most businesses that want to optimize web queries.",
      features: [
        "All limited links",
        "Own analytics platform",
        "Chat support",
        "Optimize hashtags",
        "Unlimited users",
      ],
      buttonText: "Upgrade",
      featured: false,
    },
  ];

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

      {/* Pricing cards */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full">
        {plans.map((plan, i) => (
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
                {plan.price}
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
              className={`mt-8 w-full py-3 rounded-full text-sm font-medium transition-all ${
                plan.featured
                  ? "bg-white text-[#2563eb] hover:bg-gray-100"
                  : "bg-[#e6ebff] text-[#1a1a3d] hover:bg-[#dce3ff]"
              }`}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
