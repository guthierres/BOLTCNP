"use client"
import { Button } from "@/components/ui/button"

export const ConfirmationDialog = ({ isOpen, onConfirm }: { isOpen: boolean; onConfirm: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <p className="text-lg font-medium mb-4">Tem certeza que deseja realizar esta ação?</p>
        <div className="flex justify-end">
          <Button onClick={onConfirm} className="mr-2">
            Confirmar
          </Button>
          <Button variant="outline" onClick={() => {}}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

