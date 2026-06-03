import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
//import { useAuth } from "../hooks/useAuth";

export function Login() {
   /* const {
        email, setEmail,
        password, setPassword,
        showPassword, togglePassword,
        handleSubmit,
        isLoading,
        errorMsg,
    } = useAuth();
*/

const [showPassword, setShowPassword] = useState(false)
    return (
       <main className="min-h-screen bg-[#EEF0F3]">

  <div className="w-full bg-[#EEF0F3] flex flex-col min-h-screen">

    <div className=" bg-[#162B40] flex items-center justify-center relative"
      style={{ minHeight: 310, paddingTop: 40, paddingBottom: 0 }}>

      <h1 className="text-white text-6xl font-extralight tracking-[3px] uppercase z-10">
        HOME <span className="font-bold">DECOR</span>
      </h1>

      <div className="absolute bottom-[-1px] left-0 w-full leading-[0]">
        <svg viewBox="0 0 1024 70" preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 70 }}>
          <path d="M0,15 C340,15 680,70 1024,55 L1024,70 L0,70 Z" fill="#EEF0F3" />
        </svg>
      </div>
    </div>

    <div className="flex-1 px-10 pt-12 pb-12 flex flex-col">
      <h2 className="text-[#162B40] text-2xl font-semibold mb-8 tracking-wide">Iniciar Sesión</h2>

      <form className="space-y-5 max-w-[480px]">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#3a4d62] text-m font-medium pl-1">Email</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            className="w-full px-5 py-3 bg-white border border-[#d1dbe5] rounded-full text-[#162B40] focus:outline-none focus:ring-2 focus:ring-[#162B40] transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#3a4d62] text-m font-medium pl-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-5 py-3 bg-white border border-[#d1dbe5] rounded-full text-[#162B40] pr-12 focus:outline-none focus:ring-2 focus:ring-[#162B40] transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#162B40] hover:opacity-80 transition-opacity"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-[#162B40] text-white py-3.5 text-lg tracking-wide rounded-full font-medium hover:bg-[#1f3b56] transition-colors shadow-md active:scale-[0.98] transform duration-150 "
          >
            Ingresar
          </button>
        </div>
      </form>
    </div>

  </div>
</main>
    );
}