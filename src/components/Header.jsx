export default function Header() {
    return (
        <div className="bg-slate-900 text-slate-300 text-sm py-2 px-4 sm:px-8 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <p className="text-xs sm:text-sm text-left">
                    📍 Manufacturing Plants: <span className="text-amber-500 font-medium">Kotkasim • Tapukara • Alwar • Ringus • Ramgarh • Faridabad • Bahadurgarh • Palwal • Govindgarh • Mundawar</span>
                </p>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm shrink-0">
                    <a href="tel:+919950711475" className="hover:text-white transition text-slate-100">📞 +91 9950711475</a>
                    <a href="https://wa.me/917820879777" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">💬 WhatsApp Us</a>
                </div>
            </div>
        </div>
    )
}