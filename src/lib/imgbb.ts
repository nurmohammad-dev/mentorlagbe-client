export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing in environment variables.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please select a valid JPG, PNG, or WEBP image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result?.success || !result?.data?.url) {
    throw new Error(
      result?.error?.message || "Failed to upload image to ImgBB."
    );
  }

  return result.data.url as string;
}