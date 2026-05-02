import { useState } from "react"

export function OrderForm() {
  const [observacao, setObservacao] = useState("")
  const [tipo, setTipo] = useState("RETIRADA")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const novoPedido = {
      tipo,
      observacao,
      itens: [
        { id: 1, nome: "Pizza Calabresa", quantidade: 1 }
      ]
    }

    console.log("Pedido enviado:", novoPedido)

    // Aqui depois você conecta com API

    setObservacao("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        maxWidth: "400px"
      }}
    >
      <h3>Novo Pedido</h3>

      {/* TIPO */}
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="RETIRADA">Retirada</option>
        <option value="DELIVERY">Delivery</option>
      </select>

      {/* OBSERVAÇÃO */}
      <textarea
        placeholder="Observações (ex: tirar cebola)"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        style={{
          width: "100%",
          height: "80px",
          marginBottom: "10px"
        }}
      />

      <button type="submit">Criar Pedido</button>
    </form>
  )
}