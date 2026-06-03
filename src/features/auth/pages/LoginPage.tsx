import { Eye, EyeOff } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail } from "../services/authService";



export function LoginPage() {
   /* const {
        email, setEmail,
        password, setPassword,
        showPassword, togglePassword,
        handleSubmit,
        isLoading,
        errorMsg,
    } = useAuth();
*/
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();

        setErrorMsg("");
        setIsLoading(true);

        try {
            await loginWithEmail(email.trim(), password);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setErrorMsg("Correo o contraseña incorrectos.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
    <main className="min-h-screen bg-[#EEF0F3]">
        <div className="flex min-h-screen w-full flex-col bg-[#EEF0F3]">
        <div
            className="relative flex items-center justify-center bg-[#162B40]"
            style={{ minHeight: 310, paddingTop: 40, paddingBottom: 0 }}
        >
            <h1 className="z-10 text-6xl font-extralight uppercase tracking-[3px] text-white">
            HOME <span className="font-bold">DECOR</span>
            </h1>

            <div className="absolute bottom-[-1px] left-0 w-full leading-[0]">
            <svg
                viewBox="0 0 1024 70"
                preserveAspectRatio="none"
                style={{ display: "block", width: "100%", height: 70 }}
            >
                <path
                d="M0,15 C340,15 680,70 1024,55 L1024,70 L0,70 Z"
                fill="#EEF0F3"
                />
            </svg>
            </div>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-12 pt-12 sm:px-10">
            <div className="mx-auto w-full max-w-[480px]">
            <h2 className="mb-8 text-2xl font-semibold tracking-wide text-[#162B40]">
                Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-base font-medium text-[#3a4d62]">
                    Email
                </label>

                <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-full border border-[#d1dbe5] bg-white px-5 py-3 text-[#162B40] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#162B40]"
                    required
                />
                </div>

                <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-base font-medium text-[#3a4d62]">
                    Contraseña
                </label>

                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-full border border-[#d1dbe5] bg-white px-5 py-3 pr-12 text-[#162B40] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#162B40]"
                    required
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#162B40] transition-opacity hover:opacity-80"
                    >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                </div>

                {errorMsg && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {errorMsg}
                </p>
                )}

                <div className="mt-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full transform rounded-full bg-[#162B40] py-3.5 text-lg font-medium tracking-wide text-white shadow-md transition-colors duration-150 hover:bg-[#1f3b56] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Ingresando..." : "Ingresar"}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </main>
    );
}