import axios from "axios";

// Function to determine if a file is an image or video
const getUploadUrl = (file) => {
  // Check file type to determine the correct upload URL
  if (file.type.startsWith("image/")) {
    return "https://api.cloudinary.com/v1_1/dkqpzws52/image/upload";
  } else if (file.type.startsWith("video/")) {
    return "https://api.cloudinary.com/v1_1/dkqpzws52/video/upload";
  } else {
    throw new Error("Unsupported file type");
  }
};

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "upload");

  try {
    const uploadUrl = getUploadUrl(file);
    const uploadRes = await axios.post(uploadUrl, data);
    const { url } = uploadRes.data;

    return url;
  } catch (error) {
    alert("Failed to upload file. Please try again.");
    console.log(error.message);
  }
};

export default upload;
