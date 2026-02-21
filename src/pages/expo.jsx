import { useState, useRef, useEffect } from "react";
import { apiService } from "../lib/api.js";

// Adjust these to position name and number on the pass image (percent of width/height, 0–1)
const PASS_TEXT = {
    name:  { x: 0.88, y: 0.71, fontSize: 26, font: "700 30px Poppins, sans-serif" },
    number: { x: 0.88, y: 0.785, fontSize: 20, font: "500 24px Poppins, sans-serif" },
};

const PASS_IMAGE_SRC = "/expo/pass.jpeg";

// Event date: 28 Feb 2026
const EVENT_DATE = new Date(2026, 1, 28); // Feb = month 1

const getDaysLeft = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const event = new Date(EVENT_DATE);
    event.setHours(0, 0, 0, 0);
    const diffMs = event - today;
    return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
};

// Parse "35" -> { value: 35, suffix: "" }, "10k" -> { value: 10, suffix: "k" }
const parseCountValue = (str) => {
    const match = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*(k|K|M|m)?$/);
    if (!match) return { value: 0, suffix: "" };
    return { value: parseFloat(match[1]), suffix: (match[2] || "").toLowerCase() };
};

// Ease-out cubic for smooth deceleration at the end
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

function CountUp({ valueStr, duration = 1800 }) {
    const { value: target, suffix } = parseCountValue(valueStr);
    const [display, setDisplay] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (target <= 0) return;
        const el = ref.current;
        if (!el) {
            setStarted(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) setStarted(true);
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, started]);

    useEffect(() => {
        if (!started || target <= 0) return;
        let startTime = null;
        const tick = (now) => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(t);
            setDisplay(eased * target);
            if (t < 1) requestAnimationFrame(tick);
            else setDisplay(target);
        };
        const id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, [started, target, duration]);

    const text = suffix === "k" ? `${Math.round(display)}${suffix}` : String(Math.round(display));

    return (
        <p ref={ref} className="text-2xl font-bold">
            {text}+
        </p>
    );
}

