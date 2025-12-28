import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.0-pro-image' })

export async function generateHeroImage(businessName: string, industry: string): Promise<string | null> {
    try {
        const prompt = `Professional hero image for ${businessName}, a ${industry} business. 
    Modern, clean, high-quality photography style. 
    Bright, inviting atmosphere. 
    No text or logos.`

        const result = await model.generateContent(prompt)
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
