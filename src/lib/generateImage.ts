import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
// Note: If 'gemini-3.0-pro-image' is not available, try 'imagen-3.0-generate-001' or check API docs.
const imageModel = genAI.getGenerativeModel({ model: 'gemini-3.0-pro-image' })
const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export async function enhanceImagePrompt(basePrompt: string): Promise<string> {
    try {
        const result = await textModel.generateContent(`Rewrite this image prompt to be more descriptive, photorealistic, and high-quality for a business website hero section. Keep it concise (under 50 words). Focus on lighting, composition, and mood. Avoid text/logos. Prompt: "${basePrompt}"`)
        return result.response.text().trim() || basePrompt
    } catch (e) {
        console.error("Prompt enhancement failed", e)
        return basePrompt
    }
}

export async function generateHeroImage(businessName: string, industry: string, customPrompt?: string): Promise<string | null> {
    try {
        const prompt = customPrompt || `Professional hero image for ${businessName}, a ${industry} business. 
    Modern, clean, high-quality photography style. 
    Bright, inviting atmosphere. 
    No text or logos.`

        if (!import.meta.env.VITE_GOOGLE_API_KEY) {
            console.error('API Error: VITE_GOOGLE_API_KEY is missing')
            return null
        }

        console.log('Generating image with prompt:', prompt)
        const result = await imageModel.generateContent(prompt)
        const response = await result.response

        // Log the full response structure for debugging
        // console.log('Full API Response:', JSON.stringify(response, null, 2))

        // Gemini Image models via the SDK often return images as inline data (base64)
        // We need to look for inlineData in the response parts
        const parts = response.candidates?.[0]?.content?.parts
        const imagePart = parts?.find(part => part.inlineData) as any

        if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
            const mimeType = imagePart.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${imagePart.inlineData.data}`;
        }

        console.error('No image data found in response parts. Response candidates:', response.candidates)
        return null
    } catch (error: any) {
        console.error('Image generation failed details:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            model: 'gemini-3.0-pro-image'
        })
        return null
    }
}
