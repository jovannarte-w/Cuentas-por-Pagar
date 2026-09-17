# 📱 Cuentas por Pagar (CxP) — Versión Local

Esta es la versión **de producción lista para visualizar** en tu computador.

## 🚀 Cómo ejecutar

### Opción 1: Servidor de Producción (Recomendado)

```bash
cd "C:\Users\Cenvalle\Documents\Cuentas Por Pagar Cenvalle\app-cxp"
npm run start
```

Luego abre tu navegador en: **http://localhost:3000**

### Opción 2: Servidor de Desarrollo (Con recarga en vivo)

```bash
cd "C:\Users\Cenvalle\Documents\Cuentas Por Pagar Cenvalle\app-cxp"
npm run dev
```

Luego abre tu navegador en: **http://localhost:3000**

---

## 📊 Qué hay en esta versión

✅ **420 facturas reales** de septiembre 2026 (migradas del Excel)
✅ **115 proveedores** activos
✅ **104 pagos registrados** (abonos del Excel)
✅ **14 correcciones de pago** confirmadas manualmente
✅ **3 exclusiones** (AHORRO VOLUNTARIO)

---

## 🔍 Características principales

### Dashboard
- KPIs en vivo: Total por pagar, Vencido, Por vencer 7 días, Sin fecha
- Tabla de deuda consolidada por proveedor
- Ordenada de mayor a menor saldo pendiente

### Programación de Pagos
- **🔎 Búsqueda en tiempo real** de facturas por:
  - Nombre del proveedor
  - Número de factura
- **📊 Auto-llenado** del monto con saldo pendiente
- **✋ Validación** que el monto no supere el saldo
- **🔄 Cambiar factura** sin cerrar el formulario

### Flujo de Aprobación
- **Auxiliar de Tesorería**: Programa pagos
- **Presidente**: Aprueba o rechaza (con observaciones)
- **Rol de Consulta**: Solo visualización

### Payos Registrados
- Tabla de 104 pagos reales del Excel
- Información: proveedor, factura, monto, fecha, método, cuenta, referencia

### Proveedores
- Listado con deuda consolidada
- NIT, condiciones de pago
- Total facturado, pagado, saldo pendiente

---

## 🛠️ Tecnología

- **Next.js 16.3.4** con App Router
- **React 19.2 canary** con Server Components
- **Supabase SSR** (listo para conectar)
- **shadcn/ui v4.21** (componentes accesibles)
- **Tailwind CSS v4** con colores oklch
- **React Hook Form + Zod** (validación)
- **TypeScript** (type-safe)

---

## 📁 Estructura del proyecto

```
app-cxp/
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/      # KPIs y tabla de proveedores
│   │   │   ├── facturas/       # Listado de facturas pendientes
│   │   │   ├── pagos/          # Programación y registro de pagos
│   │   │   ├── proveedores/    # Deuda consolidada por proveedor
│   │   │   ├── tesoreria/      # Saldos de cuentas bancarias
│   │   │   └── reportes/       # Reportes (en desarrollo)
│   │   └── page.tsx            # Redirect a /dashboard
│   ├── components/
│   │   ├── pagos/
│   │   │   ├── programacion-form.tsx   # Búsqueda y filtro ✨
│   │   │   ├── aprobar-dialog.tsx      # Diálogo de aprobación
│   │   │   └── rechazar-dialog.tsx     # Diálogo de rechazo
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       ├── datos.ts            # Fuente central de datos
│       ├── rol-demo-context.ts # Control de roles (demo)
│       └── datos-reales/
│           ├── facturas.ts     # 420 facturas
│           ├── proveedores.ts  # 115 proveedores
│           ├── pagos.ts        # 104 pagos registrados
│           └── correcciones.ts # 14 correcciones + 3 exclusiones
├── supabase/
│   ├── launch.json             # Configuración del servidor dev
│   └── seed/                   # Scripts SQL de seeding (listos)
└── .claude/
    └── launch.json             # Configuración de Claude Code
```

---

## 🔐 Roles de Demo

Cambiar el rol desde el selector superior derecho (👤 Administrador):

1. **Administrador** (Default)
   - Acceso total
   - Puede programar y ejecutar pagos
   - Puede aprobar/rechazar

2. **Presidente**
   - Solo aprueba o rechaza pagos
   - Puede dejar observaciones

3. **Auxiliar de Tesorería**
   - Programa y ejecuta pagos
   - No puede aprobar

4. **Solo Consulta**
   - Visualización de solo lectura
   - Sin acciones disponibles

---

## 📊 Datos Reales

Los datos están **sincronizados con el Excel original** de septiembre 2026:

- Todas las facturas tienen vencimiento documentado
- Todos los pagos tienen observación del método usado (texto libre del Excel)
- 14 correcciones de pago confirmadas manualmente
- 3 exclusiones de filas que no son cuentas por pagar

---

## 🔄 Próximos Pasos (No requiere acción ahora)

Cuando estés listo para publicar a producción:

1. **Conectar Supabase** — Base de datos PostgreSQL
2. **Generar seed SQL** — Migrar 420 facturas, 115 proveedores, 104 pagos
3. **Configurar RLS** — Row Level Security por rol
4. **Deploy a Vercel** — Publicación productiva

---

## 📝 Notas

- Los cambios que hagas en la interfaz (aprobar, rechazar, ejecutar) están **solo en memoria**
- Al refrescar la página, todo vuelve al estado original
- Los datos no se guardan persistentemente hasta que conectes Supabase
- Esta es la versión de **desarrollo/prueba** — no usar en producción

---

## 💬 Contacto

Cenvalle S.A.S. — Centro de Endoscopia del Valle
Cuentas por Pagar | Sistema de Gestión

**Versión:** 0.1.0 (Beta)  
**Fecha de Build:** 2026-09-10  
**Estado:** ✅ Listo para visualizar localmente
