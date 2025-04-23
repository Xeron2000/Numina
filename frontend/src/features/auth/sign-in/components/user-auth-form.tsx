import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { authApi } from '@/api/auth'
import { useNavigate } from '@tanstack/react-router'
import { handleServerError } from '@/utils/handle-server-error'
import { toast } from '@/hooks/use-toast'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: '请输入邮箱' })
    .email({ message: '邮箱格式不正确' }),
  password: z
    .string()
    .min(1, {
      message: '请输入密码',
    })
    .min(7, {
      message: '密码长度至少为7个字符',
    }),
})

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      }) as unknown as AuthResponse  // 直接断言为 AuthResponse 类型
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token)
        
        toast({
          title: '登录成功',
          description: '欢迎回来！'
        })
        
        setTimeout(() => {
          navigate({ to: '/' })
        }, 100)
      }
    } catch (error) {
      handleServerError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>密码</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      忘记密码？
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='请输入密码' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              登录
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  还没有账号？{' '}
                  <Link
                    to='/sign-up'
                    className='font-medium text-primary hover:underline'
                  >
                    立即注册
                  </Link>
                </span>
              </div>
            </div>


          </div>
        </form>
      </Form>
    </div>
  )
}
