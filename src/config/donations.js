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
    address: 'Click Donate to support via PayPal',
    paypalLink: 'https://www.paypal.com/paypalme/sqrilizz',
    hideAddress: true,
    icon: 'https://cdn.simpleicons.org/paypal/ffffff',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    name: 'Buy Me a Coffee',
    type: 'buymeacoffee',
    address: 'Support me with a coffee',
    buymeacoffeeLink: 'https://buymeacoffee.com/sqrilizz',
    hideAddress: true,
    icon: 'https://cdn.simpleicons.org/buymeacoffee/ffffff',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  },
  {
    name: 'USDT (TRC20)',
    type: 'trc20',
    address: 'TEPSaGZBr47DJeAecxoVeu1L2c7Zp1BcdL',
    icon: 'https://cdn.simpleicons.org/tether/ffffff',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  }
]
