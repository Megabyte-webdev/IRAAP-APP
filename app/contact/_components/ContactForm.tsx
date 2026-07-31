"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const ROLE_OPTIONS = [
  "Current Student",
  "Alumni",
  "Supervisor / Faculty",
  "Other",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Current Student",
    message: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F54D] p-4 py-14 font-sans">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 md:p-10 shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Send a message to the Admin
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            For students facing technical issues or account inquiries.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="john@student.oouagoiwoye.edu.ng"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Custom Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              I am a
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800 transition-all text-left ${
                  isDropdownOpen
                    ? "border-sky-500 ring-2 ring-sky-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>{formData.role}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg animate-in fade-in-50 zoom-in-95">
                  {ROLE_OPTIONS.map((option) => {
                    const isSelected = formData.role === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, role: option });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-left transition-colors ${
                          isSelected
                            ? "bg-sky-50 text-sky-600 font-medium"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-sky-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Message
            </label>
            <textarea
              rows={4}
              required
              placeholder="How can we help you?"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#38BDF8] hover:bg-sky-500 text-white font-semibold py-2.5 px-4 text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400/40 cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
