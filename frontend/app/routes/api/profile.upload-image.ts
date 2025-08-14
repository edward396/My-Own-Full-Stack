export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const profileImage = formData.get('profileImage') as File;

    if (!profileImage) {
      return new Response(
        JSON.stringify({ success: false, error: "No image file provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate file type
    if (!profileImage.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ success: false, error: "File must be an image" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (profileImage.size > maxSize) {
      return new Response(
        JSON.stringify({ success: false, error: "File size must be less than 2MB" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real application, you would:
    // 1. Upload to cloud storage (S3, Cloudinary, etc.)
    // 2. Save the image URL to the user's profile in the database
    // 3. Return the actual image URL

    // For demo purposes, return a mock URL
    const mockImageUrl = `https://via.placeholder.com/150x150.png?text=${encodeURIComponent(
      profileImage.name.substring(0, 10)
    )}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: mockImageUrl,
        message: "Profile image uploaded successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Upload failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}