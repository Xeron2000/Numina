// components/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = (selectedTheme: Theme) => {
    setTheme(selectedTheme)
    localStorage.setItem('theme', selectedTheme)
    document.documentElement.setAttribute('data-theme', selectedTheme)
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost gap-1">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          {theme === 'light' ? (
            // Sun图标
            <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.1m12.786-1.414 1.414 1.414M22 12h-2m-3.686-5.686L19.1 4.9M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
          ) : (
            // Moon图标
            <path d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646Z" />
          )}
        </svg>
        <span className="hidden md:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <button onClick={() => toggleTheme('light')}>Light</button>
        </li>
        <li>
          <button onClick={() => toggleTheme('dark')}>Dark</button>
        </li>
      </ul>
    </div>
  )
}