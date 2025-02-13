"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase, getPublicUrl } from "@/lib/supabaseClient"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { BackToHomeButton } from "@/components/BackToHomeButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Edit, Trash2, Eye, CheckCircle } from "lucide-react"

export default function PainelDeControle() {
  const router = useRouter()
  const [presbiteros, setPresbiteros] = useState([])
  const [stats, setStats] = useState({ total: 0, aprovados: 0, pendentes: 0 })
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    action: null,
    presbiteroId: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [adminName, setAdminName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setIsLoading(true)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Erro ao buscar usuário:", userError)
      router.push("/login")
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, username")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError)
      router.push("/")
      return
    }

    if (profile?.role !== "administrador") {
      console.error("Acesso não autorizado")
      router.push("/")
      return
    }

    setAdminName(profile.username || "Admin")
    setIsLoading(false)
    fetchPresbiteros()
  }

  const fetchPresbiteros = async () => {
    const { data, error } = await supabase.from("presbiteros").select("*")

    if (error) {
      console.error("Erro ao buscar presbíteros:", error)
    } else {
      setPresbiteros(data)
      updateStats(data)
    }
  }

  const updateStats = (data) => {
    const total = data.length
    const aprovados = data.filter((p) => p.aprovado).length
    const pendentes = total - aprovados
    setStats({ total, aprovados, pendentes })
  }

  const handleAprovar = async (id) => {
    setConfirmationDialog({
      isOpen: true,
      action: "aprovar",
      presbiteroId: id,
    })
  }

  const handleExcluir = async (id) => {
    setConfirmationDialog({
      isOpen: true,
      action: "excluir",
      presbiteroId: id,
    })
  }

  const handleConfirmAction = async () => {
    const { action, presbiteroId } = confirmationDialog

    if (action === "aprovar") {
      const { error } = await supabase.from("presbiteros").update({ aprovado: true }).eq("id", presbiteroId)

      if (error) {
        console.error("Erro ao aprovar presbítero:", error)
      } else {
        fetchPresbiteros()
      }
    } else if (action === "excluir") {
      const { error } = await supabase.from("presbiteros").delete().eq("id", presbiteroId)

      if (error) {
        console.error("Erro ao excluir presbítero:", error)
      } else {
        fetchPresbiteros()
      }
    }

    setConfirmationDialog({ isOpen: false, action: null, presbiteroId: null })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const filteredPresbiteros = presbiteros.filter(
    (presbitero) =>
      presbitero.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presbitero.nome_paroquia.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Olá, {adminName}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <BackToHomeButton />
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-2">Total de Cadastros</h2>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-2">Aprovados</h2>
                  <p className="text-3xl font-bold">{stats.aprovados}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-2">Pendentes</h2>
                  <p className="text-3xl font-bold">{stats.pendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Lista de Presbíteros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Buscar presbíteros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <ul className="divide-y divide-gray-200">
                {filteredPresbiteros.map((presbitero) => (
                  <li key={presbitero.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getPublicUrl(presbitero.foto_perfil)} alt={presbitero.nome_completo} />
                        <AvatarFallback>{presbitero.nome_completo.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          {presbitero.nome_completo}
                          {presbitero.aprovado && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                        </p>
                        <p className="text-sm text-gray-500">{presbitero.nome_paroquia}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/perfil/${presbitero.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/editar/${presbitero.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button onClick={() => handleAprovar(presbitero.id)} disabled={presbitero.aprovado} size="sm">
                          {presbitero.aprovado ? "Aprovado" : "Aprovar"}
                        </Button>
                        <Button onClick={() => handleExcluir(presbitero.id)} variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ isOpen: false, action: null, presbiteroId: null })}
        onConfirm={handleConfirmAction}
        title={confirmationDialog.action === "aprovar" ? "Aprovar Presbítero" : "Excluir Presbítero"}
        description={
          confirmationDialog.action === "aprovar"
            ? "Tem certeza que deseja aprovar este presbítero?"
            : "Tem certeza que deseja excluir este presbítero?"
        }
        confirmText={confirmationDialog.action === "aprovar" ? "Aprovar" : "Excluir"}
      />
    </div>
  )
}

