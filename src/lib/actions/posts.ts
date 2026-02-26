"use server"

import { createClient } from "../supabase-server"
import { revalidatePath } from "next/cache"

export async function supportPost(postId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Check if vote exists
    const { data: existingVote } = await supabase
        .from("post_votes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single()

    if (existingVote) {
        // Remove vote
        await supabase
            .from("post_votes")
            .delete()
            .eq("id", existingVote.id)
    } else {
        // Add vote
        await supabase
            .from("post_votes")
            .insert({ post_id: postId, user_id: user.id })
    }

    revalidatePath("/communities")
}

export async function reactToPost(postId: string, reactionType: 'profound' | 'thought_provoking' | 'applicable' | 'comprehensive' | 'witty') {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Check if reaction exists
    const { data: existingReaction } = await supabase
        .from("post_reactions")
        .select("id, reaction_type")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single()

    if (existingReaction) {
        if (existingReaction.reaction_type === reactionType) {
            // Remove if same
            await supabase
                .from("post_reactions")
                .delete()
                .eq("id", existingReaction.id)
        } else {
            // Update if different
            await supabase
                .from("post_reactions")
                .update({ reaction_type: reactionType })
                .eq("id", existingReaction.id)
        }
    } else {
        // Insert new
        await supabase
            .from("post_reactions")
            .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType })
    }

    revalidatePath("/communities")
}

export async function savePost(postId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Check if saved
    const { data: existingSaved } = await supabase
        .from("saved_posts")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single()

    if (existingSaved) {
        await supabase
            .from("saved_posts")
            .delete()
            .eq("id", existingSaved.id)
    } else {
        await supabase
            .from("saved_posts")
            .insert({ post_id: postId, user_id: user.id })
    }

    revalidatePath("/communities")
}
