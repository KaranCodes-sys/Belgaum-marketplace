import type { ReactNode } from 'react'
type P={size?:number}
const icon=(glyph:ReactNode)=>({size=16}:P)=><span style={{fontSize:size,lineHeight:1,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{glyph}</span>
export const Minus=icon('−'),Plus=icon('+'),MapPin=icon('⌖'),Search=icon('⌕'),ShoppingBag=icon('▣'),ArrowRight=icon('→'),ArrowLeft=icon('←'),ChevronRight=icon('›'),Home=icon('⌂'),PackageCheck=icon('✓'),SlidersHorizontal=icon('☷'),Truck=icon('▰'),Trash2=icon('×'),Check=icon('✓'),X=icon('×')
