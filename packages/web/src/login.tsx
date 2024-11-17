import { Button } from "@/components/ui/button"

   

export default function Login() {
  return (
    <div>
      <Button onClick={() => window.location.href = 'http://localhost:3000/auth/github'}>Login</Button>
    </div>
  )
}