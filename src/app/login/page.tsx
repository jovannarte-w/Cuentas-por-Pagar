"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        // For registration, we'll just use login with demo data for now
        await login(formData.email, formData.password);
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-lg overflow-hidden flex flex-col">
        <CardHeader className="text-center bg-white text-slate-900 p-8 space-y-3 border-b border-slate-200">
          <div className="flex justify-center mb-2">
            <img
              src="/logo-cenvalle.png"
              alt="Cenvalle"
              className="h-20 object-contain"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))' }}
            />
          </div>
          <div>
            <CardTitle className="text-blue-900 text-2xl font-bold">Cuentas por Pagar</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1">
          {error && (
            <div className="mb-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {isLogin && (
                <p className="text-xs text-slate-600 mt-1">
                  Prueba: auxiliar@cenvalle.com
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Contraseña
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {isLogin && (
                <p className="text-xs text-slate-600 mt-1">
                  Contraseña de prueba: 123456
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-semibold"
            >
              {loading ? (
                <Loader className="size-4 animate-spin" />
              ) : isLogin ? (
                "Iniciar sesión"
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600 mb-3">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="w-full border-slate-200 hover:bg-slate-50"
            >
              {isLogin ? "Crear cuenta" : "Volver al login"}
            </Button>
          </div>

          {isLogin && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                Usuarios de demostración
              </p>
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <p className="font-semibold text-slate-700">👨‍💼 Administrador</p>
                  <p>admin@cenvalle.com / 123456</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">👤 Auxiliar</p>
                  <p>auxiliar@cenvalle.com / 123456</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">🎯 Presidente</p>
                  <p>presidente@cenvalle.com / 123456</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">👁️ Consulta</p>
                  <p>consulta@cenvalle.com / 123456</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        Elaborado por <span className="font-semibold text-slate-700">Jovanna Arteaga</span>
      </div>
    </div>
  );
}
