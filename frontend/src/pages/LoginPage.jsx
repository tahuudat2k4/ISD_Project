import { LoginForm } from "@/components/forms/login-form.jsx"

const LoginPage = () => {
  return (
    <div>
      <div className="min-h-screen w-full relative flex items-center justify-center">
        {/* Background */ }
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={ {
            backgroundImage: "url('/assets/bg-login-new.jpg')",
          } }
        />
        {/* Nội dung */ }
        <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
          <LoginForm className="scale-75" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
