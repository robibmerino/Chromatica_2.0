# Plantillas de email para Supabase (Chromatica)

Copia y pega cada bloque en **Supabase → Authentication → Email Templates** en el campo **Body** (vista Source). Ajusta el **Subject** como se indica en cada sección.

Usan estilos inline para compatibilidad con clientes de correo. Colores alineados con Chromatica (indigo/púrpura).

---

## 1. Confirm sign up (confirmar registro)

**Subject sugerido:** `Confirma tu cuenta en Chromatica`

```html
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
  <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px;">Chromatica</p>
  <h1 style="font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 16px;">Confirma tu correo</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
    Hola, gracias por registrarte. Pulsa el botón para activar tu cuenta y empezar a guardar tus paletas en la nube.
  </p>
  <p style="margin-bottom: 24px;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 16px;">Confirmar mi cuenta</a>
  </p>
  <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
    Si no has creado una cuenta en Chromatica, puedes ignorar este correo.
  </p>
  <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
    Chromatica · Creación de paletas de color
  </p>
</div>
```

---

## 2. Reset password (restablecer contraseña)

**Subject sugerido:** `Restablece tu contraseña de Chromatica`

```html
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
  <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px;">Chromatica</p>
  <h1 style="font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 16px;">Restablecer contraseña</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
    Has solicitado un enlace para crear una nueva contraseña. Pulsa el botón para abrir Chromatica y elegirla.
  </p>
  <p style="margin-bottom: 24px;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 16px;">Crear nueva contraseña</a>
  </p>
  <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
    Si no has pedido restablecer la contraseña, ignora este correo. Tu cuenta no cambiará.
  </p>
  <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
    Chromatica · Creación de paletas de color
  </p>
</div>
```

---

## 3. Magic link (enlace mágico, si lo usas)

**Subject sugerido:** `Tu enlace para entrar en Chromatica`

```html
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
  <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px;">Chromatica</p>
  <h1 style="font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 16px;">Entra en Chromatica</h1>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
    Pulsa el botón para iniciar sesión sin contraseña. El enlace es válido durante un tiempo limitado.
  </p>
  <p style="margin-bottom: 24px;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 16px;">Iniciar sesión</a>
  </p>
  <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
    Chromatica · Creación de paletas de color
  </p>
</div>
```

---

## Cómo aplicarlas

1. Entra en tu proyecto en [Supabase](https://supabase.com/dashboard).
2. **Authentication** → **Email Templates**.
3. Elige la plantilla (Confirm sign up, Reset password, etc.).
4. Pega el HTML en el campo **Body** (pestaña **Source**).
5. Cambia el **Subject** por el texto sugerido arriba si quieres.
6. Guarda.

El botón usa el color indigo (`#4f46e5`) de la app. Si quieres otro tono, sustituye ese valor en `background: #4f46e5`.
