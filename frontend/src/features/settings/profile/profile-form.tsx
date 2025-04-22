import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { settingsApi } from '@/api/settings'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: '用户名至少需要2个字符。' })
    .max(30, { message: '用户名不能超过30个字符。' }),
  email: z.string().email({ message: '请输入有效的邮箱地址。' }),
  bio: z.string().max(160, { message: '个人简介不能超过160个字符。' }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    // 加载用户资料
    settingsApi.getProfile().then(({ data }) => {
      if (data.code === 200) {
        form.reset(data.data)
      }
    })
  }, [])

  async function onSubmit(values: ProfileFormValues) {
    try {
      const { data } = await settingsApi.updateProfile(values)
      if (data.code === 200) {
        toast({
          title: '更新成功',
          description: '您的个人资料已更新。',
        })
      }
    } catch (error) {
      toast({
        title: '更新失败',
        description: '请稍后重试。',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder='请输入用户名' {...field} />
              </FormControl>
              <FormDescription>
                这是您的公开显示名称。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder='请输入邮箱' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人简介</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='介绍一下你自己'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>更新个人资料</Button>
      </form>
    </Form>
  )
}
