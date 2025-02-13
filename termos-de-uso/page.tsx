import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackToHomeButton } from "@/components/BackToHomeButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <BackToHomeButton />
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Termos de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Cadastro Nacional de Presbíteros do Brasil (CNP Brasil), você concorda em cumprir e
                estar vinculado a estes Termos de Uso.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">2. Uso do Serviço</h2>
              <p>
                O CNP Brasil é uma plataforma para registro e consulta de informações sobre presbíteros no Brasil. Os
                usuários devem fornecer informações precisas e atualizadas.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">3. Privacidade</h2>
              <p>
                Respeitamos sua privacidade e protegemos suas informações pessoais de acordo com nossa Política de
                Privacidade e a Lei Geral de Proteção de Dados (LGPD) do Brasil.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">4. Responsabilidades</h2>
              <p>
                Os usuários são responsáveis pela precisão das informações fornecidas e pelo uso adequado da plataforma.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2">5. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                imediatamente após sua publicação na plataforma.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

