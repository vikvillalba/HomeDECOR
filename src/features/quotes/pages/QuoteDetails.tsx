import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Pencil, Trash2 } from "lucide-react";
import type { Quote } from "../types/quote.types";
import { QuoteProductCard } from "../components/QuoteProductCard";
import { getQuoteById } from "../services/quoteService";


function formatDate(quote: Quote) {
    if (!quote.createdAt) return "";

    return quote.createdAt.toDate().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function QuoteDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function fetchQuote() {
            try {
                setIsLoading(true);
                if (id) {
                    const data = await getQuoteById(id);
                    setQuote(data);
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


    if (!quote) {
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
                        onClick={() => navigate("/quotes")}
                        className="flex items-center gap-1 text-[#162B40] hover:text-[#162B40] transition"
                    >
                        <ChevronLeft size={25} />
                    </button>
                    <p className="text-xl font-medium text-[#162B40]">
                        Detalles de la Cotización
                    </p>
                    <div className="flex gap-3">
                        <button className="rounded-full p-3 text-[#FFFFFF] bg-[#405F7E] shadow-sm hover:bg-[#162B40]">
                            <Download size={20} />
                        </button>
                        <button className="rounded-full bg-[#405F7E] p-3 text-[#FFFFFF] shadow-sm hover:bg-[#162B40]">
                            <Pencil size={20} />
                        </button>
                        <button className="rounded-full bg-[#405F7E] p-3 text-[#FFFFFF] shadow-sm hover:bg-[#162B40]">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>


                <article className="mt-3 rounded-2xl bg-[#162B40] p-4 shadow-sm ">
                    <h3 className="text-2xl font-medium text-[#FFFFFF] text-center">{quote.clientName}</h3>
                    <p className="mt-1 text-[#FFFFFF] font-regular text-center">{quote.clientPhone}</p>
                    <p className="mt-1 text-[#FFFFFF] text-center">{quote.clientAddress}</p>
                    <p className="text-[#FFFFFF] font-regular text-center">{formatDate(quote)}</p>
                </article>


                <div className="mt-4 flex flex-col gap-3">
                    {quote.products && quote.products.length > 0 ? (
                        quote.products.map((product, index) => (
                            <QuoteProductCard key={index} product={product} />
                        ))
                    ) : (
                        <p className="text-[#466582] italic">Esta cotización no tiene productos agregados.</p>
                    )}

                </div>


                <div className="mt-3 p-4 w-full flex flex-col items-center">

                    <div className="w-full max-w-sm flex flex-col gap-3 text-[23px] text-[#162B40]">

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Subtotal
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold italic">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(quote.subtotal)}
                            </span>
                        </div>

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Descuento
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold">
                                {quote.discountPercent}%
                            </span>
                        </div>

                        <div className="flex w-full items-center rounded-2xl bg-[#D8DEE7] py-2.5 font-bold text-[24px]">
                            <span className="w-1/2 text-right pr-4">
                                Total
                            </span>
                            <span className="w-1/2 text-left pl-4 text-[#0F963C]">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(quote.total)}
                            </span>
                        </div>

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Anticipo
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(quote.advancePayment)}
                            </span>
                        </div>

                        <div className="flex w-full items-center">
                            <span className="w-1/2 text-right pr-4 font-medium">
                                Resto
                            </span>
                            <span className="w-1/2 text-left pl-4 font-bold">
                                ${new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(quote.remainingPayment)}
                            </span>
                        </div>

                    </div>


                    <button className="rounded-full bg-[#162B40] p-4 text-white text-[20px] font-normal shadow-sm hover:bg-[#203d5b] transition-colors mt-7 w-full">
                        Pedir Cotización
                    </button>

                </div>
                
            </section>
        </main>
    );
}