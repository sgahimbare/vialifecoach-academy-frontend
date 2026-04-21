import { useAuth } from "@/context/AuthContext";
import { useMemo, useState } from "react";
import { profileService } from "@/services/profileService";
import { extractApiErrorMessage } from "@/lib/apiError";

export default function ProfilePage() {
  const { user, accessToken, updateUserProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address1, setAddress1] = useState(user?.address_line1 || "");
  const [address2, setAddress2] = useState(user?.address_line2 || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [country, setCountry] = useState(user?.country || "");
  const [postalCode, setPostalCode] = useState(user?.postal_code || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photo || "");

  const initials = useMemo(() => {
    const value = name || user?.name || "";
    return value
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  }, [name, user?.name]);

  async function compressImageToDataUrl(file: File): Promise<string> {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Unable to read image file."));
        img.src = objectUrl;
      });

      const maxSide = 720;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const targetWidth = Math.max(1, Math.round(image.width * scale));
      const targetHeight = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Unable to process image.");
      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      return canvas.toDataURL("image/jpeg", 0.82);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function onImageFileChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image is too large. Use a file under 2MB.");
      return;
    }

    try {
      const imageDataUrl = await compressImageToDataUrl(file);
      setPhotoUrl(imageDataUrl);
      setMessage("Image selected. Click Save Profile to upload.");
    } catch (error) {
      setMessage(extractApiErrorMessage(error, "Failed to process image."));
    }
  }

  async function saveProfile() {
    if (!accessToken || !user) return;
    setIsSaving(true);
    setMessage("");
    try {
      const updated = await profileService.updateProfile(accessToken, {
        name,
        photo_url: photoUrl || null,
        phone: phone || null,
        address_line1: address1 || null,
        address_line2: address2 || null,
        city: city || null,
        state: state || null,
        country: country || null,
        postal_code: postalCode || null,
        bio: bio || null,
      });
      if (updated) {
        updateUserProfile({
          name: updated.name,
          photo: updated.photo || null,
          phone: updated.phone || null,
          address_line1: updated.address_line1 || null,
          address_line2: updated.address_line2 || null,
          city: updated.city || null,
          state: updated.state || null,
          country: updated.country || null,
          postal_code: updated.postal_code || null,
          bio: updated.bio || null,
        });
      }
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(extractApiErrorMessage(error, "Unable to update profile."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-r from-slate-800 via-slate-700 to-blue-800 px-6 py-7 text-white shadow-lg">
          <h1 className="text-3xl font-semibold tracking-tight">My Profile</h1>
          <p className="mt-2 text-sm text-slate-200">
            Keep your student identity up to date with a professional photo and complete profile details.
          </p>
        </section>

        {!user ? <p className="mt-6 text-sm text-slate-600">No data found.</p> : null}
        {user ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[300px,1fr]">
            <aside className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="h-32 w-32 rounded-full border-4 border-blue-100 object-cover shadow-sm" />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-blue-700 text-3xl font-semibold text-white shadow-sm">
                    {initials}
                  </div>
                )}
                <p className="mt-4 text-lg font-semibold text-slate-100">{name || user.name}</p>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  {user.role === "instructor" ? "Lecturer" : user.role}
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => void onImageFileChange(event.target.files?.[0] || null)}
                  className="block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-blue-500"
                />
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Or Paste Image URL</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(event) => setPhotoUrl(event.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  placeholder="https://..."
                />
              </div>
            </aside>

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-100">Profile Details</h2>
              <p className="mt-1 text-sm text-slate-400">The information below helps personalize your student experience.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="font-medium text-slate-300">Full Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-300">Phone</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="font-medium text-slate-300">Address Line 1</span>
                  <input
                    value={address1}
                    onChange={(event) => setAddress1(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="font-medium text-slate-300">Address Line 2</span>
                  <input
                    value={address2}
                    onChange={(event) => setAddress2(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-300">City</span>
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-300">State/Region</span>
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-300">Country</span>
                  <input
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm">
                  <span className="font-medium text-slate-300">Postal Code</span>
                  <input
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="font-medium text-slate-300">Bio</span>
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    rows={4}
                    className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-900"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  disabled={isSaving}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
                {message ? (
                  <p className={`text-sm ${message.toLowerCase().includes("success") ? "text-emerald-700" : "text-rose-700"}`}>{message}</p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
