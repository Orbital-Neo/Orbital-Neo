import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('Limpando dados anteriores...')
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.menuItem.deleteMany()
  await db.user.deleteMany()

  console.log('Populando pizzas...')
  const pizzas = [
    { name: 'Calabresa',           prices: { Pequena: 35, Media: 45, Grande: 55, Familia: 65 } },
    { name: 'Portuguesa',          prices: { Pequena: 37, Media: 47, Grande: 57, Familia: 67 } },
    { name: 'Frango com Catupiry', prices: { Pequena: 38, Media: 48, Grande: 58, Familia: 68 } },
    { name: 'Quatro Queijos',      prices: { Pequena: 40, Media: 50, Grande: 60, Familia: 70 } },
    { name: 'Margherita',          prices: { Pequena: 35, Media: 45, Grande: 55, Familia: 65 } },
    { name: 'Pepperoni',           prices: { Pequena: 42, Media: 52, Grande: 62, Familia: 72 } },
  ]

  for (const pizza of pizzas) {
    for (const [size, price] of Object.entries(pizza.prices)) {
      await db.menuItem.create({
        data: { name: pizza.name, category: 'pizza', size, price, available: true },
      })
    }
  }

  console.log('Populando bebidas...')
  const bebidas = [
    { name: 'Refrigerante', size: '350ml', price: 5  },
    { name: 'Refrigerante', size: '600ml', price: 8  },
    { name: 'Refrigerante', size: '2L',    price: 12 },
    { name: 'Suco',         size: '300ml', price: 7  },
    { name: 'Agua',         size: '500ml', price: 4  },
  ]

  for (const bebida of bebidas) {
    await db.menuItem.create({
      data: { name: bebida.name, category: 'bebida', size: bebida.size, price: bebida.price, available: true },
    })
  }

  console.log('Criando operador padrão...')
  const hashedPassword = await bcrypt.hash('orbital123', 10)
  await db.user.create({
    data: {
      name: 'Operador',
      phone: '00000000000',
      email: 'operador@orbital.com',
      password: hashedPassword,
      role: 'operador',
    },
  })

  console.log('─────────────────────────────────')
  console.log('Seed concluído!')
  console.log('Pizzas: ' + (pizzas.length * 4) + ' itens')
  console.log('Bebidas: ' + bebidas.length + ' itens')
  console.log('Operador: operador@orbital.com / orbital123')
  console.log('─────────────────────────────────')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => await db.$disconnect())