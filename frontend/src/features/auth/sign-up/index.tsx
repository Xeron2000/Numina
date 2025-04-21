import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-lg font-semibold tracking-tight'>
            创建账户
          </h1>
          <p className='text-sm text-muted-foreground'>
            请输入您的邮箱和密码来创建账户。 <br />
            已有账户？{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              立即登录
            </Link>
          </p>
        </div>
        <SignUpForm />
      </Card>
    </AuthLayout>
  )
}
