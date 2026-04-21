import { GalleryVerticalEnd } from "lucide-react"
import { OTPForm } from "../components/OTPForm"

export default function OTPPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <OTPForm/>
      </div>
    </div>
  )
}
