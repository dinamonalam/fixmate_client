
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey || apiKey === 'your_imgbb_api_key_here' || apiKey.startsWith('mock_')) {
    // Generate simulated realistic preview URL using object URL or high-quality placeholder
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'ImgBB upload failed');
    }
  } catch (err: any) {
    console.warn('ImgBB upload error, falling back to local file reader:', err.message);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
}
