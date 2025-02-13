import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Envia para o Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`${userId}/${file.name}`, file, { upsert: true })

    if (error) throw error

    return NextResponse.json({ url: data.path }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
  }
}
