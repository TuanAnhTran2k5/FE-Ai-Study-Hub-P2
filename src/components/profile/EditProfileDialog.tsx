import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Edit, Loader2, Save, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { ERROR_CODE } from "@/constants/errorCode";
import { SUCCESS_MESSAGE } from "@/constants/successMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/redux/features/userSlice";
import { updateUserProfile } from "@/services/userService";
import type { UpdateProfileRequest, UserResponse } from "@/types/user.type";

interface EditProfileDialogProps {
  user: UserResponse;
}

function EditProfileDialog({ user }: EditProfileDialogProps) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    user.avatarUrl,
  );

  useEffect(() => {
    setFullName(user.fullName || "");
    setPreviewAvatar(user.avatarUrl);
    setAvatarFile(null);
  }, [user.fullName, user.avatarUrl]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,

    onSuccess: (data) => {
      dispatch(updateProfile(data));
      queryClient.setQueryData(["my-profile"], data);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["publicDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["document"] });
      toast.success(SUCCESS_MESSAGE.PROFILE_UPDATED);
      setOpen(false);
    },

    onError: (error: any) => {
      const errorMessage = error.response?.data?.message;

      if (errorMessage === "UNSUPPORTED_IMAGE_TYPE") {
        toast.error(ERROR_CODE.UNSUPPORTED_IMAGE_TYPE);
      } else if (errorMessage === "INVALID_IMAGE_SIZE") {
        toast.error(ERROR_CODE.INVALID_IMAGE_SIZE);
      } else if (errorMessage === "FILE_UPLOAD_FAILED") {
        toast.error(ERROR_CODE.FILE_UPLOAD_FAILED);
      } else {
        toast.error(ERROR_CODE.PROFILE_UPDATE_FAILED);
      }
    },
  });

  const handleChooseAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 1. Kiểm tra định dạng ảnh (hỗ trợ MIME image/* hoặc các đuôi ảnh mở rộng phổ biến)
    const allowedExtensions = /\.(heic|heif|bmp|tiff|svg|avif|webp|png|jpg|jpeg|gif|ico)$/i;
    const isImageMime = file.type.startsWith("image/");
    const isValidExtension = allowedExtensions.test(file.name);

    if (!isImageMime && !isValidExtension) {
      toast.error(ERROR_CODE.UNSUPPORTED_IMAGE_TYPE);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 2. Kiểm tra kích thước file (tối đa 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(ERROR_CODE.INVALID_IMAGE_SIZE);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const trimmedFullName = fullName.trim();

    if (!trimmedFullName) {
      toast.error(ERROR_CODE.FIELD_REQUIRED);
      return;
    }

    if (trimmedFullName.length < 5 || trimmedFullName.length > 50) {
      toast.error("Full name must be between 5 and 50 characters");
      return;
    }

    const payload: UpdateProfileRequest = {
      fullName: trimmedFullName,
      avatar: avatarFile,
    };

    updateMutation.mutate(payload);
  };

  const handleCancel = () => {
    setFullName(user.fullName || "");
    setPreviewAvatar(user.avatarUrl);
    setAvatarFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-11 cursor-pointer rounded-xl font-bold"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-card-foreground">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-primary/30 bg-secondary transition-opacity hover:opacity-90"
              >
                {previewAvatar ? (
                  <img
                    src={previewAvatar}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-primary">
                    {fullName.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:scale-105"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic,.heif,.avif,.ico"
                className="hidden"
                onChange={handleChooseAvatar}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-card-foreground">
              Full name
            </label>

            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              className="h-11 rounded-xl"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Full name must be between 5 and 50 characters.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer rounded-xl font-bold"
              disabled={updateMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer rounded-xl font-bold"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;