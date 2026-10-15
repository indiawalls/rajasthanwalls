export default function Loading() {
    return (
        <main
            className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
            aria-busy="true"
            aria-live="polite"
        >
            <p className="text-lg font-medium text-slate-600">Products loading...</p>
        </main>
    );
}
