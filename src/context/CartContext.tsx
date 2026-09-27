import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../types'

type CartLine = { product: Product; quantity: number }
type CartContextType = { lines: CartLine[]; count: number; subtotal: number; add: (p:Product)=>void; remove:(id:string)=>void; setQuantity:(id:string, n:number)=>void }
const CartContext = createContext<CartContextType | null>(null)
export function CartProvider({children}:{children:ReactNode}) {
 const [lines,setLines]=useState<CartLine[]>([])
 const add=(product:Product)=>setLines(x=>x.some(l=>l.product.id===product.id)?x.map(l=>l.product.id===product.id?{...l,quantity:l.quantity+1}:l):[...x,{product,quantity:1}])
 const setQuantity=(id:string,n:number)=>setLines(x=>n<1?x.filter(l=>l.product.id!==id):x.map(l=>l.product.id===id?{...l,quantity:n}:l))
 const remove=(id:string)=>setLines(x=>x.filter(l=>l.product.id!==id))
 const value=useMemo(()=>({lines,count:lines.reduce((a,l)=>a+l.quantity,0),subtotal:lines.reduce((a,l)=>a+l.product.price*l.quantity,0),add,remove,setQuantity}),[lines])
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export const useCart=()=>{const c=useContext(CartContext);if(!c)throw new Error('CartProvider missing');return c}
