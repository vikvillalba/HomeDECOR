import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Pencil, Trash2 } from "lucide-react";


import { OrderProductCard } from "../components/OrderProductCard";
import type { Order } from "../types/order.types";
import { getOrderDocumentById } from "../repositories/orderRepository";


function formatDateCreated(order: Order) {
    if (!order.createdAt) return "";

    return order.createdAt.toDate().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatDateDeliver(order: Order) {
    if (!order.createdAt) return "";

    return order.deliveryDate.toDate().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


export function QuoteDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function fetchQuote() {
            try {
                setIsLoading(true);
                if (id) {
                    const data = await getOrderDocumentById(id);
                    setOrder(data);
                }

            } catch (error) {
                console.error("Error al cargar la cotización", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchQuote();
    }, [id]);


    if (isLoading) {
        return <div className="p-10 text-center text-[#162B40]">Cargando detalles...</div>;
    }


    if (!order) {
        return <div className="p-10 text-center text-red-500">Cotización no encontrada.</div>;
    }

    return (
        <main className="min-h-dvh bg-[#EEF0F3]">
            <section className="relative mx-auto w-full max-w-[834px] bg-[#EEF0F3] px-10 pt-10">
                <header>
                    <h1 className="text-4xl font-light tracking-wide text-[#162B40]">
                        HOME <span className="font-bold">DECOR</span>
                    </h1>
                </header>


                <div className="mt-5 flex items-center justify-between pb-4">
                    <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center gap-1 text-[#162B40] hover:text-[#162B40] transition"
                    >
                        <ChevronLeft size={25} />
                    </button>
                    <p className="text-xl font-medium text-[#162B40]">
                        Detalles del pedido
                    </p>
                    <div className="flex gap-3">
                        <button className="rounded-full p-3 text-[#FFFFFF] bg-[#405F7E] shadow-sm hover:bg-[#162B40]">
                            <Download size={20} />
                        </button>
                        <button className="rounded-full bg-[#405F7E] p-3 text-[#FFFFFF] shadow-sm hover:bg-[#162B40]">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>


                <article className="mt-3 rounded-2xl bg-[#162B40] p-4 shadow-sm">
                    <h3 className="text-2xl font-medium text-[#FFFFFF] text-center">{order.clientName}</h3>
                    <p className="mt-1 text-[#FFFFFF] font-regular text-center">{order.clientPhone}</p>
                    <p className="mt-1 text-[#FFFFFF] text-center">{order.clientAddress}</p>
                    <p className="text-[#FFFFFF] font-regular text-center">{formatDateCreated(order)}</p>
                </article>

                <div className="mt-3 rounded-2xl bg-[rgba(38, 163, 80, 0.24)] p-4 shadow-sm">
                     <p className="text-[#FFFFFF] font-regular text-center">Fecha de entrega: {formatDateDeliver(order)}</p>
                    <button className="rounded-full bg-[#8AB79D] p-3 text-[#162B40] shadow-sm hover:bg-[#162B40]">
                        <Pencil size={20} />
                    </button>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    {order.products && order.products.length > 0 ? (
                        order.products.map((product, index) => (
                            <OrderProductCard key={index} product={product} />
                        ))
                    ) : (
                        <p className="text-[#466582] italic">Este pedido no tiene productos agregados.</p>
                    )}

                </div>


                <div className="mt-3 p-4 w-full flex flex-col items-center">

                    <div className="w-full max-w-sm flex flex-col gap-3 text-[23px] text-[#162B40]">

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Subtotal
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold italic">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(order.subtotal)}
                            </span>
                        </div>

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Descuento
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold">
                                {order.discountPercent}%
                            </span>
                        </div>

                        <div className="flex w-full items-center rounded-2xl bg-[#D8DEE7] py-2.5 font-bold text-[24px]">
                            <span className="w-1/2 text-right pr-4">
                                Total
                            </span>
                            <span className="w-1/2 text-left pl-4 text-[#0F963C]">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(order.total)}
                            </span>
                        </div>

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Anticipo
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(order.advancePayment)}
                            </span>
                        </div>

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Resto
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(order.remainingPayment)}
                            </span>
                        </div>

                    </div>


                    <button className="rounded-full bg-[#162B40] p-4 text-white text-[20px] font-normal shadow-sm hover:bg-[#203d5b] transition-colors mt-7 w-full">
                        Marcar como Recibido
                    </button>

                </div>

            </section>
        </main>
    );
}