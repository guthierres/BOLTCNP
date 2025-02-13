import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackToHomeButton } from "@/components/BackToHomeButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <BackToHomeButton />
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2">1. Coleta de Informações</h2>
              <p>
                Coletamos informações pessoais fornecidas voluntariamente pelos usuários durante o cadastro e uso da
                plataforma.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">2. Uso das Informações</h2>
              <p>
                As informações coletadas são utilizadas para manter o cadastro atualizado e fornecer os serviços da
                plataforma.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">3. Proteção de Dados</h2>
              <p>
                Implementamos medidas de segurança para proteger suas informações pessoais, em conformidade com a LGPD.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">4. Compartilhamento de Dados</h2>
              <p>
                Não compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei ou com seu
                consentimento explícito.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">5. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir, excluir ou limitar o uso de suas informações pessoais, conforme
                previsto na LGPD.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

