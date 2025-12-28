import { supabase } from './supabase'

export async function enhanceImagePrompt(basePrompt: string): Promise<string> {
    try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
            body: { promptOnly: true, basePrompt }
        })

        if (error) throw error
        return data.text || basePrompt
    } catch (e) {
        console.error("Prompt enhancement failed", e)
        return basePrompt
    }
}

export async function generateHeroImage(businessName: string, industry: string, customPrompt?: string): Promise<string | null> {
    try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
            body: { businessName, industry, customPrompt }
        })

        if (error) {
            console.error('Edge Function Error:', error)
            throw error
        }

        if (data?.image) {
            return data.image
        }

        console.error('No image returned from Edge Function')
        return null
    } catch (error: any) {
        console.error('Image generation failed details:', {
            message: error.message || 'Unknown error',
            name: error.name
        })
        return null
    }
}
