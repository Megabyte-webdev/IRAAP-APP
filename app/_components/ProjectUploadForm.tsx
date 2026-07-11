"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useProject } from "../_hooks/use-projects";
import { toast } from "react-toastify";
import useSearch from "../_hooks/use-search";
import { useRouter } from "next/navigation";
import AddKeywords from "./AddKeywords";
import { FileUp, BookOpen, Tag } from "lucide-react";
import { SectionCompletion } from "../_utils/types";

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
  onCompletionChange?: (c: SectionCompletion) => void;
}

export default function ProjectForm({
  initialData,
  isEditing = false,
  onCompletionChange,
}: ProjectFormProps) {
  const router = useRouter();
  const { submitProject, updateProject } = useProject();
  const { getCategories } = useSearch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [abstract, setAbstract] = useState(initialData?.abstract || "");
  const [methodology, setMethodology] = useState(
    initialData?.methodology || "",
  );
  const [category, setCategory] = useState(initialData?.categoryId || "");
  const [researchType, setResearchType] = useState(
    initialData?.researchType || "",
  );
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords || [],
  );
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [researchArea, setResearchArea] = useState(
    initialData?.researchArea || "",
  );

  const { data: categories } = getCategories();
  const currentYear = new Date().getFullYear().toString();

  const onCompletionChangeRef = useRef(onCompletionChange);
  useEffect(() => {
    onCompletionChangeRef.current = onCompletionChange;
  }, [onCompletionChange]);

  useEffect(() => {
    const state = {
      details: !!(title && abstract && methodology && category && researchType),
      upload: !!(file || isEditing),
      keywords: !!(keywords.length > 0 || researchArea),
    };

    onCompletionChangeRef.current?.(state);
  }, [
    title,
    abstract,
    methodology,
    category,
    researchType,
    file,
    keywords,
    researchArea,
    isEditing,
  ]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAbstract(initialData.abstract || "");
      setMethodology(initialData.methodology || "");
      setCategory(initialData.categoryId || "");
      setResearchType(initialData.researchType || "");
      setKeywords(initialData.keywords || []);
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

  const addKeyword = (keyword: string) => {
    const parts = keyword
      .split(/[,]+/)
      .map((k) => k.trim())
      .filter(Boolean);

    const newKeywords = [...keywords];

    parts.forEach((k) => {
      if (!newKeywords.includes(k)) {
        newKeywords.push(k);
      }
    });

    setKeywords(newKeywords);
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title ||
      !abstract ||
      !category ||
      !researchType ||
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
    formData.append("researchType", researchType);
    formData.append("researchArea", researchArea);
    formData.append(
      "submissionYear",
      initialData?.submissionYear || currentYear,
    );

    keywords.forEach((kw) => formData.append("keywords[]", kw));

    if (file) formData.append("file", file);

    const mutation = isEditing ? updateProject : submitProject;

    mutation.mutate(
      isEditing ? { id: initialData.id, projectData: formData } : formData,
      {
        onSuccess: () => {
          if (!isEditing) {
            setTitle("");
            setAbstract("");
            setMethodology("");
            setCategory("");
            setResearchType("");
            setFile(null);
            setKeywords([]);
            setCurrentKeyword("");
            setResearchArea("");
            if (fileInputRef.current) fileInputRef.current.value = "";
          } else {
            router.push("/student");
          }
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 text-slate-900 dark:text-slate-100"
    >
      {/* Section 1 — Project details */}
      <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <BookOpen size={14} className="text-primary" />
          <h2 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
            Project details
          </h2>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Project title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Learning Approaches to Climate Prediction"
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Abstract <span className="text-red-400">*</span>
            </label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Provide a concise summary of your research..."
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition resize-none"
              rows={6}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Methodology <span className="text-red-400">*</span>
            </label>
            <textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              placeholder="Describe your research methodology and approach..."
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition resize-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="dark:bg-[#1E293B]">
                  Select a category
                </option>
                {categories?.map((cat: { id: string; name: string }) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="dark:bg-[#1E293B]"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Research Type <span className="text-red-400">*</span>
              </label>
              <select
                value={researchType}
                onChange={(e) => setResearchType(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="dark:bg-[#1E293B]">
                  Select a type
                </option>
                <option value="BSC_PROJECT" className="dark:bg-[#1E293B]">
                  B.Sc Project
                </option>
                <option value="MSC_THESIS" className="dark:bg-[#1E293B]">
                  M.Sc Thesis
                </option>
                <option value="PHD_DISSERTATION" className="dark:bg-[#1E293B]">
                  Ph.D Dissertation
                </option>
                <option value="JOURNAL" className="dark:bg-[#1E293B]">
                  Journal
                </option>
                <option
                  value="INDEPENDENT_RESEARCH"
                  className="dark:bg-[#1E293B]"
                >
                  Independent Research
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Document upload */}
      <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <FileUp size={14} className="text-primary" />
          <h2 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
            Document upload
          </h2>
        </div>
        <div className="px-6 py-6">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${
              file
                ? "border-indigo-300 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                  <FileUp
                    size={18}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Click to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FileUp
                    size={18}
                    className="text-slate-400 dark:text-slate-500"
                  />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {isEditing
                    ? "Click to replace existing PDF"
                    : "Drag & drop or click to upload"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  PDF only · Max 20MB
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3 — Keywords & area */}
      <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <Tag size={14} className="text-primary" />
          <h2 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
            Keywords & research area
          </h2>
        </div>
        <div className="px-6 py-6 space-y-5">
          <AddKeywords
            keywords={keywords}
            setCurrentKeyword={setCurrentKeyword}
            currentKeyword={currentKeyword}
            handleKeywordKeyDown={handleKeywordKeyDown}
            removeKeyword={removeKeyword}
            addKeyword={addKeyword}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Research area
            </label>
            <input
              type="text"
              value={researchArea}
              onChange={(e) => setResearchArea(e.target.value)}
              placeholder="e.g. Machine Learning, Public Health, Economics..."
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </section>

      {/* Submit Controls Area */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-10">
        <button
          type="submit"
          disabled={submitProject.isPending || updateProject?.isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          <FileUp size={15} />
          {isEditing
            ? updateProject?.isPending
              ? "Updating..."
              : "Update project"
            : submitProject.isPending
              ? "Uploading..."
              : "Submit project"}
        </button>
      </div>
    </form>
  );
}
