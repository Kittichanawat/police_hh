"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
export default function VisitForm() {
  const [date, setDate] = useState<Date>()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    station: "",
    officer: "",
    position: "",
    location: "",
    citizen: "",
    SubDistrict: "",
    District: "",
    Province: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, ...formData }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to send data")

      alert("✅ บันทึกข้อมูลเรียบร้อย!")

      // ✅ รีเซ็ตค่า input ทั้งหมดหลังบันทึกสำเร็จ
      setFormData({
        station: "",
        officer: "",
        position: "",
        location: "",
        citizen: "",
        SubDistrict: "",
        District: "",
        Province: "",
      })
      setDate(undefined)

      console.log("✅ Sent:", result)
    } catch (err) {
      console.error("❌ Error:", err)
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  const router = useRouter()
  // ✅ ฟังก์ชัน Logout (ใช้ Supabase)
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo-huahin.png" // ← วางโลโก้ไว้ใน public/logo-huahin.png
            alt="สภ.หัวหิน Logo"
            width={60}
            height={60}
            className="rounded-md"
          />
          <div>
            <h1 className="text-2xl font-bold">สภ.หัวหิน</h1>
            <p className="text-sm text-muted-foreground">
              Hua Hin Police Station
            </p>
          </div>
        </div>

        <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </Button>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Police Community Visit Record Form
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            แบบบันทึกการตรวจเยี่ยมประชาชน / Public Visit Report
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date of Visit</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Station */}
            <div className="space-y-2">
              <Label>Police Station (สภ.)</Label>
              <Input name="station" placeholder="เช่น สภ.หัวหิน" value={formData.station} onChange={handleChange} />
            </div>

            {/* Officer */}
            <div className="space-y-2">
              <Label>Officer Name (ชื่อเจ้าหน้าที่)</Label>
              <Input
                name="officer"
                placeholder="เช่น ร.ต.ต.ทินกร กังวา"
                value={formData.officer}          // ✅ เพิ่มบรรทัดนี้
                onChange={handleChange}
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label>Position (ตำแหน่ง)</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))} value={formData.position}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ผบ.หมู่">ผบ.หมู่</SelectItem>
                  <SelectItem value="รอง สวป.">รอง สวป.</SelectItem>
                  <SelectItem value="สวป.">สวป.</SelectItem>
                  <SelectItem value="รอง สว.">รอง สว.</SelectItem>
                  <SelectItem value="ผกก.">ผกก.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location (สถานที่ตรวจเยี่ยม)</Label>
              <Input name="location" placeholder="เช่น ร้านขายของชำ หมู่ 3 ต.หัวหิน" value={formData.location} onChange={handleChange} />
            </div>

            {/* SubDistrict / District / Province */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>SubDistrict (ตำบล)</Label>
                <Input name="SubDistrict" placeholder="เช่น หัวหิน" value={formData.SubDistrict} onChange={handleChange} />
              </div>
              <div>
                <Label>District (อำเภอ)</Label>
                <Input name="District" placeholder="เช่น บางสะพาน" value={formData.District} onChange={handleChange} />
              </div>
              <div>
                <Label>Province (จังหวัด)</Label>
                <Input name="Province" placeholder="เช่น ประจวบคีรีขันธ์" value={formData.Province} onChange={handleChange} />
              </div>
            </div>

            {/* Citizen */}
            <div className="space-y-2">
              <Label>Citizen Visited (ประชาชนที่ตรวจเยี่ยม)</Label>
              <Input name="citizen" placeholder="เช่น นายอภิสิทธิ์ แก้วธร" value={formData.citizen} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
