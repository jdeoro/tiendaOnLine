export const paymentAlerts = {
  success: {
    title: "✅ Pago aprobado",
    getMessage: (params: Record<string, string>) =>
      `ID: ${params.payment_id ?? "desconocido"}\nEstado: ${params.collection_status ?? "sin datos"}`
  },
  failure: {
    title: "❌ Pago rechazado",
    message: "Podés intentar nuevamente"
  },
  pending: {
    title: "⏳ Pago pendiente",
    message: "Te notificaremos cuando se confirme"
  }
} as const