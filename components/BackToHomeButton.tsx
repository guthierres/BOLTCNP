import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackToHomeButton() {
  return (
    <Link href="/">
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para página inicial
      </Button>
    </Link>
  )
}

