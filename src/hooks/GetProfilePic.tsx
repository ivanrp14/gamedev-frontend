// utils/userUtils.ts
import DefaultProfile from "../images/default-profile.png";

export const getProfilePic = (profile_image?: string) => {
  if (!profile_image) return DefaultProfile;
  console.log("Profile image URL:", profile_image);
  return profile_image.startsWith("http")
    ? profile_image
    : `https://api.gamedev.study/${profile_image}`;
};
