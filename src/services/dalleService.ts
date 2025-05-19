import { useCallback } from 'react';

export const useDalleService = () => {
  const generateImage = useCallback(async (title: string): Promise<string | null> => {
    // Get the correct DALL-E API key from environment variables
    const dalleApiKey = import.meta.env.VITE_DALLE_API_KEY2;
    
    if (!dalleApiKey) {
      throw new Error('DALL-E API key not found in environment variables.');
    }

    const prompt = `Create a professional, high-quality image for a tech blog post titled "${title}". The image should be visually appealing, modern, and suitable for a professional technology blog.`;

    try {
      console.log('Sending request to DALL-E API with prompt:', prompt);

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dalleApiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('DALL-E API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      console.log('DALL-E API response:', {
        success: true,
        imageUrl: data.data?.[0]?.url
      });

      if (!data.data?.[0]?.url) {
        throw new Error('No image URL in DALL-E response');
      }

      return data.data[0].url;
    } catch (error) {
      console.error('Error generating image with DALL-E:', error);
      throw error;
    }
  }, []);

  return {
    generateImage,
  };
};