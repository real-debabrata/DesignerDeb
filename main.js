/* ==========================================================================
   DESIGNER DEB — ENHANCED INTERACTION LAYER
   GSAP: ScrollSmoother · ScrollTrigger · SplitText · Draggable · InertiaPlugin
         Flip · CustomEase   +  Swiper for coverflow/testimonial rails
   ========================================================================== */

(() => {
    "use strict";

    /* ----------------------------------------------------------------
       0. ACCESSIBILITY: respect prefers-reduced-motion up front
       ---------------------------------------------------------------- */
    const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (REDUCE_MOTION) document.documentElement.classList.add("no-motion");

    /* ----------------------------------------------------------------
       1. PLUGIN REGISTRATION + GLOBAL TUNING
       ---------------------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable, InertiaPlugin, Flip);

    // A signature "mesmerising" organic ease used across the site
    if (window.CustomEase) {
        gsap.registerPlugin(CustomEase);
        CustomEase.create("silk", "M0,0 C0.25,0.1 0.15,1 1,1");
    }
    const SILK = window.CustomEase ? "silk" : "power3.out";

    // Keep motion buttery on high refresh-rate displays (120Hz/144Hz) and
    // avoid a big visual "jump" after the tab regains focus.
    gsap.ticker.lagSmoothing(1000, 16);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ----------------------------------------------------------------
       2. SOCIAL LINK CONFIG + CONTACT MODAL HYDRATION
       ---------------------------------------------------------------- */
    const SOCIAL_CONFIG = {
        instagram: { name: "Instagram", url: "https://instagram.com/insta.designerdeb", icon: "fa-brands fa-instagram", color: "text-pink-600 bg-pink-50 border-pink-100" },
        behance: { name: "Behance", url: "https://behance.net/designer_deb", icon: "fa-brands fa-behance", color: "text-blue-600 bg-blue-50 border-blue-100" },
        dribbble: { name: "Dribbble", url: "https://dribbble.com/designer_deb", icon: "fa-brands fa-dribbble", color: "text-rose-500 bg-rose-50 border-rose-100" },
        whatsapp: { name: "WhatsApp", url: "https://wa.me/916909649410", icon: "fa-brands fa-whatsapp", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
        email: { name: "Email", url: "mailto:hey@designerdeb.indevs.in", icon: "fa-solid fa-envelope", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
        facebook: { name: "Facebook", url: "https://facebook.com/designer_deb", icon: "fa-brands fa-facebook", color: "text-blue-700 bg-blue-50 border-blue-200" }
    };

    function initSocialLinks() {
        const container = document.getElementById("social-links-grid");
        if (!container) return;
        container.innerHTML = Object.values(SOCIAL_CONFIG).map(item => `
            <a href="${item.url}" target="_blank" rel="noopener" class="flex items-center space-x-3 p-4 border rounded-2xl ${item.color} hover:scale-[1.03] transition-all duration-200 hover-target">
                <span class="text-2xl"><i class="${item.icon}"></i></span>
                <span class="font-bold text-sm text-slate-800 font-sans">${item.name}</span>
            </a>`).join("");
    }

    function openSocialModal() {
        const modal = document.getElementById("social-modal");
        const box = modal.querySelector(".modal-box");
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        if (window.smoother) smoother.paused(true);
        gsap.timeline()
            .to(box, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" })
            .from("#social-links-grid a", { y: 16, opacity: 0, stagger: 0.06, duration: 0.4, ease: SILK }, "-=0.25");
    }

    function closeSocialModal() {
        const modal = document.getElementById("social-modal");
        const box = modal.querySelector(".modal-box");
        gsap.to(box, {
            scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => {
                modal.classList.remove("flex");
                modal.classList.add("hidden");
                if (window.smoother) smoother.paused(false);
            }
        });
    }
    window.openSocialModal = openSocialModal;
    window.closeSocialModal = closeSocialModal;

    /* ----------------------------------------------------------------
       3. LIGHT CONTENT PROTECTION (non-intrusive, matches source repo)
       ---------------------------------------------------------------- */
    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("dragstart", e => { if (e.target.nodeName === "IMG") e.preventDefault(); });

    /* ----------------------------------------------------------------
       4. PRELOADER — real asset progress, then boots everything else
       ---------------------------------------------------------------- */
    window.addEventListener("DOMContentLoaded", () => {
        initSocialLinks();

        const assets = [];
        document.querySelectorAll("img").forEach(img => { if (img.src) assets.push(img.src); });
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const match = el.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match && match[1]) assets.push(match[1]);
        });

        let loadedCount = 0;
        const totalAssets = assets.length || 1;
        const perc = document.getElementById("preloader-perc");
        const bar = document.getElementById("preloader-bar");
        let target = 0, current = 0;

        const tick = setInterval(() => {
            if (current < target) {
                current += 1;
                perc.innerText = String(current).padStart(2, "0");
                bar.style.width = current + "%";
            }
            if (current >= 100) {
                clearInterval(tick);
                gsap.to("#preloader", {
                    yPercent: -100, duration: 1.1, ease: "power4.inOut",
                    onComplete: () => {
                        document.getElementById("preloader").style.display = "none";
                        bootApp();
                    }
                });
            }
        }, 10);

        if (assets.length === 0) {
            target = 100;
        } else {
            assets.forEach(url => {
                const img = new Image();
                const bump = () => { loadedCount++; target = Math.floor((loadedCount / totalAssets) * 100); };
                img.onload = bump;
                img.onerror = bump;
                img.src = url;
            });
        }
        window.addEventListener("load", () => { target = 100; });
        setTimeout(() => { target = 100; }, 5000);
    });

    /* ----------------------------------------------------------------
       5. APP BOOT — everything that needs layout + smoother ready
       ---------------------------------------------------------------- */
    function bootApp() {
        initScrollSmoother();
        initMatchMediaContexts();
        initSplitTextReveals();
        initAmbientLightTracker();
        initScrollRevealBatches();
        initCounters();
        initCampaignDraggable();
        initBrochureStack();
        initFeedTabPill();
        initInstagramFeedSwitcher();
        initSwipers();
        initMeshCanvas();
        initSmoothAnchors();

        // Give images/layout a beat to settle, then recalc all triggers
        window.addEventListener("load", () => ScrollTrigger.refresh());
        setTimeout(() => ScrollTrigger.refresh(), 600);
    }

    /* ----------------------------------------------------------------
       6. SCROLLSMOOTHER — buttery inertial scroll + parallax effects
       ---------------------------------------------------------------- */
    function initScrollSmoother() {
        window.smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: REDUCE_MOTION ? 0 : 1.3,
            effects: true,          // enables data-speed / data-lag parallax
            smoothTouch: 0.1,       // light smoothing on touch, keeps it responsive
            normalizeScroll: true,  // irons out mobile browser URL-bar jumps
        });
    }

    /* ----------------------------------------------------------------
       7. ADAPTABILITY — gsap.matchMedia() responsive contexts
       ---------------------------------------------------------------- */
    function initMatchMediaContexts() {
        const mm = gsap.matchMedia();

        // Desktop-only: custom cursor + magnetic buttons (pointless on touch)
        mm.add("(hover: hover) and (pointer: fine) and (min-width: 1024px)", () => {
            initCustomCursor();
            initMagneticButtons();
            return () => {}; // nothing to tear down; listeners are cheap
        });

        // Small screens: trim the pinned brochure-stack scroll distance so it
        // doesn't force an enormous scroll well on short mobile viewports.
        mm.add("(max-width: 767px)", () => {
            ScrollTrigger.getById("brochure-pin")?.kill();
            initBrochureStack(true);
        });
    }

    /* ----------------------------------------------------------------
       8. SPLITTEXT — cinematic hero + section-header reveals
       ---------------------------------------------------------------- */
    function initSplitTextReveals() {
        // Hero: split into chars for a dramatic staggered rise + rotation
        const heroSplit = new SplitText("#hero-title", { type: "chars,words", charsClass: "split-char" });
        gsap.set(heroSplit.chars, { yPercent: 120, opacity: 0, rotateZ: 6 });

        gsap.from(".hero-reveal:not(#hero-title)", {
            y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: SILK
        });
        gsap.to(heroSplit.chars, {
            yPercent: 0, opacity: 1, rotateZ: 0, duration: 0.9, stagger: 0.018, ease: "back.out(1.7)", delay: 0.15
        });
        gsap.from(".hero-card", {
            scale: 0.8, opacity: 0, stagger: 0.15, duration: 1, ease: "back.out(1.5)", delay: 0.5
        });

        // Section headers: split into words, reveal on scroll-in
        document.querySelectorAll(".section-heading").forEach(heading => {
            const split = new SplitText(heading, { type: "words" });
            gsap.set(split.words, { yPercent: 110, opacity: 0 });
            ScrollTrigger.create({
                trigger: heading,
                start: "top 85%",
                once: true,
                onEnter: () => gsap.to(split.words, {
                    yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: SILK
                })
            });
        });
    }

    /* ----------------------------------------------------------------
       9. AMBIENT BACKDROP COLOR TRACKER
       ---------------------------------------------------------------- */
    function initAmbientLightTracker() {
        document.querySelectorAll("section[data-glow]").forEach(sec => {
            ScrollTrigger.create({
                trigger: sec,
                start: "top center",
                end: "bottom center",
                onEnter: () => updateAmbientGlow(sec.dataset.glow),
                onEnterBack: () => updateAmbientGlow(sec.dataset.glow),
            });
        });
    }

    function updateAmbientGlow(glowClass) {
        if (!glowClass) return;
        const [fromColor] = glowClass.split(" ");
        const glow1 = document.getElementById("ambient-glow-1");
        const glow2 = document.getElementById("ambient-glow-2");
        const palette = {
            indigo: ["rgba(129,140,248,0.4)", "rgba(196,181,253,0.3)"],
            teal: ["rgba(45,212,191,0.3)", "rgba(56,189,248,0.3)"],
            amber: ["rgba(251,191,36,0.25)", "rgba(249,115,22,0.25)"],
            pink: ["rgba(244,63,94,0.25)", "rgba(168,85,247,0.25)"],
            emerald: ["rgba(16,185,129,0.25)", "rgba(20,184,166,0.25)"],
        };
        const key = Object.keys(palette).find(k => fromColor.includes(k));
        if (!key) return;
        gsap.to(glow1, { backgroundColor: palette[key][0], duration: 1.5 });
        gsap.to(glow2, { backgroundColor: palette[key][1], duration: 1.5 });
    }

    /* ----------------------------------------------------------------
       10. SCROLL REVEAL BATCHES — cards fade/slide in as they arrive
       ---------------------------------------------------------------- */
    function initScrollRevealBatches() {
        ScrollTrigger.batch(".gsap-reveal", {
            start: "top 88%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: SILK, overwrite: true
            }),
            once: true
        });
    }

    /* ----------------------------------------------------------------
       11. ANIMATED STAT COUNTERS
       ---------------------------------------------------------------- */
    function initCounters() {
        document.querySelectorAll("[data-count-to]").forEach(el => {
            const end = parseFloat(el.dataset.countTo);
            const suffix = el.dataset.countSuffix || "";
            const proxy = { val: 0 };
            ScrollTrigger.create({
                trigger: el,
                start: "top 90%",
                once: true,
                onEnter: () => gsap.to(proxy, {
                    val: end,
                    duration: 1.6,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = (Number.isInteger(end) ? Math.round(proxy.val) : proxy.val.toFixed(1)) + suffix;
                    }
                })
            });
        });
    }

    /* ----------------------------------------------------------------
       12. DRAGGABLE + INERTIA — "create complex UIs in a snap" carousel
       ---------------------------------------------------------------- */
    function initCampaignDraggable() {
        const viewport = document.getElementById("campaign-viewport");
        const track = document.getElementById("campaign-carousel");
        const prevBtn = document.getElementById("campaign-prev");
        const nextBtn = document.getElementById("campaign-next");
        if (!viewport || !track) return;

        const cards = track.querySelectorAll(".campaign-card");
        const getStep = () => cards[0].getBoundingClientRect().width + 32; // card + gap-8
        const getMaxX = () => -(track.scrollWidth - viewport.clientWidth);

        const [draggable] = Draggable.create(track, {
            type: "x",
            inertia: true,
            edgeResistance: 0.7,
            bounds: () => ({ minX: getMaxX(), maxX: 0 }),
            cursor: "grab",
            onDragStart: () => { track.classList.add("dragging"); document.body.classList.add("drag-active"); },
            onDragEnd: () => { track.classList.remove("dragging"); document.body.classList.remove("drag-active"); },
            snap: {
                x: value => {
                    const step = getStep();
                    const max = getMaxX();
                    const snapped = Math.round(value / step) * step;
                    return gsap.utils.clamp(max, 0, snapped);
                }
            }
        });

        function nudge(dir) {
            const step = getStep();
            const target = gsap.utils.clamp(getMaxX(), 0, draggable.x - dir * step);
            gsap.to(track, { x: target, duration: 0.6, ease: SILK, onUpdate: () => draggable.update() });
        }
        prevBtn?.addEventListener("click", () => nudge(-1));
        nextBtn?.addEventListener("click", () => nudge(1));
    }

    /* ----------------------------------------------------------------
       13. CATEGORY IV — pinned mockup / brochure stacking
       ---------------------------------------------------------------- */
    function initBrochureStack(compact) {
        const section = document.getElementById("packaging");
        if (!section) return;

        gsap.set(".stack-img:not(:first-child)", { y: "100vh", force3D: true });

        const tl = gsap.timeline({
            scrollTrigger: {
                id: "brochure-pin",
                trigger: section,
                start: "top top",
                end: compact ? "+=180%" : "+=300%",
                pin: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });
        tl.to(".stack-img:nth-child(2)", { y: 0, ease: "none", force3D: true })
          .to(".stack-img:nth-child(3)", { y: 0, ease: "none", force3D: true })
          .to(".stack-img:nth-child(4)", { y: 0, ease: "none", force3D: true });
    }

    /* ----------------------------------------------------------------
       14. FLIP — sliding active-tab pill for the feed emulator selectors
       ---------------------------------------------------------------- */
    function initFeedTabPill() {
        const wrap = document.getElementById("feed-tabs-wrap");
        const pill = document.getElementById("feed-tab-pill");
        if (!wrap || !pill) return;
        const activeBtn = wrap.querySelector(".feed-tab-btn.active") || wrap.querySelector(".feed-tab-btn");
        gsap.set(pill, { top: activeBtn.offsetTop, left: 0, width: activeBtn.offsetWidth, height: activeBtn.offsetHeight });

        window.moveFeedTabPill = function (btn) {
            const state = Flip.getState(pill);
            gsap.set(pill, { top: btn.offsetTop, left: 0, width: btn.offsetWidth, height: btn.offsetHeight });
            Flip.from(state, { duration: 0.5, ease: "power3.inOut" });
        };
    }

    /* ----------------------------------------------------------------
       15. INSTAGRAM FEED EMULATOR (Category V interactive live post)
       ---------------------------------------------------------------- */
    const FEED_DATA = {
        coffee: {
            img: "https://res.cloudinary.com/dfyuuze2y/image/upload/v1779904187/20250605_102852_uotmqy.png",
            caption: "Fresh visual assets developed for Aura Craft Coffee. Fusing functional typography layout systems with structural packaging design.",
            likes: 1248,
            comments: [
                { user: "apex_flows", text: "The grid systems are incredible! Clean vectors." },
                { user: "visual_curator", text: "That layout composition is brilliant 🔥" }
            ]
        },
        monsoon: {
            img: "https://res.cloudinary.com/dfyuuze2y/image/upload/v1779904190/20250604_125441_pqie5n.png",
            caption: "Constructive Chaos: Monsoon Pairs. Experimental typographic forms capturing the motion and organic structure of monsoon weather.",
            likes: 852,
            comments: [
                { user: "studio_prime", text: "This typesetting is purely majestic!" },
                { user: "designer_deb", text: "@studio_prime Thank you! More editorial drops on the way." }
            ]
        },
        laxmi: {
            img: "https://res.cloudinary.com/dfyuuze2y/image/upload/v1779904173/Pink_Elegant_Laxmi_Puja_Greeting_Instagram_Post_20251001_192715_0000_kp70en.png",
            caption: "Divine Connection. Festival branding layout designed using luxury gradients, gold foil accents, and high fidelity vector illustrations.",
            likes: 2104,
            comments: [
                { user: "cultural_eye", text: "Capturing spiritual elegance beautifully." },
                { user: "lux_designs", text: "The color palette transition is absolutely pristine!" }
            ]
        }
    };

    function initInstagramFeedSwitcher() {
        const tabs = document.querySelectorAll(".feed-tab-btn");
        const postImage = document.getElementById("emulator-post-img");
        const postCaption = document.getElementById("emu-caption-text");
        const likeCounter = document.getElementById("emu-like-count");
        const commentThread = document.getElementById("emu-comments-container");
        const commentForm = document.getElementById("emu-comment-form");
        const commentInput = document.getElementById("emu-comment-input");
        const likeBtn = document.getElementById("emu-like-btn");
        const saveBtn = document.getElementById("emu-save-btn");
        if (!tabs.length || !postImage) return;

        let currentFeedKey = "coffee";
        const userLikedStates = { coffee: false, monsoon: false, laxmi: false };
        const userSavedStates = { coffee: false, monsoon: false, laxmi: false };

        function loadFeedData(key) {
            currentFeedKey = key;
            const data = FEED_DATA[key];

            gsap.to(postImage, {
                opacity: 0.1, scale: 0.98, duration: 0.2,
                onComplete: () => {
                    postImage.style.backgroundImage = `url('${data.img}')`;
                    gsap.to(postImage, { opacity: 1, scale: 1, duration: 0.4 });
                }
            });

            postCaption.innerHTML = data.caption;
            const activeLikes = userLikedStates[key] ? data.likes + 1 : data.likes;
            likeCounter.innerText = activeLikes.toLocaleString();
            likeBtn.innerHTML = userLikedStates[key]
                ? '<i class="fa-solid fa-heart text-rose-500"></i>'
                : '<i class="fa-regular fa-heart"></i>';
            saveBtn.innerHTML = userSavedStates[key]
                ? '<i class="fa-solid fa-bookmark text-slate-800"></i>'
                : '<i class="fa-regular fa-bookmark"></i>';

            commentThread.innerHTML = "";
            data.comments.forEach(comment => {
                const row = document.createElement("div");
                row.innerHTML = `<span class="font-bold mr-1">${comment.user}</span><span class="text-slate-600">${comment.text}</span>`;
                commentThread.appendChild(row);
            });
            commentThread.scrollTop = commentThread.scrollHeight;
        }

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => {
                    t.classList.remove("active");
                    t.querySelector(".font-bold")?.classList.remove("text-brand-500");
                    t.querySelector(".font-bold")?.classList.add("text-slate-400");
                });
                tab.classList.add("active");
                tab.querySelector(".font-bold")?.classList.add("text-brand-500");
                tab.querySelector(".font-bold")?.classList.remove("text-slate-400");

                window.moveFeedTabPill?.(tab);
                loadFeedData(tab.dataset.feedTarget);
            });
        });

        likeBtn.addEventListener("click", () => {
            const data = FEED_DATA[currentFeedKey];
            userLikedStates[currentFeedKey] = !userLikedStates[currentFeedKey];
            gsap.fromTo(likeBtn, { scale: 0.8 }, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 });
            const activeLikes = userLikedStates[currentFeedKey] ? data.likes + 1 : data.likes;
            likeCounter.innerText = activeLikes.toLocaleString();
            likeBtn.innerHTML = userLikedStates[currentFeedKey]
                ? '<i class="fa-solid fa-heart text-rose-500"></i>'
                : '<i class="fa-regular fa-heart"></i>';
        });

        saveBtn.addEventListener("click", () => {
            userSavedStates[currentFeedKey] = !userSavedStates[currentFeedKey];
            gsap.fromTo(saveBtn, { scale: 0.8 }, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 });
            saveBtn.innerHTML = userSavedStates[currentFeedKey]
                ? '<i class="fa-solid fa-bookmark text-slate-800"></i>'
                : '<i class="fa-regular fa-bookmark"></i>';
        });

        commentForm.addEventListener("submit", e => {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (!text) return;
            FEED_DATA[currentFeedKey].comments.push({ user: "You", text });
            const row = document.createElement("div");
            row.className = "opacity-0 translate-y-2";
            row.innerHTML = `<span class="font-bold mr-1">You</span><span class="text-slate-600">${text}</span>`;
            commentThread.appendChild(row);
            commentInput.value = "";
            gsap.to(row, { opacity: 1, y: 0, duration: 0.35, ease: SILK });
            commentThread.scrollTop = commentThread.scrollHeight;
        });
    }

    /* ----------------------------------------------------------------
       16. SWIPER INSTANCES (3D coverflow + testimonials)
       ---------------------------------------------------------------- */
    function initSwipers() {
        new Swiper(".swiper-coverflow", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: { rotate: 15, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false },
            autoplay: { delay: 3500, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            on: { slideChange: () => ScrollTrigger.refresh() }
        });

        new Swiper(".swiper-testimonials", {
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,
            autoplay: { delay: 4500, disableOnInteraction: false },
            navigation: { nextEl: ".swiper-next", prevEl: ".swiper-prev" },
        });
    }

    /* ----------------------------------------------------------------
       17. MESMERISING BACKDROP — animated mesh-gradient canvas
       ---------------------------------------------------------------- */
    function initMeshCanvas() {
        const canvas = document.getElementById("mesh-canvas");
        if (!canvas || REDUCE_MOTION) return;
        const ctx = canvas.getContext("2d");
        let w, h, dpr;
        const pointer = { x: 0.5, y: 0.4 };
        const quickX = gsap.quickTo(pointer, "x", { duration: 1.2, ease: "power3" });
        const quickY = gsap.quickTo(pointer, "y", { duration: 1.2, ease: "power3" });

        window.addEventListener("pointermove", e => {
            quickX(e.clientX / window.innerWidth);
            quickY(e.clientY / window.innerHeight);
        });

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.width = window.innerWidth * dpr;
            h = canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
        }
        resize();
        window.addEventListener("resize", resize);

        const blobs = [
            { hue: 245, base: [0.18, 0.22], r: 0.34, speed: 0.55 },
            { hue: 265, base: [0.82, 0.30], r: 0.30, speed: 0.42 },
            { hue: 320, base: [0.30, 0.80], r: 0.28, speed: 0.5 },
            { hue: 165, base: [0.78, 0.78], r: 0.26, speed: 0.38 },
        ];

        gsap.ticker.add(t => {
            ctx.clearRect(0, 0, w, h);
            blobs.forEach((b, i) => {
                const angle = t * 0.15 * b.speed + i * 2.1;
                const px = (b.base[0] + Math.cos(angle) * 0.06 + (pointer.x - 0.5) * 0.05) * w;
                const py = (b.base[1] + Math.sin(angle) * 0.06 + (pointer.y - 0.5) * 0.05) * h;
                const radius = b.r * Math.max(w, h);
                const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
                grad.addColorStop(0, `hsla(${b.hue}, 90%, 70%, 0.28)`);
                grad.addColorStop(1, `hsla(${b.hue}, 90%, 70%, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }

    /* ----------------------------------------------------------------
       18. CUSTOM CURSOR (gsap.quickTo — tied to the display's own refresh)
       ---------------------------------------------------------------- */
    function initCustomCursor() {
        const cursor = document.getElementById("cursor");
        const follower = document.getElementById("cursor-follower");
        if (!cursor || !follower) return;

        const setCursorX = gsap.quickTo(cursor, "x", { duration: 0.05, ease: "none" });
        const setCursorY = gsap.quickTo(cursor, "y", { duration: 0.05, ease: "none" });
        const setFollowerX = gsap.quickTo(follower, "x", { duration: 0.45, ease: "power3" });
        const setFollowerY = gsap.quickTo(follower, "y", { duration: 0.45, ease: "power3" });

        window.addEventListener("pointermove", e => {
            setCursorX(e.clientX); setCursorY(e.clientY);
            setFollowerX(e.clientX); setFollowerY(e.clientY);
        });

        const bind = () => {
            document.querySelectorAll(".hover-target, button, a, [role='button'], .swiper-slide, .feed-tab-btn").forEach(el => {
                el.addEventListener("mouseenter", () => document.body.classList.add("hover-active"));
                el.addEventListener("mouseleave", () => document.body.classList.remove("hover-active"));
            });
        };
        bind();
        // Re-bind after dynamic content (feed switcher) mutates the DOM
        new MutationObserver(bind).observe(document.body, { childList: true, subtree: true });
    }

    /* ----------------------------------------------------------------
       19. MAGNETIC BUTTONS (gsap.quickTo, high refresh-rate friendly)
       ---------------------------------------------------------------- */
    function initMagneticButtons() {
        document.querySelectorAll(".magnetic-btn").forEach(btn => {
            const setX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
            const setY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
            btn.addEventListener("mousemove", e => {
                const rect = btn.getBoundingClientRect();
                setX((e.clientX - rect.left - rect.width / 2) * 0.3);
                setY((e.clientY - rect.top - rect.height / 2) * 0.3);
            });
            btn.addEventListener("mouseleave", () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    /* ----------------------------------------------------------------
       20. SMOOTH ANCHOR NAVIGATION (via ScrollSmoother.scrollTo)
       ---------------------------------------------------------------- */
    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                const targetId = this.getAttribute("href");
                if (targetId.length < 2) return;
                const targetEl = document.querySelector(targetId);
                if (!targetEl) return;
                e.preventDefault();
                if (window.smoother) {
                    smoother.scrollTo(targetEl, true, "top top+=80");
                } else {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }
})();
