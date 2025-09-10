// Example utilities to transform expense data into chart-ready series

export function monthlyTotals(expenses = []){
  // expects each expense: { amount, date: ISO, category }
  const map = new Map()
  for(const e of expenses){
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    map.set(key, (map.get(key)||0) + Number(e.amount||0))
  }
  return Array.from(map.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([name, value])=>({ name, value }))
}

export function byCategory(expenses = []){
  const map = new Map()
  for(const e of expenses){
    const key = e.category || 'Uncategorized'
    map.set(key, (map.get(key)||0) + Number(e.amount||0))
  }
  return Array.from(map.entries()).map(([name, value])=>({ name, value }))
}
