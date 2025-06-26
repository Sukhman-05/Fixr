export const analyzeImageWithAI = async (
  imageUri: string,
  threadId: string = ""
): Promise<{ diagnosis: string; threadID: string }> => {
  const PYTHON_API_URL = process.env.EXPO_PUBLIC_AI_API_URL || 'http://127.0.0.1:8000';

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  } as any);
  formData.append('threadID', threadId);

  const response = await fetch(`${PYTHON_API_URL}/analyze-image/`, {
    method: 'POST',
    body: formData,
    // Do not set Content-Type, let fetch handle it
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return {
    diagnosis: data.gemini_result?.message2 || "Sorry, I couldn't analyze the image.",
    threadID: data.gemini_result?.threadID || "",
  };
};
