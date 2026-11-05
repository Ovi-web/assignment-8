"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authenticatedFetch } from "@/lib/authenticated-fetch";
import { authClient } from "@/lib/auth-client";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Mystery",
  "Biography",
  "Poetry",
  "Other",
];

const MAX_COVER_SIZE = 4 * 1024 * 1024;
const ACCEPTED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Could not read the selected image."));
        }
      },
      { once: true },
    );
    reader.addEventListener(
      "error",
      () => reject(reader.error ?? new Error("Could not read the selected image.")),
      { once: true },
    );
    reader.readAsDataURL(file);
  });
}

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageSource, setImageSource] = useState("url");
  const [uploadedImage, setUploadedImage] = useState("");
  const [imageError, setImageError] = useState("");

  async function handleImageUpload(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    setUploadedImage("");
    setImageError("");
    if (!file) return;

    if (!ACCEPTED_COVER_TYPES.includes(file.type)) {
      setImageError("Choose a JPEG, PNG, or WebP image.");
      input.value = "";
      return;
    }

    if (file.size > MAX_COVER_SIZE) {
      setImageError("The cover image must be 4 MB or smaller.");
      input.value = "";
      return;
    }

    try {
      setUploadedImage(await readFileAsDataUrl(file));
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Could not read the selected image.",
      );
      input.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);

    if (!category) {
      setMessage({ type: "error", text: "Please choose a book category." });
      return;
    }

    const formData = new FormData(form);
    const book = {
      title: String(formData.get("title") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      category,
      totalCopies: Number(formData.get("totalCopies")),
      imageUrl:
        imageSource === "upload"
          ? uploadedImage
          : String(formData.get("imageUrl") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
    };

    if (!book.title || !book.author || !book.description) {
      setMessage({
        type: "error",
        text: "Please fill in the title, author, and description.",
      });
      return;
    }

    if (imageSource === "upload" && !book.imageUrl) {
      setMessage({
        type: "error",
        text: "Choose an image to upload or select the image URL option.",
      });
      return;
    }

    if (!Number.isInteger(book.totalCopies) || book.totalCopies < 1) {
      setMessage({
        type: "error",
        text: "Total copies must be a whole number greater than zero.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch("/api/books", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        let result;
        try {
          result = await response.json();
        } catch {
          result = null;
        }

        if (response.status === 404) {
          throw new Error(
            "The book endpoint was not found. Check the configured Express /add-books route.",
          );
        }

        throw new Error(
          result?.message || "We couldn't add this book. Please try again.",
        );
      }

      form.reset();
      setCategory("");
      setImageSource("url");
      setUploadedImage("");
      setImageError("");
      toast.success("Your book was added successfully.");
      router.refresh();
      router.push("/my-books");
    } catch (error) {
      let errorText = "Something went wrong. Please try again.";

      if (error instanceof TypeError) {
        errorText =
          "Could not connect to the book server. Make sure it is running and try again.";
      } else if (error instanceof Error) {
        errorText = error.message;
      }

      setMessage({
        type: "error",
        text: errorText,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "h-11 border-[#d7c8b7] bg-[#f9f3ec] text-[#102a3f] placeholder:text-[#53657b]/55";

  return (
    <main className="flex-1 bg-background px-4 py-12 text-foreground sm:px-6 sm:py-16">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Add a Book
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Put a book from your shelf into the library.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#d7c8b7] bg-[#fffdf9] p-5 shadow-xl shadow-[#102a3f]/10 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Book Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                className={fieldClassName}
                placeholder="e.g. The Midnight Library"
                autoComplete="off"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium">
                Author Name
              </label>
              <Input
                id="author"
                name="author"
                type="text"
                className={fieldClassName}
                placeholder="e.g. Matt Haig"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger
                  id="category"
                  className="h-11 w-full border-[#d7c8b7] bg-[#f9f3ec] text-[#102a3f]"
                  aria-label="Category"
                  aria-required="true"
                >
                  <SelectValue className="" placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="border-[#d7c8b7] bg-[#fffdf9] text-[#102a3f]">
                  {categories.map((item) => (
                    <SelectItem key={item} value={item} className="focus:bg-[#ebe3d8] focus:text-[#102a3f]">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="totalCopies" className="text-sm font-medium">
                Total Copies
              </label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                step={1}
                defaultValue={1}
                className={fieldClassName}
                required
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">
                  Book Cover{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </legend>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageSource"
                      value="url"
                      checked={imageSource === "url"}
                      onChange={() => {
                        setImageSource("url");
                        setImageError("");
                      }}
                      className="accent-[#102a3f]"
                    />
                    Use image URL
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageSource"
                      value="upload"
                      checked={imageSource === "upload"}
                      onChange={() => {
                        setImageSource("upload");
                        setImageError("");
                      }}
                      className="accent-[#102a3f]"
                    />
                    Upload from device
                  </label>
                </div>
              </fieldset>

              {imageSource === "url" ? (
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className={fieldClassName}
                  placeholder="https://example.com/book-cover.jpg"
                  aria-label="Book cover image URL"
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className={`${fieldClassName} file:mr-3 file:cursor-pointer file:rounded-md file:bg-[#102a3f] file:px-3 file:py-1 file:text-white`}
                    aria-label="Choose a book cover image from your device"
                    aria-describedby="imageFileHelp"
                  />
                  <p id="imageFileHelp" className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP; maximum file size 4 MB.
                  </p>
                  {imageError && (
                    <p role="alert" className="text-sm text-red-700">
                      {imageError}
                    </p>
                  )}
                  {uploadedImage && (
                    <div className="relative mx-auto aspect-[2/3] w-32 overflow-hidden rounded-md border border-[#d7c8b7] bg-[#ebe3d8]">
                      <Image
                        src={uploadedImage}
                        alt="Selected book cover preview"
                        fill
                        unoptimized
                        sizes="128px"
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Short Description
              </label>
              <Textarea
                id="description"
                name="description"
                className="min-h-28 resize-y border-[#d7c8b7] bg-[#f9f3ec] text-[#102a3f] placeholder:text-[#53657b]/55"
                placeholder="What should other readers know about this book?"
                maxLength={500}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium">
                User Name
              </label>
              <Input
                id="userName"
                name="userName"
                type="text"
                value={session?.user?.name ?? ""}
                className="h-11 border-[#d7c8b7] bg-[#ebe3d8] text-muted-foreground"
                placeholder="Your account name"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="userEmail" className="text-sm font-medium">
                User Email
              </label>
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                value={session?.user?.email ?? ""}
                className="h-11 border-[#d7c8b7] bg-[#ebe3d8] text-muted-foreground"
                placeholder="Your account email"
                readOnly
              />
            </div>
          </div>

          {message && (
            <p
              role={message.type === "error" ? "alert" : "status"}
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full bg-[#102a3f] font-semibold text-white hover:bg-[#183a57]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                Adding book...
              </>
            ) : (
              "Add Book"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}