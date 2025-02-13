"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase, getPublicUrl } from "@/lib/supabaseClient"
import { Search, MapPin, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [totalPresbiteros, setTotalPresbiteros] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    fetchTotalPresbiteros()
    checkSession()
  }, [])

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      await supabase.auth.setSession(session)
    }
  }

  const fetchTotalPresbiteros = async () => {
    try {
      const { count, error } = await supabase.from("presbiteros").select("*", { count: "exact", head: true })
      if (error) throw error
      setTotalPresbiteros(count || 0)
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error)
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    try {
      const { data, error } = await supabase
        .from("presbiteros")
        .select("*")
        .or(`nome_completo.ilike.%${searchTerm}%,nome_paroquia.ilike.%${searchTerm}%`)
        .eq("aprovado", true)

      if (error) throw error
      setSearchResults(data)
    } catch (error) {
      console.error("Erro na busca:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cadastro Nacional de Presbíteros</h1>
          <p className="text-xl text-gray-600">
            Portal de verificação e consulta de presbíteros da Igreja Católica no Brasil
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou paróquia..."
                  className="flex-grow"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? <Search className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Buscar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {hasSearched && searchResults.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Nenhum resultado encontrado para sua busca. Tente outros termos.</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {searchResults.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Resultados da Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((presbitero, index) => (
                    <motion.li
                      key={presbitero.id}
                      className="py-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/perfil/${presbitero.id}`}
                        className="block hover:bg-gray-50 rounded-lg p-2 transition duration-150 ease-in-out"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={getPublicUrl(presbitero.foto_perfil)}
                              alt={presbitero.nome_completo}
                              onError={(e) => {
                                console.error("Error loading image:", e)
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(presbitero.nome_completo)}`
                              }}
                            />
                            <AvatarFallback>{presbitero.nome_completo.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate flex items-center">
                              {presbitero.nome_completo}
                              {presbitero.aprovado && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                            </p>
                            <p className="text-sm text-gray-500 truncate flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {presbitero.nome_paroquia}
                            </p>
                            <p className="text-sm text-gray-500 truncate flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(presbitero.data_ordenacao).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg font-semibold text-gray-700">Total de presbíteros cadastrados</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{totalPresbiteros}</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

