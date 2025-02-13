"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase, uploadFile } from "@/lib/supabaseClient"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import { BackToHomeButton } from "@/components/BackToHomeButton"

export default function Cadastro() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome_completo: "",
    grau_ordem: "",
    diocese: "",
    data_ordenacao: "",
    bispo_ordenante: "",
    ocupacao_canonica: "",
    nome_paroquia: "",
    foto_perfil: null,
    documento_ordenacao: null,
    facebook: "",
    instagram: "",
    website: "",
    email: "",
    outras_informacoes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fieldName = e.target.name
      if (file.size <= 200 * 1024) {
        setFormData({ ...formData, [fieldName]: file })
      } else {
        alert("O arquivo excede o tamanho máximo permitido (200KB).")
        e.target.value = ""
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let foto_perfil_url = ""
      let documento_ordenacao_url = ""

      if (formData.foto_perfil instanceof File) {
        foto_perfil_url = await uploadFile(formData.foto_perfil, "fotos_perfil")
      }

      if (formData.documento_ordenacao instanceof File) {
        documento_ordenacao_url = await uploadFile(formData.documento_ordenacao, "documentos_ordenacao")
      }

      const { data, error } = await supabase.from("presbiteros").insert([
        {
          ...formData,
          foto_perfil: foto_perfil_url,
          documento_ordenacao: documento_ordenacao_url,
        },
      ])

      if (error) throw error

      alert("Cadastro realizado com sucesso! Aguarde a aprovação.")
      router.push("/")
    } catch (error) {
      alert("Erro ao realizar cadastro. Por favor, tente novamente.")
      console.error("Erro:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <BackToHomeButton />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Cadastro de Religioso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome Completo</Label>
                  <Input type="text" id="nome_completo" name="nome_completo" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grau_ordem">Grau de Ordem</Label>
                  <Select onValueChange={(value) => handleSelectChange("grau_ordem", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grau de ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diacono">Diácono</SelectItem>
                      <SelectItem value="presbitero">Presbítero</SelectItem>
                      <SelectItem value="bispo">Bispo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diocese">Diocese</Label>
                  <Input type="text" id="diocese" name="diocese" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_ordenacao">Data da Ordenação</Label>
                  <Input type="date" id="data_ordenacao" name="data_ordenacao" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bispo_ordenante">Bispo Ordenante</Label>
                  <Input type="text" id="bispo_ordenante" name="bispo_ordenante" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ocupacao_canonica">Ocupação Canônica</Label>
                  <Select onValueChange={(value) => handleSelectChange("ocupacao_canonica", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ocupação canônica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vigario">Vigário</SelectItem>
                      <SelectItem value="paroco">Pároco</SelectItem>
                      <SelectItem value="auxiliar">Auxiliar</SelectItem>
                      <SelectItem value="titular">Titular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_paroquia">Nome da Paróquia</Label>
                  <Input type="text" id="nome_paroquia" name="nome_paroquia" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foto_perfil">Foto para o perfil (até 200KB)</Label>
                  <Input type="file" id="foto_perfil" name="foto_perfil" onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento_ordenacao">Comprovante de ordenação (até 200KB)</Label>
                  <Input
                    type="file"
                    id="documento_ordenacao"
                    name="documento_ordenacao"
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input type="text" id="facebook" name="facebook" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input type="text" id="instagram" name="instagram" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input type="url" id="website" name="website" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input type="email" id="email" name="email" onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outras_informacoes">Outras Informações</Label>
                <Textarea id="outras_informacoes" name="outras_informacoes" onChange={handleChange} className="h-32" />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Cadastro
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

