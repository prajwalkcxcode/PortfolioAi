import { useEffect } from 'react'

export function useDarkMode() {
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', String(isDark))
  }

  return { toggleDarkMode }
}
