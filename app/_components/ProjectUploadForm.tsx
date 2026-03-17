"use client";
import { useState, useRef, useEffect } from "react";
import { useProject } from "../_hooks/use-projects";
import { toast } from "react-toastify";
import useSearch from "../_hooks/use-search";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  initialData?: any; // You can replace 'any' with your Project type
  isEditing?: boolean;
}

export default function ProjectForm({
  initialData,
  isEditing = false,
}: ProjectFormProps) {
  const router = useRouter();
  const { submitProject, updateProject } = useProject(); // Assuming updateProject exists in your hook
  const { getCategories } = useSearch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state with initialData if editing
  const [title, setTitle] = useState(initialData?.title || "");
  const [abstract, setAbstract] = useState(initialData?.abstract || "");
  const [methodology, setMethodology] = useState(
    initialData?.methodology || "",
  );
  const [category, setCategory] = useState(initialData?.categoryId || "");
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState(initialData?.keywords || "");
  const [researchArea, setResearchArea] = useState(
    initialData?.researchArea || "",
  );

  const { data: categories } = getCategories();
  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAbstract(initialData.abstract || "");
      setMethodology(initialData.methodology || "");
      setCategory(initialData.categoryId || "");
      setKeywords(initialData.keywords || "");
      setResearchArea(initialData.researchArea || "");
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }
      setFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // File is only strictly required if we aren't editing
    if (
      !title ||
      !abstract ||
      !category ||
      !methodology ||
      (!file && !isEditing)
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("methodology", methodology);
    formData.append("categoryId", category);
    formData.append("keywords", keywords);
    formData.append("researchArea", researchArea);
    formData.append(
      "submissionYear",
      initialData?.submissionYear || currentYear,
    );

    if (file) {
      formData.append("file", file);
    }

    const mutation = isEditing ? updateProject : submitProject;

    mutation.mutate(
      isEditing ? { id: initialData.id, projectData: formData } : formData,
      {
        onSuccess: () => {
          if (!isEditing) {
            // Reset form only on new submission
            setTitle("");
            setAbstract("");
            setMethodology("");
            setCategory("");
            setFile(null);
            setKeywords("");
            setResearchArea("");
            if (fileInputRef.current) fileInputRef.current.value = "";
          } else {
            router.push("/student"); // Redirect to projects list after editing
          }
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-2xl p-8 space-y-6 shadow-md max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        {isEditing ? "Edit Project" : "Upload New Project"}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Project Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Abstract */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Abstract *
        </label>
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      {/* Methodology */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Methodology *
        </label>
        <textarea
          value={methodology}
          onChange={(e) => setMethodology(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Describe your research methodology"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Select category
          </option>
          {categories?.map((cat: { id: string; name: string }) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload */}
      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {file ? (
          <p className="text-blue-600 font-medium">{file.name}</p>
        ) : isEditing ? (
          <p className="text-gray-500 italic">
            Click to replace existing PDF (optional)
          </p>
        ) : (
          <p className="text-gray-400">
            Drag and drop PDF here, or click to select file
          </p>
        )}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Keywords & Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Keywords
          </label>
          <input
            type="text"
            placeholder="e.g. AI, React, Health"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Research Area
          </label>
          <input
            type="text"
            value={researchArea}
            onChange={(e) => setResearchArea(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitProject.isPending || updateProject?.isPending}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
      >
        {isEditing
          ? updateProject?.isPending
            ? "Updating..."
            : "Update Project"
          : submitProject.isPending
            ? "Uploading..."
            : "Submit Project"}
      </button>
    </form>
  );
}
