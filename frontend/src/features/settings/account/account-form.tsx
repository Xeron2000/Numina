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

const languages = [
  { label: '英语', value: 'en' },
  { label: '法语', value: 'fr' },
  { label: '德语', value: 'de' },
  { label: '西班牙语', value: 'es' },
  { label: '葡萄牙语', value: 'pt' },
  { label: '俄语', value: 'ru' },
  { label: '日语', value: 'ja' },
  { label: '韩语', value: 'ko' },
  { label: '中文', value: 'zh' },
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: '姓名至少需要2个字符。',
    })
    .max(30, {
      message: '姓名不能超过30个字符。',
    }),
  dob: z.date({
    required_error: '请选择出生日期。',
  }),
  language: z.string({
    required_error: '请选择语言。',
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
  language: '',  // Add default value for language
  dob: undefined // Add explicit undefined for dob
}

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await settingsApi.getSettings()
        if (settings?.data?.display_settings) {
          const displaySettings = settings.data.display_settings
          form.reset({
            name: displaySettings.name || '',
            language: displaySettings.language || '',
            dob: displaySettings.dob ? new Date(displaySettings.dob) : undefined,
          })
        }
      } catch (error) {
        toast({
          title: '加载失败',
          description: '无法加载您的设置，请刷新页面重试。',
          variant: 'destructive',
        })
      }
    }
    
    loadSettings()
  }, [form])

  async function onSubmit(data: AccountFormValues) {
    try {
      await settingsApi.updateDisplay({
        name: data.name,
        dob: data.dob.toISOString(),
        language: data.language
      })
      
      toast({
        title: '设置已更新',
        description: '您的账户设置已成功保存。',
      })
    } catch (error) {
      toast({
        title: '更新失败',
        description: '保存设置时发生错误，请稍后重试。',
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
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder='输入您的姓名' {...field} />
              </FormControl>
              <FormDescription>
                这是您的显示名称。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>出生日期</FormLabel>
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
                        format(field.value, 'yyyy年MM月dd日')
                      ) : (
                        <span>选择日期</span>
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
                您的出生日期将用于计算年龄。
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
              <FormLabel>Language</FormLabel>
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
                        : 'Select language'}
                      <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput placeholder='Search language...' />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
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
                这是您在应用中看到的语言。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>保存账户设置</Button>
      </form>
    </Form>
  )
}
