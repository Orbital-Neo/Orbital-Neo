import { useEffect, useState } from "react"

type Props = {
  criadoEm: string
}

export function TimeIndicator({ criadoEm }: Props) {
  const [tempo, setTempo] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const criado = new Date(criadoEm).getTime()
      const agora = new Date().getTime()

      const diffMin = Math.floor((agora - criado) / 1000 / 60)
      setTempo(diffMin)
    }, 1000)

    return () => clearInterval(interval)
  }, [criadoEm])

  const cor =
    tempo < 10 ? "green" : tempo < 20 ? "orange" : "red"

  return (
    <span style={{ color: cor, fontWeight: "bold" }}>
      {tempo} min
    </span>
  )
}