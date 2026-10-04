/* =========================================================
   VESSEL OF HONOUR SCHOOL
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =====================================================
       DARK / LIGHT MODE
       ===================================================== */

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector("i");

    const savedTheme = localStorage.getItem("voh-theme");

    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");

        if (themeIcon) {
            themeIcon.className = "fa-solid fa-sun";
        }
    }

    function updateThemeIcon() {
        if (!themeIcon) return;

        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        themeIcon.className = isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";
    }

    themeToggle?.addEventListener("click", () => {

        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("voh-theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("voh-theme", "dark");
        }

        updateThemeIcon();
    });


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle?.addEventListener("click", () => {

        navLinks?.classList.toggle("open");

        const isOpen = navLinks?.classList.contains("open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }

        document.body.classList.toggle("no-scroll", isOpen);
    });


    /* =====================================================
       CLOSE MOBILE MENU WHEN LINK IS CLICKED
       ===================================================== */

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks?.classList.remove("open");

            menuToggle?.setAttribute(
                "aria-expanded",
                "false"
            );

            const icon = menuToggle?.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-bars";
            }

            document.body.classList.remove("no-scroll");
        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        const cleanHref = href.split("#")[0];

        if (
            cleanHref === currentPage ||
            (currentPage === "" && cleanHref === "index.html")
        ) {
            link.classList.add("active");
        }

    });


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       COUNTER ANIMATION
       ===================================================== */

    const counters =
        document.querySelectorAll("[data-counter]");

    function animateCounter(counter) {

        const target =
            Number(counter.getAttribute("data-counter"));

        if (!Number.isFinite(target)) return;

        const duration = 1600;
        const startTime = performance.now();

        function update(currentTime) {

            const elapsed = currentTime - startTime;
            const progress =
                Math.min(elapsed / duration, 1);

            const eased =
                1 - Math.pow(1 - progress, 3);

            counter.textContent =
                Math.floor(target * eased).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent =
                    target.toLocaleString();
            }

        }

        requestAnimationFrame(update);
    }


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        if (
                            entry.target.dataset.counterAnimated !==
                            "true"
                        ) {

                            entry.target.dataset.counterAnimated =
                                "true";

                            animateCounter(entry.target);
                        }

                    }

                });

            },
            {
                threshold: 0.6
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    }


    /* =====================================================
       VIDEO MODAL
       ===================================================== */

    const videoModal =
        document.querySelector(".video-modal");

    const videoModalPlayer =
        videoModal?.querySelector("video");

    const modalClose =
        document.querySelector(".modal-close");

    const playButtons =
        document.querySelectorAll("[data-video]");


    function openVideoModal(videoSource) {

        if (!videoModal) return;

        videoModal.classList.add("active");

        document.body.classList.add("no-scroll");

        if (videoModalPlayer && videoSource) {

            videoModalPlayer.src = videoSource;

            videoModalPlayer.load();

            videoModalPlayer.play().catch(() => {});

        }

    }


    function closeVideoModal() {

        if (!videoModal) return;

        videoModal.classList.remove("active");

        document.body.classList.remove("no-scroll");

        if (videoModalPlayer) {

            videoModalPlayer.pause();

            videoModalPlayer.removeAttribute("src");

            videoModalPlayer.load();
        }

    }


    playButtons.forEach(button => {

        button.addEventListener("click", () => {

            const source =
                button.getAttribute("data-video");

            if (source) {
                openVideoModal(source);
            }

        });

    });


    modalClose?.addEventListener(
        "click",
        closeVideoModal
    );


    videoModal?.addEventListener("click", event => {

        if (event.target === videoModal) {
            closeVideoModal();
        }

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeVideoModal();
        }

    });


    /* =====================================================
       TOAST MESSAGE
       ===================================================== */

    const toast =
        document.getElementById("toast");

    let toastTimer;

    window.showToast = function(message) {

        if (!toast) return;

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

    };


    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header?.offsetHeight || 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       HEADER SHADOW ON SCROLL
       ===================================================== */

    const header =
        document.querySelector(".site-header");

    function handleHeaderScroll() {

        if (!header) return;

        if (window.scrollY > 20) {

            header.style.boxShadow =
                "0 8px 30px rgba(0,0,0,0.08)";

        } else {

            header.style.boxShadow = "none";

        }

    }

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );

    handleHeaderScroll();


    /* =====================================================
       IMAGE ERROR HANDLING
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.style.background =
                "linear-gradient(135deg,#123b2a,#09271c)";

            image.style.minHeight =
                image.style.minHeight || "200px";

        });

    });


    /* =====================================================
       INITIALIZATION COMPLETE
       ===================================================== */

    updateThemeIcon();

});
