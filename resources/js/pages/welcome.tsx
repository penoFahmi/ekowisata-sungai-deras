import React, { useState, useEffect } from 'react';

// --- Helper: Type Definitions ---
type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

// --- Helper: Custom Hook for Countdown Logic ---
const useCountdown = (targetDate: string): TimeLeft => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown: number): TimeLeft => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
};

// --- UI Components (Simulating shadcn/ui with Tailwind CSS) ---

// Card Component
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`} {...props} />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 pt-0 ${className}`} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
);

// Button Component
const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ${className}`}
        {...props}
    />
);

// Input Component
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);


// --- Main Page Component ---

export default function WelcomePage() {
    // IMPORTANT: Atur tanggal peluncuranmu di sini!
    const LAUNCH_DATE = "2025-10-10T00:00:00";
    const timeLeft = useCountdown(LAUNCH_DATE);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Untuk saat ini, kita tampilkan alert. Nanti bisa dihubungkan ke backend.
        alert('Terima kasih! Kami akan memberitahu Anda saat situs kami diluncurkan.');
    }

    return (
        <div className="relative min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image & Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://placehold.co/1920x1080/1a2c1e/FFFFFF?text=Pemandangan+Desa+Sungai+Deras')" }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <main className="relative z-10 w-full max-w-lg">
                <Card className="bg-card/80 backdrop-blur-lg border-white/10 text-white">
                    <CardHeader className="items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mb-4"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">Sesuatu yang Indah Sedang Disiapkan</CardTitle>
                        <CardDescription className="text-gray-300 pt-2">
                            Platform digital untuk memetakan pesona alam, wisata, dan potensi UMKM Desa Sungai Deras akan segera hadir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Countdown Timer */}
                        <div className="flex justify-center gap-4 my-6">
                            <div className="text-center p-3 rounded-lg bg-white/10 min-w-[70px]">
                                <p className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</p>
                                <p className="text-xs uppercase text-green-300">Hari</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/10 min-w-[70px]">
                                <p className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
                                <p className="text-xs uppercase text-green-300">Jam</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/10 min-w-[70px]">
                                <p className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
                                <p className="text-xs uppercase text-green-300">Menit</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/10 min-w-[70px]">
                                <p className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</p>
                                <p className="text-xs uppercase text-green-300">Detik</p>
                            </div>
                        </div>

                        {/* Subscription Form */}
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                           <label htmlFor="email" className="text-center text-sm text-gray-300">
                                Jadilah yang pertama tahu saat kami resmi diluncurkan!
                           </label>
                           <div className="flex gap-2">
                             <Input id="email" type="email" placeholder="Alamat email Anda..." required className="bg-white/5 border-white/20 placeholder:text-gray-400 focus-visible:ring-green-400" />
                             <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">Beritahu Saya</Button>
                           </div>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                         <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Ekowisata Desa Sungai Deras</p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
