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
import { useState } from 'react'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 items-center justify-center min-h-screen p-4', className)} {...props}>
      {success ? (
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold">
              ตรวจสอบกล่องอีเมลของคุณ
            </CardTitle>
            <CardDescription className="text-center">
              ระบบได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              หากคุณเคยลงทะเบียนด้วยอีเมลนี้ ระบบจะส่งอีเมลสำหรับเปลี่ยนรหัสผ่านไปให้ กรุณาตรวจสอบกล่องจดหมายของคุณ
            </p>
            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold">
              รีเซ็ตรหัสผ่านของคุณ
            </CardTitle>
            <CardDescription className="text-center">
              กรอกอีเมลของคุณ แล้วระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้ทางอีเมล
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
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

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'กำลังส่งอีเมล...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  กลับไปเข้าสู่ระบบ
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
