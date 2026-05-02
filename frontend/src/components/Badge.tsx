type BadgeProps = {
  tipo: "delivery" | "retirada"
}

export function Badge({ tipo }: BadgeProps) {
  const isDelivery = tipo === "delivery"

  return (
    <span
      style={{
        backgroundColor: isDelivery ? "#2563eb" : "#16a34a",
        color: "white",
        padding: "4px 8px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "bold"
      }}
    >
      {isDelivery ? "Delivery" : "Retirada"}
    </span>
  )
}