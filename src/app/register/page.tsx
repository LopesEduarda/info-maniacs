'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerSchema } from '@/schemas/auth'
import { useAuth } from '@/hooks/useAuth'
import type { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

type RegisterFormData = z.infer<typeof registerSchema> & {
  confirmPassword: string
}

const registerFormSchema = registerSchema.extend({
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register: registerUser, isAuthenticated } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      const result = await registerUser(data.name, data.email.trim().toLowerCase(), data.password)

      if (result.success) {
        router.push('/dashboard')
      } else {
        setErrorMessage(result.error || 'Erro ao criar conta')
      }
    } catch (error) {
      setErrorMessage('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-pink-100/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Crie sua conta
            </h1>
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-pink-600 hover:text-pink-700 transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6">
              <Alert
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Nome completo"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Senha"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                {...register('password')}
                error={errors.password?.message}
              />

              <Input
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                placeholder="Digite a senha novamente"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">A senha deve conter:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${password && password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No mínimo 8 caracteres
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${password && /(?=.*[A-Z])/.test(password) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pelo menos uma letra maiúscula
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${password && /(?=.*[a-z])/.test(password) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pelo menos uma letra minúscula
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${password && /(?=.*\d)/.test(password) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pelo menos um número
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              {isSubmitting || isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Comece a organizar sua vida hoje mesmo
          </p>
        </div>
      </div>
    </div>
  )
}
