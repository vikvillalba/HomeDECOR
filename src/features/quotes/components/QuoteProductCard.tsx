import type { QuoteProduct } from "../types/quote.types"

type QuoteProductProps = {
    product: QuoteProduct
}

export function QuoteProductCard({product} : QuoteProductProps){
return (
    <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-w-2xl border border-gray-100">
      
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#162B40] tracking-tight">
          {product.area}
        </h2>
        
        <div className="text-[18px] font-normal text-[#466582] max-w-md">
          <p className="font-semibold">{product.productName}</p>
          <p>{product.model}</p>
          <p>{product.height} X {product.width}</p>
          <p>{product.description}</p>
          
        </div>
        
        <p className="mt-2 text-3xl font-bold text-[#162B40]">
          $ {new Intl.NumberFormat("es-MX").format(product.unitPrice)}
        </p>
      </div>

      <div className="pr-4">
        <span className="text-3xl font-bold text-[#162B40] whitespace-nowrap">
          x {product.quantity}
        </span>
      </div>

    </div>
  );
}