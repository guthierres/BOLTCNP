import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadFile(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage.from("uploads").upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from("uploads").getPublicUrl(filePath)

  return data.publicUrl
}

export function getPublicUrl(path: string | null): string | null {
  if (!path) return null
  const { data } = supabase.storage.from("uploads").getPublicUrl(path)
  return data.publicUrl
}

