export const savingGoal = {
  title: 'Home Server',
  description: 'Building a home server for hosting projects and services',
  target: 200,
  currency: '€'
}

export const topDonators = [
  { 
    name: 'Lunander', 
    amount: 10, 
    currency: '€', 
    date: '2025-02-04',
    avatar: 'https://media.tenor.com/SgDoRApzncYAAAAe/putting-on-my-sunglasses-ken.png'
  }
]

// Функция для подсчета общей суммы донатов
export const calculateTotalDonations = () => {
  return topDonators.reduce((total, donator) => {
    // Конвертируем все в евро (упрощенно, можно добавить курсы)
    const amount = donator.currency === '$' ? donator.amount * 0.92 : donator.amount
    return total + amount
  }, 0)
}

export const donationMethods = [
  {
    name: 'PayPal',
    type: 'paypal',
    address: 'moki912011@gmail.com',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    name: 'Bank Transfer (IBAN)',
    type: 'bank',
    address: 'EE762200221076858379',
    recipientName: 'Matvei Serdjuk',
    color: 'from-slate-400 to-slate-600',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30'
  },
  {
    name: 'USDT (TRC20)',
    type: 'trc20',
    address: 'TEPSaGZBr47DJeAecxoVeu1L2c7Zp1BcdL',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  }
]
