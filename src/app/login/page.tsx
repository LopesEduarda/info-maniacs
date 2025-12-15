import { Suspense } from 'react'
import LoginContent from './LoginContent'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
