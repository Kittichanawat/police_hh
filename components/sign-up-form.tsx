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

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-screen p-4', className)} {...props}>
      
      {/* 🔹 โลโก้สภ.หัวหิน */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <Image
          src="/logo-huahin.png" // 👉 วางไฟล์โลโก้ใน public/logo-huahin.png
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
          <CardTitle className="text-2xl text-center font-semibold">สมัครสมาชิก</CardTitle>
          <CardDescription className="text-center">
            สร้างบัญชีผู้ใช้งานใหม่เพื่อเข้าสู่ระบบเจ้าหน้าที่
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Repeat Password */}
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">ยืนยันรหัสผ่าน</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
              </Button>
            </div>

            {/* Redirect to Login */}
            <div className="mt-4 text-center text-sm">
              มีบัญชีอยู่แล้ว?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                เข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
