import { Minus, Plus } from './icons'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
export function ProductCard({product,onOpen}:{product:Product;onOpen:(p:Product)=>void}){
 const {lines,add,setQuantity}=useCart();const line=lines.find(l=>l.product.id===product.id)
 return <article className="product-card"><button className="product-image" onClick={()=>onOpen(product)}><img src={product.image} alt=""/><span>10 MINS</span></button><button className="product-name" onClick={()=>onOpen(product)}>{product.name}</button><p className="weight">{product.weight}</p><div className="price-row"><b>₹{product.price}</b><del>₹{product.mrp}</del></div>{line?<div className="stepper"><button onClick={()=>setQuantity(product.id,line.quantity-1)}><Minus size={14}/></button><b>{line.quantity}</b><button onClick={()=>add(product)}><Plus size={14}/></button></div>:<button className="add-btn" onClick={()=>add(product)}>ADD <Plus size={14}/></button>}</article>
}
