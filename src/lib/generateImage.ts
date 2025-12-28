import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
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

        const result = await imageModel.generateContent(prompt)
        const response = await result.response

        // Gemini Image models via the SDK often return images as inline data (base64)
        // We need to look for inlineData in the response parts
        const parts = response.candidates?.[0]?.content?.parts
        const imagePart = parts?.find(part => part.inlineData) as any

        if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
            const mimeType = imagePart.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${imagePart.inlineData.data}`;
        }

        console.error('No image data found in response')
        return null
    } catch (error) {
        console.error('Image generation failed:', error)
        return null
    }
}
