import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-gray-400">
          &copy; 2023 CNP Brasil. Todos os direitos reservados.
          <Link href="/termos-de-uso" className="ml-2 hover:text-gray-600">
            Termos de Uso
          </Link>
          <span className="mx-1">|</span>
          <Link href="/politica-de-privacidade" className="hover:text-gray-600">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </footer>
  )
}

