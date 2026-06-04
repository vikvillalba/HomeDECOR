type OrderStatus = "pending" | "received" | "delayed";

function OrderStatusBatch({ tipo }: { tipo: OrderStatus }) {
    return (
        <div className="mt-4"> 
            {tipo === "pending" && (
                <div className="rounded-full bg-[#C8EBD4] w-24 flex items-center justify-center">
                     <p className="my-1 text-sm font-medium text-[#2B5B3C]">Pendiente</p>
                </div>
            )}

            {tipo === "received" && (
                <div className="rounded-full bg-[#E5E5E5] w-24 flex items-center justify-center">
                     <p className="my-1 text-sm font-medium text-[#555555]">Recibido</p>
                </div>
            )}

            {tipo === "delayed" && (
                <div className="rounded-full bg-[#E5E5E5] w-24 flex items-center justify-center">
                     <p className="my-1 text-sm font-medium text-[#555555]">Atrasado</p>
                </div>
            )}
        </div>
    );
}

export function OrderCard() {
    const estadoPedido: OrderStatus = "pending"; 

    return (
        <main className="rounded-2xl bg-white p-6 shadow-[0_3px_5px_rgba(22,43,64,0.22)] max-w-sm">
            <h3 className="text-2xl font-bold text-[#162B40]">Nombre cliente</h3>
            <p className="mt-1 text-lg font-medium text-[#466582]">6443445678</p>
            <p className="mt-1 text-lg font-medium text-[#466582]">calle ejemplo</p>

            <p className="mt-1 text-xs font-medium text-[#466582]">Fecha de pedido</p>
            <p className="text-lg font-medium text-[#466582]">11/mayo/26</p>

            <p className="mt-1 text-xs font-medium text-[#466582]">Fecha de entrega</p>
            <p className="text-lg font-medium text-[#466582]">21/mayo/26</p>

  
            <OrderStatusBatch tipo={estadoPedido}/>
        </main>
    );
}