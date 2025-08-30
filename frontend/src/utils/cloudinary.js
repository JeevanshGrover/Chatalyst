import axios from "axios";

export const uploadToCloudinary = async (file) => {
    const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }
    );

    return response.data;
}