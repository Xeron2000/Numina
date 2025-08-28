import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { settingsApi } from '@/api/settings'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { label: '中文', value: 'zh-CN' },
  { label: '英语', value: 'en-US' },
] as const

const accountFormSchema = z.object({
  name: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .min(2, {
        message: '姓名至少需要2个字符。',
      })
      .max(30, {
        message: '姓名不能超过30个字符。',
      })
      .optional()
  ),
  dob: z.date().optional(),
  language: z.string({
    required_error: '请选择语言。',
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { t, i18n } = useTranslation()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      language: 'zh-CN',
    },
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await settingsApi.getAccountSettings()
        if (data.code === 200) {
          form.reset({
            name: data.data.name,
            language: data.data.language,
            dob: data.data.dob ? new Date(data.data.dob) : undefined,
          })
          if (data.data.language) {
            i18n.changeLanguage(data.data.language)
          }
        }
      } catch (error) {
        toast({
          title: t('toast.load_failed.title'),
          description: t('toast.load_failed.desc'),
          variant: 'destructive',
        })
      }
    }
    loadSettings()
  }, [form, i18n, t])

  async function onSubmit(values: AccountFormValues) {
    try {
      await settingsApi.updateAccountSettings({
        name: values.name ?? '',
        language: values.language,
        dob: values.dob ? format(values.dob, 'yyyy-MM-dd') : '',
      })
      toast({
        title: t('toast.update_success.title'),
        description: t('toast.update_success.desc'),
      })
    } catch (error) {
      toast({
        title: t('toast.update_failed.title'),
        description: t('toast.update_failed.desc'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.account.name_label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('settings.account.name_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('settings.account.dob_label')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>{t('settings.account.dob_select')}</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                {t('settings.account.dob_description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('settings.account.language_label')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : t('settings.account.language_select')}
                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput placeholder={t('settings.account.language_search')} />
                    <CommandEmpty>{t('settings.account.language_empty')}</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                              i18n.changeLanguage(language.value)
                              toast({
                                title: t('toast.lang_changed.title'),
                                description: t('toast.lang_changed.desc'),
                              })
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                language.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                {t('settings.account.language_description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('settings.account.save')}</Button>
      </form>
    </Form>
  )
}
