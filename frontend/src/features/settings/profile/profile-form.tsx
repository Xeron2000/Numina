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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      await settingsApi.updateProfile(values)
      // 直接显示成功提示
      toast({
        title: t('settings.profile.toast.success.title'),
        description: t('settings.profile.toast.success.desc'),
      })
    } catch (error) {
      toast({
        title: t('settings.profile.toast.error.title'),
        description: t('settings.profile.toast.error.desc'),
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
              <FormLabel>{t('settings.profile.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('settings.profile.username_ph')} {...field} />
              </FormControl>
              <FormDescription>
                {t('settings.profile.username_desc')}
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
              <FormLabel>{t('settings.profile.email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('settings.profile.email_ph')} {...field} />
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
              <FormLabel>{t('settings.profile.bio')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('settings.profile.bio_ph')}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('settings.profile.submit')}</Button>
      </form>
    </Form>
  )
}
