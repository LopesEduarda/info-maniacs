import LoginContent from './LoginContent'

export const dynamic = 'force-dynamic'

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return <LoginContent searchParams={searchParams} />
}
