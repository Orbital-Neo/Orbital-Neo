import type { Order } from "../types/order"
import { Badge } from "./Badge"
import { TimeIndicator } from "./TimeIndicator"

type Props = {
  pedido: Order
}

export function OrderCard({ pedido }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "10px",
        background: "#fff",
        width: "100%",
        maxWidth: "400px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong style={{ fontSize: "16px" }}>
          Pedido #{pedido.id}
        </strong>
        <Badge tipo={pedido.tipo} />
      </div>

      <div style={{ marginTop: "8px", fontSize: "14px" }}>
        {pedido.itens.map((item) => (
          <div key={item.id}>
            {item.quantidade}x {item.nome}
          </div>
        ))}
      </div>

      {pedido.observacao && (
        <div
          style={{
            marginTop: "8px",
            fontStyle: "italic",
            color: "#555",
            wordBreak: "break-word"
          }}
        >
          Obs: {pedido.observacao}
        </div>
      )}

      <div style={{ marginTop: "10px", fontSize: "13px" }}>
        Tempo: <TimeIndicator criadoEm={pedido.criadoEm} />
      </div>
    </div>
  )
}