import { createClient } from "./supabase-server"

export async function getSignedUrl(path: string, bucket: string = "community-media", expiresIn: number = 60) {
    if (!path) return null

    const supabase = createClient()
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

    if (error) {
        console.error("Error generating signed URL:", error)
        return null
    }

    return data.signedUrl
}
