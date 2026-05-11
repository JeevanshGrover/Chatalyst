/**
 * Cloudinary Diagnostic Test
 * Run this in the browser console to test Cloudinary configuration
 */

async function testCloudinaryUpload() {
  const cloud_name = "dhlfjccg6";
  const upload_preset = "chatalyst";

  console.log("Testing Cloudinary Upload...");
  console.log("Cloud Name:", cloud_name);
  console.log("Upload Preset:", upload_preset);

  // Create a test image (1x1 transparent PNG)
  const testImageUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  // Convert data URL to blob
  const response = await fetch(testImageUrl);
  const blob = await response.blob();
  const file = new File([blob], "test.png", { type: "image/png" });

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);

  try {
    console.log("Sending upload request...");
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadResponse.json();

    console.log("Upload Response:", data);

    if (data.secure_url) {
      console.log("✓ Upload successful!");
      console.log("Secure URL:", data.secure_url);
      console.log("Public ID:", data.public_id);

      // Test if URL is accessible
      console.log("Testing URL accessibility...");
      const urlTest = await fetch(data.secure_url);
      if (urlTest.ok) {
        console.log("✓ URL is accessible (200 OK)");
      } else {
        console.error(
          "✗ URL returned status:",
          urlTest.status,
          urlTest.statusText
        );
      }
    } else {
      console.error("✗ Upload failed:", data.error?.message || data);
    }
  } catch (error) {
    console.error("✗ Error during upload:", error);
  }
}

// Run the test
testCloudinaryUpload();
