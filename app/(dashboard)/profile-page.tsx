"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CheckCircle2, ChevronRight, Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";
import { profileService, type UserProfile, type UpdateProfilePayload } from "@/app/_services/profile.service";
import { extractErrorMessage } from "@/app/_lib/utils";

const initialForm: UpdateProfilePayload = {
  fullName: "",
  phone: "",
  matricNumber: "",
  department: "",
  programme: "",
  level: "",
  academicSession: "",
  bio: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboarding = searchParams.get("onboarding") === "1";
  const { authDetails, setAuthDetails } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UpdateProfilePayload>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await profileService.getMe();
        if (cancelled) return;
        setProfile(data);
        setForm({
          fullName: data.fullName || "",
          phone: data.phone || "",
          matricNumber: data.matricNumber || "",
          department: data.department || "",
          programme: data.programme || "",
          level: data.level || "",
          academicSession: data.academicSession || "",
          bio: data.bio || "",
        });
        setPreview(data.profileImageUrl || null);
      } catch (err) {
        if (!cancelled) setError(extractErrorMessage(err as any) || "Unable to load your profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const completion = useMemo(() => {
    const fields = [form.fullName, form.department, form.programme, form.level];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [form]);

  function setField(key: keyof UpdateProfilePayload, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setNotice("");
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setNotice("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be 5MB or smaller.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploadingImage(true);
    try {
      const updated = await profileService.uploadImage(file);
      setProfile(updated);
      setPreview(updated.profileImageUrl || null);
      setAuthDetails((current: any) => current ? { ...current, user: { ...current.user, ...updated } } : current);
      localStorage.setItem("iraapUser", JSON.stringify({ user: { ...(authDetails?.user || {}), ...updated } }));
      setNotice("Profile photo updated successfully.");
    } catch (err) {
      setPreview(profile?.profileImageUrl || null);
      setError(extractErrorMessage(err as any) || "Unable to update your profile photo.");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setUploadingImage(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!form.fullName.trim() || !form.department?.trim() || !form.programme?.trim() || !form.level?.trim()) {
      setError("Please complete your name, department, programme, and level.");
      return;
    }
    setSaving(true);
    try {
      const updated = await profileService.update({ ...form, fullName: form.fullName.trim() });
      setProfile(updated);
      setAuthDetails((current: any) => current ? { ...current, user: { ...current.user, ...updated } } : current);
      localStorage.setItem("iraapUser", JSON.stringify({ user: { ...(authDetails?.user || {}), ...updated } }));
      setNotice("Your profile has been updated.");
      localStorage.setItem("iraap_profile_seen", "1");
      if (onboarding) router.replace(`/${String(updated.role).toLowerCase()}`);
    } catch (err) {
      setError(extractErrorMessage(err as any) || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
          <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
        </div>
      </div>
    );
  }

  const displayImage = preview || profile?.profileImageUrl;
  const roleLabel = String(profile?.role || authDetails?.user?.role || "USER").toLowerCase();

  return (
    <div className="min-h-full bg-slate-50/80 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Account</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{onboarding ? "Complete your profile" : "Your profile"}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              {onboarding ? "Add a few academic details so IRAAP can personalize your workspace." : "Keep your academic and contact information up to date."}
            </p>
          </div>
          {!onboarding && <button type="button" onClick={() => router.back()} className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">Back</button>}
        </div>

        {onboarding && (
          <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4 dark:bg-primary/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Profile completion</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">A complete profile makes collaboration and supervision easier.</p>
              </div>
              <span className="text-sm font-bold text-primary">{completion}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} /></div>
          </div>
        )}

        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">{error}</div>}
        {notice && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">{notice}</div>}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1E293B]">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-900">
                {displayImage ? <Image src={displayImage} alt="Profile photo" fill sizes="128px" className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center"><UserRound className="h-12 w-12 text-slate-300" /></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadingImage} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800">
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />} {uploadingImage ? "Uploading…" : "Change photo"}
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">JPG, PNG or WebP · up to 5MB</p>
              <div className="mt-5 w-full border-t border-slate-100 pt-4 text-left dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-emerald-500" /> {profile?.emailVerifiedAt ? "Verified email" : "Email address"}</div>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{profile?.email}</p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Role</p>
                <p className="mt-1 text-sm font-semibold capitalize">{roleLabel}</p>
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1E293B] md:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["fullName", "Full name", "Your name as it should appear across IRAAP", true],
                ["phone", "Phone number", "Optional contact number", false],
                ["matricNumber", "Matric / Student number", "Your official student identifier", false],
                ["department", "Department", "e.g. Computer Engineering", true],
                ["programme", "Programme", "e.g. B.Eng. Computer Engineering", true],
                ["level", "Level", "e.g. 400 Level", true],
                ["academicSession", "Academic session", "e.g. 2025/2026", false],
              ].map(([key, label, helper, required]) => (
                <label key={key as string} className="space-y-1.5">
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200">{label as string}{required ? <span className="text-red-500"> *</span> : null}</span>
                  <input value={form[key as keyof UpdateProfilePayload] || ""} onChange={(e) => setField(key as keyof UpdateProfilePayload, e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/40" placeholder={helper as string} />
                </label>
              ))}
              <label className="space-y-1.5 md:col-span-2">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200">Bio <span className="font-normal text-slate-400">(optional)</span></span>
                <textarea value={form.bio || ""} onChange={(e) => setField("bio", e.target.value)} rows={5} maxLength={1000} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900/40" placeholder="A short introduction about your academic interests or research focus." />
                <span className="block text-right text-[11px] text-slate-400">{form.bio?.length || 0}/1000</span>
              </label>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              {onboarding ? <button type="button" onClick={() => router.replace(`/${roleLabel}`)} className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">Skip for now</button> : <div />}
              <button type="submit" disabled={saving || uploadingImage} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : onboarding ? <><CheckCircle2 className="h-4 w-4" /> Save & continue <ChevronRight className="h-4 w-4" /></> : <><Save className="h-4 w-4" /> Save changes</>}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
