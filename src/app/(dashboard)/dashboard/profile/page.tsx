"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/auth-fetch";
import { uploadImageToImgBB } from "@/lib/imgbb";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  role: string;
  phone?: string;
  bio?: string;
  plan?: "free" | "pro";
}

export default function UpdateProfilePage() {
  const { refetch: refetchSession } = authClient.useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/users/me");
        const data = await res.json();
        if (res.ok && data) {
          setProfile(data);
          setName(data.name || "");
          setPhone(data.phone || "");
          setBio(data.bio || "");
          setImagePreview(data.image || "");
        }
      } catch {
        toast.add({
          title: "Error",
          description: "Failed to load user profile.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.add({
        title: "Invalid Name",
        description: "Please enter a valid full name.",
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      let updatedImageUrl = profile?.image || "";

      if (imageFile) {
        updatedImageUrl = await uploadImageToImgBB(imageFile);
      }

      const res = await authFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          image: updatedImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.add({
          title: "Update Failed",
          description: data?.message || "Could not update profile.",
          type: "error",
        });
        return;
      }

      // Sync with BetterAuth session so Navbar avatar & name update immediately
      await authClient.updateUser({
        name: name.trim(),
        image: updatedImageUrl || undefined,
      });
      await refetchSession();

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: name.trim(),
              phone: phone.trim(),
              bio: bio.trim(),
              image: updatedImageUrl,
            }
          : prev
      );
      setImageFile(null);

      toast.add({
        title: "Profile Updated!",
        description: "Your profile details have been saved.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to save profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-[#e3eae5] bg-white">
        <Loader2 className="size-6 animate-spin text-[#0f7a5a]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#12211c]">
          Profile Settings
        </h1>
        <p className="mt-1 text-[13px] text-[#5b6b64]">
          Update your personal details and profile photo via ImgBB.
        </p>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="space-y-6 rounded-2xl border border-[#e3eae5] bg-white p-6 shadow-xs sm:p-8"
      >
        {/* Profile Avatar Upload Header */}
        <div className="flex flex-col items-start gap-5 border-b border-[#eef2ef] pb-6 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="size-20 border-2 border-[#cfe0d7]">
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt={name} />
              ) : null}
              <AvatarFallback className="bg-[#0f7a5a] text-xl font-semibold text-white">
                {name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <label
              htmlFor="profile-avatar-upload"
              aria-label="Upload new profile picture"
              className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#0f7a5a] text-white shadow-xs transition-colors hover:bg-[#0c654b]"
            >
              <Camera className="size-3.5" />
              <input
                id="profile-avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageSelect}
                className="sr-only"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[17px] font-semibold text-[#12211c]">
                {profile?.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f3ee] px-2.5 py-0.5 text-[11px] font-semibold capitalize text-[#0f513f]">
                <Shield className="size-3" />
                {profile?.role || "student"}
              </span>
              {profile?.plan === "pro" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                  <Sparkles className="size-3" />
                  Pro Member
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                  Free Plan
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#64748b]">
              Click the camera icon to select a JPG, PNG, or WEBP photo (max
              5MB).
            </p>
            {imageFile ? (
              <p className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0f7a5a]">
                <CheckCircle2 className="size-3.5" />
                Selected: {imageFile.name}
              </p>
            ) : null}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Full Name *
            </label>
            <div className="relative mt-1.5">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] pl-10 text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="block text-[12px] font-semibold text-[#12211c]"
            >
              Email Address (Read-only)
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
              <Input
                id="profile-email"
                value={profile?.email || ""}
                disabled
                className="h-11 rounded-xl border-[#e5ece8] bg-gray-50 pl-10 text-[13px] text-[#64748b]"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-phone"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Phone Number
          </label>
          <div className="relative mt-1.5">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              id="profile-phone"
              type="tel"
              placeholder="+880 1700-000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] pl-10 text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-bio"
            className="block text-[12px] font-semibold text-[#12211c]"
          >
            Academic Bio / Qualification Summary
          </label>
          <textarea
            id="profile-bio"
            rows={4}
            placeholder="Share your university background, teaching subjects, or academic goals..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] p-3.5 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 rounded-xl bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Profile Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}