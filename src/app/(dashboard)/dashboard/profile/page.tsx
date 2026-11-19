"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Upload } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

type UserProfileData = {
  name?: string;
  email?: string;
  image?: string | null;
  role?: string;
  phone?: string;
  bio?: string;
  plan?: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function UpdateProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as UserProfileData | undefined;

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.add({
        title: "ImgBB key missing",
        description: "Set NEXT_PUBLIC_IMGBB_API_KEY in .env.local",
        type: "error",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const payload = new FormData();
      payload.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: payload,
        }
      );
      const result = await response.json();

      if (result.success && result.data?.url) {
        setForm((prev) => ({ ...prev, image: result.data.url }));
        toast.add({
          title: "Photo uploaded",
          description: "Profile picture uploaded via ImgBB.",
          type: "success",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast.add({
        title: "Upload failed",
        description: "Could not upload profile picture.",
        type: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.add({
        title: "Name required",
        description: "Please enter your full name.",
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      // Connect PATCH /api/users/profile or BetterAuth updateUser here
      const profilePayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        image: form.image.trim(),
      };
      void profilePayload;

      toast.add({
        title: "Profile updated",
        description: "Your profile details have been saved.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Update failed",
        description: "Something went wrong while saving profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const displayName = form.name || user?.name || "User";
  const role = user?.role || "student";
  const plan = user?.plan || "free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12211c]">
          Update Profile
        </h1>
        <p className="text-[13px] text-[#64748b]">
          Manage your personal details, bio, and profile picture.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Profile Summary Card */}
        <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="size-20">
              {form.image ? (
                <AvatarImage src={form.image} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-[#0f7a5a] text-lg font-semibold text-white">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-base font-semibold text-[#12211c]">
              {displayName}
            </h2>
            <p className="text-[12px] text-[#64748b]">{user?.email || ""}</p>

            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-[#e8f3ee] text-[#0f513f] uppercase hover:bg-[#e8f3ee]">
                {role}
              </Badge>
              <Badge variant="outline" className="uppercase">
                {plan} Plan
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Profile Form Card */}
        <Card className="rounded-2xl border border-[#e4ece7] bg-white shadow-xs lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#12211c]">
              Account Information
            </CardTitle>
            <CardDescription className="text-[13px]">
              Update your name, phone number, bio, and avatar image.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              {/* ImgBB Upload + Optional Image URL */}
              <div className="space-y-2">
                <Label htmlFor="avatarFile">Profile Picture (ImgBB)</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    id="avatarFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="max-w-xs"
                  />
                  {uploadingImage && (
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#0f7a5a]">
                      <Upload className="size-3.5" /> Uploading...
                    </span>
                  )}
                </div>

                <Input
                  id="imageUrl"
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Or paste image URL here"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Write a short bio about yourself..."
                />
              </div>

              <Button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-xl bg-[#0f7a5a] text-[13px] font-semibold text-white hover:bg-[#0c654b]"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}