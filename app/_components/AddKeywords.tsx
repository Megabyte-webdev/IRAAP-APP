"use client";

import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";

const AddKeywords = ({
  keywords,
  currentKeyword,
  removeKeyword,
  setCurrentKeyword,
  handleKeywordKeyDown,
  addKeyword,
}: any) => {
  return (
    <div className="">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Keywords
      </label>

      {/* Container: mimics a real input focus state */}
      <div className="flex flex-wrap items-center gap-2 p-2 min-h-11 border border-gray-300 rounded-lg bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {keywords.map(
          (
            k:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined,
            i: Key | null | undefined,
          ) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-md border border-blue-100 group animate-in fade-in zoom-in duration-200"
            >
              {k}
              <button
                type="button"
                onClick={() => removeKeyword(i)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors text-blue-400 hover:text-blue-800"
                aria-label={`Remove ${k}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ),
        )}

        <input
          type="text"
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          onKeyDown={handleKeywordKeyDown}
          onBlur={() => {
            const trimmed = currentKeyword.trim();
            if (trimmed) {
              addKeyword(trimmed);
              setCurrentKeyword("");
            }
          }}
          placeholder={keywords.length === 0 ? "Add keywords..." : ""}
          className="flex-1 min-w-30 bg-transparent text-sm text-gray-900 outline-none border-none focus:ring-0 p-1"
        />
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Enter keywords separated by{" "}
        <span className="font-semibold text-gray-700">commas</span> or press{" "}
        <span className="font-semibold text-gray-700">Enter</span> for each.
      </p>
    </div>
  );
};

export default AddKeywords;
