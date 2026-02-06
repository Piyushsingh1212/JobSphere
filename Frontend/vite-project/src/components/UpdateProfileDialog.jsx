import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  // ✅ Form State
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });

  // ✅ Load user data when dialog opens
  useEffect(() => {
    if (open && user) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.length
          ? user.profile.skills.join(", ")
          : "",
        file: null,
      });
    }
  }, [open, user]);

  // ✅ Input Change Handler
  const changeEventHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ File Change Handler
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput((prev) => ({
      ...prev,
      file,
    }));
  };

  // ✅ Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Convert skills string → array
      const skillsArray = input.skills
        ? input.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      // Create FormData
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", JSON.stringify(skillsArray));

      if (input.file) {
        formData.append("file", input.file);
      }

      // API Call
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        // Close Dialog
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Profile update failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[450px]"
        onInteractOutside={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        {/* ✅ Header */}
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>

          <DialogDescription>
            Update your profile details including bio, skills, and resume.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Full Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullname" className="text-right">
              Name
            </Label>
            <Input
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="col-span-3"
              required
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              className="col-span-3"
              required
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="col-span-3"
            />
          </div>

          {/* Bio */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Input
              id="bio"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              className="col-span-3"
            />
          </div>

          {/* Skills */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skills" className="text-right">
              Skills
            </Label>
            <Input
              id="skills"
              name="skills"
              placeholder="React, Node, MongoDB"
              value={input.skills}
              onChange={changeEventHandler}
              className="col-span-3"
            />
          </div>

          {/* Resume Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Resume
            </Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
              className="col-span-3"
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
