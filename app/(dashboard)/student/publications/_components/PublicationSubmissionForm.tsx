"use client";

import { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { cn } from "@/app/_lib/utils";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { usePublication } from "@/app/_hooks/use-publications";
import AddKeywords from "@/app/_components/AddKeywords";

interface PublicationSubmissionFormProps {
  onCompletionChange: (completion: any) => void;
}

interface FormData {
  title: string;
  abstract: string;
  methodology: string;
  keywords: string[];
  researchType: string;
  researchArea: string;
  file: File | null;
}

interface FormErrors {
  title?: string;
  abstract?: string;
  methodology?: string;
  keywords?: string;
  researchType?: string;
  researchArea?: string;
  file?: string;
}

export default function PublicationSubmissionForm({
  onCompletionChange,
}: PublicationSubmissionFormProps) {
  const { submitPublication } = usePublication();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    abstract: "",
    methodology: "",
    keywords: [],
    researchType: "",
    researchArea: "",
    file: null,
  });
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const updateCompletion = (data: FormData) => {
    onCompletionChange({
      details: data.title.trim().length > 0,
      abstract: data.abstract.trim().length > 0,
      methodology: data.methodology.trim().length > 0,
      keywords: data.keywords.length > 0,
      researchType: data.researchType.trim().length > 0,
      researchArea: data.researchArea.trim().length > 0,
      upload: data.file !== null,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Publication title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.abstract.trim()) {
      newErrors.abstract = "Abstract is required";
    } else if (formData.abstract.trim().length < 20) {
      newErrors.abstract = "Abstract must be at least 20 characters";
    }

    if (!formData.methodology.trim()) {
      newErrors.methodology = "Methodology description is required";
    } else if (formData.methodology.trim().length < 20) {
      newErrors.methodology = "Methodology must be at least 20 characters";
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = "At least one keyword is required";
    }

    if (!formData.researchType.trim()) {
      newErrors.researchType = "Research type selection is required";
    }

    if (!formData.researchArea.trim()) {
      newErrors.researchArea = "Research area is required";
    }

    if (!formData.file) {
      newErrors.file = "PDF file is required";
    } else if (formData.file.type !== "application/pdf") {
      newErrors.file = "Only PDF files are allowed";
    } else if (formData.file.size > 50 * 1024 * 1024) {
      newErrors.file = "File size must be less than 50MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    key: "title" | "abstract" | "methodology" | "researchArea" | "researchType",
    value: string,
  ) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
    updateCompletion(newFormData);
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const addKeyword = (keyword: string) => {
    const parts = keyword
      .split(/[,]+/)
      .map((k) => k.trim())
      .filter(Boolean);

    const newKeywords = [...formData.keywords];
    parts.forEach((k) => {
      if (!newKeywords.includes(k)) {
        newKeywords.push(k);
      }
    });

    const newFormData = { ...formData, keywords: newKeywords };
    setFormData(newFormData);
    updateCompletion(newFormData);
    if (errors.keywords) setErrors({ ...errors, keywords: undefined });
  };

  const removeKeyword = (index: number) => {
    const newKeywords = formData.keywords.filter((_, i) => i !== index);
    const newFormData = { ...formData, keywords: newKeywords };
    setFormData(newFormData);
    updateCompletion(newFormData);
  };

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();

      const trimmed = currentKeyword.trim();
      if (trimmed) {
        addKeyword(trimmed);
        setCurrentKeyword("");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFormData = { ...formData, file };
      setFormData(newFormData);
      updateCompletion(newFormData);
      if (errors.file) setErrors({ ...errors, file: undefined });
    }
  };

  const handleRemoveFile = () => {
    const newFormData = { ...formData, file: null };
    setFormData(newFormData);
    updateCompletion(newFormData);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("abstract", formData.abstract);
    formDataToSubmit.append("methodology", formData.methodology);
    formDataToSubmit.append("researchType", formData.researchType);
    formDataToSubmit.append("researchArea", formData.researchArea);

    formData.keywords.forEach((kw) =>
      formDataToSubmit.append("keywords[]", kw),
    );

    if (formData.file) {
      formDataToSubmit.append("file", formData.file);
    }

    submitPublication.mutate(formDataToSubmit, {
      onSuccess: () => {
        setFormData({
          title: "",
          abstract: "",
          methodology: "",
          keywords: [],
          researchType: "",
          researchArea: "",
          file: null,
        });
        setCurrentKeyword("");
        onCompletionChange({
          details: false,
          abstract: false,
          methodology: false,
          keywords: false,
          researchType: false,
          researchArea: false,
          upload: false,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-black">
      {/* Details Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Publication Details *
          </h2>
          <p className="text-sm text-slate-500">
            Enter the title of your research publication
          </p>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Publication Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Advances in Machine Learning for Healthcare"
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              errors.title
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-white",
            )}
          />
          {errors.title && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title}
            </p>
          )}
        </div>
      </div>

      {/* Abstract Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Abstract *
          </h2>
          <p className="text-sm text-slate-500">
            Provide a brief summary of your research
          </p>
        </div>

        <div>
          <label
            htmlFor="abstract"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Abstract *
          </label>
          <textarea
            id="abstract"
            value={formData.abstract}
            onChange={(e) => handleInputChange("abstract", e.target.value)}
            placeholder="Enter your publication abstract here..."
            rows={6}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border transition-colors resize-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              errors.abstract
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-white",
            )}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {formData.abstract.length} characters
            </p>
            {errors.abstract && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.abstract}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Methodology *
          </h2>
          <p className="text-sm text-slate-500">
            Describe the methods, approaches, and research tools used
          </p>
        </div>

        <div>
          <label
            htmlFor="methodology"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Methodology *
          </label>
          <textarea
            id="methodology"
            value={formData.methodology}
            onChange={(e) => handleInputChange("methodology", e.target.value)}
            placeholder="Outline your research implementation steps, datasets used, or experimental setup..."
            rows={6}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border transition-colors resize-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              errors.methodology
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-white",
            )}
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {formData.methodology.length} characters
            </p>
            {errors.methodology && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.methodology}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Keywords & Area Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Keywords & Research Context *
          </h2>
          <p className="text-sm text-slate-500">
            Categorize your publication context maps
          </p>
        </div>

        <div>
          <AddKeywords
            keywords={formData.keywords}
            setCurrentKeyword={setCurrentKeyword}
            currentKeyword={currentKeyword}
            handleKeywordKeyDown={handleKeywordKeyDown}
            removeKeyword={removeKeyword}
            addKeyword={addKeyword}
          />
          {errors.keywords && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.keywords}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="researchType"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Research Type *
            </label>
            <select
              id="researchType"
              value={formData.researchType}
              onChange={(e) =>
                handleInputChange("researchType", e.target.value)
              }
              className={cn(
                "w-full border px-4 py-2.5 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition",
                errors.researchType
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200",
              )}
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="BSC_PROJECT">B.Sc Project</option>
              <option value="MSC_THESIS">M.Sc Thesis</option>
              <option value="PHD_DISSERTATION">Ph.D Dissertation</option>
              <option value="JOURNAL">Journal</option>
              <option value="INDEPENDENT_RESEARCH">Independent Research</option>
            </select>
            {errors.researchType && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.researchType}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="researchArea"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Research Area *
            </label>
            <input
              id="researchArea"
              type="text"
              value={formData.researchArea}
              onChange={(e) =>
                handleInputChange("researchArea", e.target.value)
              }
              placeholder="e.g. Machine Learning, Public Health..."
              className={cn(
                "w-full border px-4 py-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition",
                errors.researchArea
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 bg-white",
              )}
            />
            {errors.researchArea && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.researchArea}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            PDF Upload *
          </h2>
          <p className="text-sm text-slate-500">
            Upload your research publication as a PDF file
          </p>
        </div>

        {formData.file ? (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary rounded-lg mt-0.5">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {formData.file.name}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap ml-2"
            >
              Remove
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              errors.file
                ? "border-red-300 bg-red-50"
                : "border-slate-300 hover:border-primary hover:bg-slate-50",
            )}
          >
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Upload size={20} className="text-slate-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-900">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF files only • Max 50MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {errors.file && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.file}
          </p>
        )}
      </div>

      {/* Status Banners */}
      {submitPublication.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">
              Publication submitted successfully!
            </p>
            <p className="text-xs text-green-800 mt-1">
              Your data will be updated soon.
            </p>
          </div>
        </div>
      )}

      {submitPublication.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">
              {submitPublication.error instanceof Error
                ? submitPublication.error.message
                : "Failed to submit publication request"}
            </p>
          </div>
        </div>
      )}

      {/* Action triggers */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitPublication.isPending}
          className={cn(
            "px-6 py-2.5 rounded-lg font-medium text-white transition-all",
            submitPublication.isPending
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90",
          )}
        >
          {submitPublication.isPending ? "Submitting..." : "Submit Publication"}
        </button>
      </div>
    </form>
  );
}
