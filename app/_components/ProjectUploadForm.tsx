"use client";
import { useState, useRef, FormEvent } from "react";
import { useSubmitProject } from "../_hooks/use-projects";

export default function ProjectUploadForm() {
  const { submitProject } = useSubmitProject();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [submissionYear] = useState(new Date().getFullYear().toString()); // auto-fill current year
  const [supervisorId] = useState("1"); // TODO: fetch from auth context
  const [errors, setErrors] = useState<{
    title?: string;
    abstract?: string;
    file?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (file: File | undefined): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    else if (title.length < 5)
      newErrors.title = "Title must be at least 5 characters.";

    if (!abstract.trim()) newErrors.abstract = "Abstract is required.";
    else if (abstract.length < 20)
      newErrors.abstract = "Abstract must be at least 20 characters.";

    if (!file) {
      newErrors.file = "Please select a PDF file.";
    } else if (file.type !== "application/pdf") {
      newErrors.file = "Only PDF files are allowed.";
    } else if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      newErrors.file = "File size must be less than 10MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const file = fileInputRef.current?.files?.[0];
    if (!validateForm(file)) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("file", file!);
    formData.append("submissionYear", submissionYear);
    formData.append("supervisorId", supervisorId);

    submitProject.mutate(formData, {
      onSuccess: () => {
        setTitle("");
        setAbstract("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setErrors({});
        setSuccessMessage("Project submitted successfully!");
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      },
      onError: (error: any) => {
        setErrors({
          file: error.message || "Upload failed. Please try again.",
        });
      },
    });
  };

  const isLoading = submitProject?.isPending;

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
      <h3 className="mb-2 text-xl font-semibold text-gray-800">
        New Project Submission
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        Upload your final year project (PDF, max 10MB)
      </p>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 border border-green-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-5" noValidate>
        {/* Title field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className={`mt-1 block w-full rounded-lg border ${
              errors.title ? "border-red-300" : "border-gray-300"
            } px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition`}
            placeholder="e.g., AI-Based Crop Disease Detection"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Abstract field */}
        <div>
          <label
            htmlFor="abstract"
            className="block text-sm font-medium text-gray-700"
          >
            Abstract
          </label>
          <textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            disabled={isLoading}
            rows={4}
            className={`mt-1 block w-full rounded-lg border ${
              errors.abstract ? "border-red-300" : "border-gray-300"
            } px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition`}
            placeholder="Briefly describe your project..."
          />
          {errors.abstract && (
            <p className="mt-1 text-xs text-red-600">{errors.abstract}</p>
          )}
        </div>

        {/* File input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PDF File
          </label>
          <div
            className={`mt-1 flex justify-center rounded-lg border-2 border-dashed ${
              errors.file
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-gray-50"
            } px-6 py-4`}
          >
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                disabled={isLoading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">PDF up to 10MB</p>
            </div>
          </div>
          {errors.file && (
            <p className="mt-1 text-xs text-red-600">{errors.file}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <span>Uploading...</span>
            </>
          ) : (
            "Submit to Repository"
          )}
        </button>
      </form>
    </div>
  );
}
