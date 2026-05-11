import axios from "axios";

export const uploadToCloudinary = async (file) => {
    const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );

        console.log("Cloudinary Response:", response.data);
        
        // Check for error in response
        if (response.data.error) {
            throw new Error(`Cloudinary error: ${response.data.error.message}`);
        }

        // Validate required fields
        if (!response.data.secure_url || !response.data.public_id) {
            throw new Error("Invalid Cloudinary response - missing secure_url or public_id");
        }

        return response.data;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}