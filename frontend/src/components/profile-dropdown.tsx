import { Link, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { authApi } from '@/api/auth'

interface UserProfile {
  id: number
  email: string
  username: string
}

interface MeResponse {
  user: UserProfile
}

export function ProfileDropdown() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authApi.me() as unknown as MeResponse
        if (response && response.user) {
          setUser(response.user)
          console.log('User profile fetched:', response.user)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        if ((error as any).response?.status === 401) {
          localStorage.removeItem('access_token')
        }
      }
    }

    const token = localStorage.getItem('access_token')
    if (token) {
      console.log('Token found:', token)
      fetchUserProfile()
    } else {
      console.log('No token found')
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      navigate({ to: '/sign-in' })
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (!user) {
    return (
      <Button variant="ghost" asChild>
        <Link to="/sign-in">登录</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt={user.username} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.username}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              设置
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
