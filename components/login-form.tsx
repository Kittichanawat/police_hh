'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 items-center justify-center min-h-screen p-4', className)} {...props}>
      
      {/* 🔹 โลโก้สภ.หัวหิน */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <Image
          src="/logo-huahin.png" // 👉 วางโลโก้ไว้ใน public/logo-huahin.png
          alt="โลโก้ สภ.หัวหิน"
          width={90}
          height={90}
          className="rounded-md"
        />
        <h1 className="text-xl font-bold text-center">สถานีตำรวจภูธรหัวหิน</h1>
        <p className="text-sm text-muted-foreground text-center">Hua Hin Police Station</p>
      </div>

      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">เข้าสู่ระบบ</CardTitle>
          <CardDescription className="text-center">
            กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบเจ้าหน้าที่
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="เช่น officer@police.go.th"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </div>

            {/* Register link */}
            <div className="mt-4 text-center text-sm">
              ยังไม่มีบัญชีใช่หรือไม่?{' '}
              <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
                ลงทะเบียน
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