export default function Expo() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [daysLeft, setDaysLeft] = useState(getDaysLeft);
    const canvasRef = useRef(null);

    useEffect(() => {
        const update = () => setDaysLeft(getDaysLeft());
        update();
        const id = setInterval(update, 60 * 60 * 1000); // update every hour
        return () => clearInterval(id);
    }, []);

    const drawPassWithText = (canvas, ctx, img) => {
        if (!canvas || !ctx || !img) return;
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = PASS_TEXT.name.font;
        ctx.fillText(name || "—", w * PASS_TEXT.name.x, h * PASS_TEXT.name.y);
        ctx.font = PASS_TEXT.number.font;
        ctx.fillText(phone || "—", w * PASS_TEXT.number.x, h * PASS_TEXT.number.y);
    };

    useEffect(() => {
        if (!submitted || !canvasRef.current) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            drawPassWithText(canvas, ctx, img);
        };
        img.src = PASS_IMAGE_SRC;
    }, [submitted, name, phone]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        try {
            await apiService.submitExpoSubmission({ name: name.trim(), phone: phone.trim() });
        } catch (err) {
            console.warn("Expo submission save failed:", err);
        }
        setSubmitted(true);
    };

    const handleDownload = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            drawPassWithText(canvas, ctx, img);
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `expo-pass-${name.replace(/\s+/g, "-")}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }, "image/png");
        };
        img.src = PASS_IMAGE_SRC;
    };

    return (
        <>
        <div className="bg-gray-300 flex flex-col items-center justify-center">
            <div className="max-w-96 w-full h-full bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col gap-8 px-4 pt-6 pb-8" style={{background: "linear-gradient(to bottom, #ffffff 50%, #030A10 90%)"}}>
                {/* Header / branding */}
                <section className="flex flex-col items-center gap-3">
                    {/* <img src="/visitingLink-logo.png" alt="expo-logo" className="w-24 mx-auto" /> */}
                    <div className="flex items-center justify-between w-full mb-2 mt-1">
                        <p className="text-[15px] font-bold">Get you Passes Now</p>
                        <a
                    href="https://in.bookmyshow.com/events/bollywood-rang-concert-jhansi/ET00486745/ticket/CMCZ/10001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                    onClick={() => apiService.recordExpoBookMyShowClick().catch(() => {})}
                >
                    <img src="/expo/bookmyshow.png" alt="expo-logo" className="w-32 mx-auto" />
                </a>
                    </div>
                    <div className="relative w-full max-w-4xl mx-auto mt-2" style={{ paddingBottom: "120%" }}>
                        <iframe width="383" height="680" src="https://www.youtube.com/embed/hBDzAvYFrJw" title="Get Ready jhansi , EXPO is comming" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-lg"></iframe>
                    </div>
                    {/* https://www.instagram.com/reels/DVAl56eEoNg/ */}
                    <img src="/expo/logos.png" alt="expo-logo" className="w-full h-full object-cover mt-2" />
                    <img src="/expo/expo-logo.png" alt="expo-logo" className="w-60 mx-auto mt-4" />
                    <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-l from-black to-[#004DFF] mt-2 mb-0">BUNDELKHAND <br /> VENTURE SUMMIT 2026</h1>
                </section>

                <section className="flex flex-col gap-3">

                    <img src="/expo/sanfran.png" alt="expo-logo" className="w-36 mx-auto" />
                    <img src="/expo/sponsers.png" alt="expo-logo" className="w-full h-full object-cover" />

                    <div className="grid grid-cols-3 gap-4 mt-6 mb-10">
                        {[
                            {
                                Number: "35",
                                Description: "Investors"
                            },
                            {
                                Number: "50",
                                Description: "Stalls (MSMEs)"
                            },
                            {
                                Number: "10k",
                                Description: "Audience"
                            }
                        ]
                        .map((item, index) => (
                            <div key={index} className="flex flex-col items-center justify-center">
                                <CountUp valueStr={item.Number} duration={1800} />
                                <p className="text-[11px] mt-1 text-black font-medium">{item.Description}</p>
                            </div>
                        ))
                    }
                    </div>
                    <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-l from-black to-[#004DFF]">First Time In <br /> Bundelkhand jhansi</h1>
                    <p className="text-center text-sm text-gray-700">Bundelkhand's largest startup & business event happening in Jhansi, bringing startups, MSMEs, investors, industry leaders, and government representatives together on one platform.</p>
                </section>

                <section className="grid grid-cols-3 items-start justify-center gap-4">
                {
                    [{
                        image: "/expo/1.png",
                        text: "Discover Business Opportunities"
                    },
                    {
                        image: "/expo/2.png",
                        text: "Connect with Investors & Leaders"
                    },
                    {
                        image: "/expo/3.png",
                        text: "Learn from Industry Experts"
                    },
                    ].map((item, index) => (
                            <div key={index} className="flex flex-col gap-2">
                            <img src={item.image} alt={item.text} className="w-full h-full object-contain" />
                            <p className="text-center text-xs">{item.text}</p>
                            </div>
                    ))
                }
                </section>

                <section className="bg-gray-200 p-4 rounded-2xl">
                    <p className="text-center text-xl font-bold">28-01 FEB to MAR 2026</p>
                    <p className="text-center text-[19px] my-0.5 font-bold text-red-700">10:00 Am onward </p>
                    <p className="text-center text-base">Urban Haat Behind Deen Dayal Sabhagar </p>
                </section>

                <section className="flex flex-col gap-3">
               
                </section>

                <section className="flex flex-col items-center gap-3">
                    <img src="/expo/clients.png" alt="expo-logo" className="w-60 mx-auto mt-2 mb-4" />
                    <div>
                    <p className="text-center text-xl font-bold">Free Pass For EXPO</p>
                    <p className="text-center text-xs">Network & Grow Together</p>
                    </div>
 
                    <form onSubmit={handleSubmit} className="max-w-72 mx-auto mt-3">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border-2 border-gray-400 rounded-full px-3 py-2 text-sm"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border-2 border-gray-400 rounded-full px-3 py-2 text-sm mt-2"
                            required
                        />
                        {!submitted ? (
                            <button type="submit" className="bg-black text-white px-6 py-2 rounded-full font-medium w-full mt-4">
                                Submit
                            </button>
                        ) : null}
                    </form>

                    {!submitted ? (
                        <></>
                    ) : (
                        <canvas
                            ref={canvasRef}
                            className="w-full max-w-xs mx-auto my-4 block rounded-lg border border-gray-200"
                        />
                    )}
                    {submitted ? (
                        <p className="text-center text-xs text-gray-600">You can Download this and come to us <br /> <span className="text-gray-800 text-[13px] font-medium">Visitor pass Will be remain valid</span></p>
                    ) : 
                    (
                        <p className="text-center text-xs text-gray-600">Submit your details to get your free visitor pass</p>
                    )}
                    {submitted && (
                        <button type="button" onClick={handleDownload} className="bg-black text-white px-6 py-2 rounded-full font-medium">
                            Download
                        </button>
                    )}
                </section>

                <section className="flex flex-col gap-3 mt-4">
                     <div
                      className="relative w-full max-w-4xl mx-auto mb-12"
                      style={{ paddingBottom: "56.25%" }}
                    >
                    <iframe width="946" height="532" src="https://www.youtube.com/embed/CTv4l47QsmQ" title="Bundelkhand… ready ho jao" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-2xl"></iframe>
                    </div>
                    <img src="/expo/concert-img.png" alt="expo-logo" className="w-full h-full object-cover" />
                    <p className="text-center text-xl font-bold text-yellow-400 mt-4">Popular Bollywood Dance Hits (2017–2025)</p>
                    <p className="text-center text-lg font-bold text-white">Title & Major Film Tracks</p>
                    <ul className="list-disc pl-6 text-xs space-y-1 text-white">
                    <li>Badri Ki Dulhania (Title Track) — Badrinath Ki Dulhania (2017)</li>
                    <li>Chalti Hai Kya 9 Se 12 — Judwaa 2 (2017)</li>
                    <li>Kusu Kusu — Satyameva Jayate 2 (2021)</li>
                    <li>Sweety Tera Drama — Bareilly Ki Barfi (2017)</li>
                    <li>Rangtaari — Loveyatri (2018)</li>
                    <li>Sweetheart — Kedarnath (2018)</li>
                    <li>Heart Throb — Rocky Aur Rani Kii Prem Kahaani (2023)</li>
                    <li>Naach Meri Jaan — Tubelight (2017)</li>
                </ul>

                <a
                    href="https://in.bookmyshow.com/events/bollywood-rang-concert-jhansi/ET00486745/ticket/CMCZ/10001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 mb-4"
                    onClick={() => apiService.recordExpoBookMyShowClick().catch(() => {})}
                >
                    <img src="/expo/book-my-show.png" alt="expo-logo" className="w-60 mx-auto" />
                </a>

                {/* <p className="text-center text-xs text-white">OR Get Tickets from </p>
                <a
                    href="https://rzp.io/rzp/2QdeHpRb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4"
                    onClick={() => apiService.recordExpoRazorpayClick().catch(() => {})}
                >
                    <img src="/expo/razorpay.png" alt="expo-logo" className="w-60 mx-auto" />
                </a> */}

{/* 
                <ul className="list-decimal pl-6 text-sm space-y-1 text-white">
                    <li>Click & Pay</li>
                    <li>Complete the Payment</li>
                    <li>Take a Payment Screenshot</li>
                    <li>Share the Screenshot on WhatsApp</li>
                    
                </ul> */}


                <div>
                    <p className="text-center text-lg font-bold text-white mt-6">Book your tickets Now</p>
                    {daysLeft <= 0 ? (
                        <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#48C44F] mb-4 text-center px-2">
                            Event is live now. Come join us!
                        </p>
                    ) : (
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#48C44F] mb-4 text-center animate-pulse">
                            <span key={daysLeft} className="inline-block">{daysLeft} Day{daysLeft !== 1 ? "s" : ""} left!</span>
                        </p>
                    )}
                </div>
                </section>

                <p className="text-center text-xs text-white flex items-center justify-center gap-2">Powered by <img src="/visitingLink-logo-white.png" alt="expo-logo" className="w-20" /></p>

            </div>

        </div>
        </>
    )
}