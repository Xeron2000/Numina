import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
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
import { toast } from 'sonner'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: '请输入邮箱' })
      .email({ message: '邮箱格式不正确' }),
    username: z
      .string()
      .min(1, { message: '请输入用户名' })
      .min(3, { message: '用户名至少需要3个字符' }),
    password: z
      .string()
      .min(1, {
        message: '请输入密码',
      })
      .min(7, {
        message: '密码长度至少为7个字符',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await authApi.register({
        email: data.email,
        username: data.username,
        password: data.password,
      })
      
      // 打印响应看看结构
      console.log('Register response:', response)
      
      // 直接访问 response 中的 access_token
      if (response.access_token) {
        // 存储 token
        localStorage.setItem('token', response.access_token)
        
        // 注册成功提示
        toast.success('注册成功', {
          description: '欢迎加入！'
        })
        
        // 确保在设置完 token 后再跳转
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
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入用户名' {...field} />
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
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='请输入密码' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='请再次输入密码' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              创建账户
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
