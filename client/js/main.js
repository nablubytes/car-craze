/* =========================================================
   CAR CRAZE - MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. PAGE LOADER
       ===================================================== */

    const pageLoader = document.querySelector(".page-loader");

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (pageLoader) {
                pageLoader.classList.add("loaded");
            }

        }, 500);

    });


    /* =====================================================
       2. STICKY HEADER
       ===================================================== */

    const header = document.querySelector(".main-header");

    function handleHeaderScroll() {

        if (!header) return;

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );

    handleHeaderScroll();


    /* =====================================================
       3. MOBILE NAVIGATION
       ===================================================== */

    const mobileMenuButton =
        document.querySelector(".mobile-menu-button");

    const mobileNavigation =
        document.querySelector(".mobile-navigation");

    const mobileCloseButton =
        document.querySelector(".mobile-navigation-header button");

    const body =
        document.body;


    function openMobileMenu() {

        if (!mobileNavigation) return;

        mobileNavigation.classList.add("active");

        body.classList.add("menu-open");

    }


    function closeMobileMenu() {

        if (!mobileNavigation) return;

        mobileNavigation.classList.remove("active");

        body.classList.remove("menu-open");

    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openMobileMenu
        );

    }


    if (mobileCloseButton) {

        mobileCloseButton.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    /* Close menu when clicking outside */

    document.addEventListener("click", (event) => {

        if (!mobileNavigation) return;

        if (!mobileNavigation.classList.contains("active")) {
            return;
        }

        const clickedInsideMenu =
            mobileNavigation.contains(event.target);

        const clickedMenuButton =
            mobileMenuButton &&
            mobileMenuButton.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {

            closeMobileMenu();

        }

    });


    /* Close mobile menu when clicking a normal link */

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-navigation a"
        );


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });


    /* =====================================================
       4. MOBILE PRODUCTS DROPDOWN
       ===================================================== */

    const mobileProductsButton =
        document.querySelector(
            ".mobile-products-menu > button"
        );

    const mobileProductsMenu =
        document.querySelector(
            ".mobile-products-menu"
        );


    if (
        mobileProductsButton &&
        mobileProductsMenu
    ) {

        mobileProductsButton.addEventListener(
            "click",
            () => {

                mobileProductsMenu.classList.toggle(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       5. MOBILE CATEGORY DROPDOWNS
       ===================================================== */

    const mobileCategories =
        document.querySelectorAll(
            ".mobile-category"
        );


    mobileCategories.forEach(category => {

        const categoryButton =
            category.querySelector("button");


        if (!categoryButton) return;


        categoryButton.addEventListener(
            "click",
            () => {

                /* Close other categories */

                mobileCategories.forEach(
                    otherCategory => {

                        if (
                            otherCategory !== category
                        ) {

                            otherCategory.classList.remove(
                                "active"
                            );

                        }

                    }
                );


                category.classList.toggle(
                    "active"
                );

            }
        );

    });




    /* =====================================================
       5B. PRODUCTS DROPDOWN: CLICK + HOVER
       ===================================================== */

    const desktopProductDropdown = document.querySelector(".nav-dropdown");
    const desktopProductButton = document.querySelector(".nav-dropdown-button");

    if (desktopProductDropdown && desktopProductButton) {
        desktopProductButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            desktopProductDropdown.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
            if (!desktopProductDropdown.contains(event.target)) {
                desktopProductDropdown.classList.remove("open");
            }
        });

        desktopProductDropdown.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                desktopProductDropdown.classList.remove("open");
                desktopProductButton.focus();
            }
        });
    }

    /* =====================================================
       6. SEARCH OVERLAY
       ===================================================== */

    const searchButton =
        document.querySelector(
            "#search-button, .search-button"
        );

    const searchOverlay =
        document.querySelector(
            ".search-overlay"
        );

    const closeSearchButton =
        document.querySelector(
            ".close-search"
        );

    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    function openSearch() {

        if (!searchOverlay) return;

        searchOverlay.classList.add(
            "active"
        );

        body.classList.add(
            "menu-open"
        );


        setTimeout(() => {

            if (searchInput) {

                searchInput.focus();

            }

        }, 300);

    }


    function closeSearch() {

        if (!searchOverlay) return;

        searchOverlay.classList.remove(
            "active"
        );

        body.classList.remove(
            "menu-open"
        );

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            openSearch
        );

    }


    if (closeSearchButton) {

        closeSearchButton.addEventListener(
            "click",
            closeSearch
        );

    }


    /* Close search with Escape */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeSearch();

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       7. HERO SLIDER
       ===================================================== */

    const heroSlides =
        document.querySelectorAll(
            ".hero-slide"
        );

    const heroDots =
        document.querySelectorAll(
            ".hero-dot"
        );

    const heroNext =
        document.querySelector(
            ".hero-next"
        );

    const heroPrev =
        document.querySelector(
            ".hero-prev"
        );


    let currentHeroSlide = 0;

    let heroInterval;


    function showHeroSlide(index) {

        if (
            heroSlides.length === 0
        ) {

            return;

        }


        /* Loop slides */

        if (
            index >= heroSlides.length
        ) {

            currentHeroSlide = 0;

        } else if (
            index < 0
        ) {

            currentHeroSlide =
                heroSlides.length - 1;

        } else {

            currentHeroSlide = index;

        }


        /* Remove active classes */

        heroSlides.forEach(slide => {

            slide.classList.remove(
                "active"
            );

        });


        heroDots.forEach(dot => {

            dot.classList.remove(
                "active"
            );

        });


        /* Activate current slide */

        heroSlides[
            currentHeroSlide
        ].classList.add(
            "active"
        );


        if (
            heroDots[
                currentHeroSlide
            ]
        ) {

            heroDots[
                currentHeroSlide
            ].classList.add(
                "active"
            );

        }

    }


    function nextHeroSlide() {

        showHeroSlide(
            currentHeroSlide + 1
        );

    }


    function previousHeroSlide() {

        showHeroSlide(
            currentHeroSlide - 1
        );

    }


    if (heroNext) {

        heroNext.addEventListener(
            "click",
            () => {

                nextHeroSlide();

                restartHeroAutoPlay();

            }
        );

    }


    if (heroPrev) {

        heroPrev.addEventListener(
            "click",
            () => {

                previousHeroSlide();

                restartHeroAutoPlay();

            }
        );

    }


    /* Hero dots */

    heroDots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showHeroSlide(index);

                    restartHeroAutoPlay();

                }
            );

        }
    );


    function startHeroAutoPlay() {

        if (
            heroSlides.length <= 1
        ) {

            return;

        }


        heroInterval =
            setInterval(
                nextHeroSlide,
                5000
            );

    }


    function restartHeroAutoPlay() {

        clearInterval(
            heroInterval
        );

        startHeroAutoPlay();

    }


    showHeroSlide(0);

    startHeroAutoPlay();


    /* =====================================================
       8. PAUSE HERO WHEN MOUSE IS OVER
       ===================================================== */

    const heroSection =
        document.querySelector(
            ".hero-section"
        );


    if (heroSection) {

        heroSection.addEventListener(
            "mouseenter",
            () => {

                clearInterval(
                    heroInterval
                );

            }
        );


        heroSection.addEventListener(
            "mouseleave",
            () => {

                startHeroAutoPlay();

            }
        );

    }


    /* =====================================================
       9. HORIZONTAL PRODUCT SLIDER
       ===================================================== */

    const productSlider =
        document.querySelector(
            ".product-slider"
        );

    const productNext =
        document.querySelector(
            ".product-next"
        );

    const productPrev =
        document.querySelector(
            ".product-prev"
        );


    function scrollProducts(
        direction
    ) {

        if (!productSlider) return;


        const scrollAmount =
            productSlider.clientWidth *
            0.75;


        productSlider.scrollBy({

            left:
                direction *
                scrollAmount,

            behavior: "smooth"

        });

    }


    if (productNext) {

        productNext.addEventListener(
            "click",
            () => {

                scrollProducts(1);

            }
        );

    }


    if (productPrev) {

        productPrev.addEventListener(
            "click",
            () => {

                scrollProducts(-1);

            }
        );

    }


    /* =====================================================
       10. HORIZONTAL REVIEW SLIDER
       ===================================================== */

    const reviewSlider =
        document.querySelector(
            ".reviews-slider"
        );

    const reviewNext =
        document.querySelector(
            ".review-next"
        );

    const reviewPrev =
        document.querySelector(
            ".review-prev"
        );


    function scrollReviews(
        direction
    ) {

        if (!reviewSlider) return;


        const scrollAmount =
            reviewSlider.clientWidth *
            0.75;


        reviewSlider.scrollBy({

            left:
                direction *
                scrollAmount,

            behavior: "smooth"

        });

    }


    if (reviewNext) {

        reviewNext.addEventListener(
            "click",
            () => {

                scrollReviews(1);

            }
        );

    }


    if (reviewPrev) {

        reviewPrev.addEventListener(
            "click",
            () => {

                scrollReviews(-1);

            }
        );

    }


    /* =====================================================
       11. AUTOMATIC PRODUCT SCROLL
       ===================================================== */

    let productAutoScroll;


    function startProductAutoScroll() {

        if (!productSlider) return;


        productAutoScroll =
            setInterval(
                () => {

                    const maxScroll =
                        productSlider.scrollWidth -
                        productSlider.clientWidth;


                    if (
                        productSlider.scrollLeft >=
                        maxScroll - 10
                    ) {

                        productSlider.scrollTo({

                            left: 0,

                            behavior: "smooth"

                        });

                    } else {

                        productSlider.scrollBy({

                            left: 300,

                            behavior: "smooth"

                        });

                    }

                },
                4000
            );

    }


    function stopProductAutoScroll() {

        clearInterval(
            productAutoScroll
        );

    }


    if (productSlider) {

        startProductAutoScroll();


        productSlider.addEventListener(
            "mouseenter",
            stopProductAutoScroll
        );


        productSlider.addEventListener(
            "mouseleave",
            startProductAutoScroll
        );

    }


    /* =====================================================
       12. AUTOMATIC REVIEW SCROLL
       ===================================================== */

    let reviewAutoScroll;


    function startReviewAutoScroll() {

        if (!reviewSlider) return;


        reviewAutoScroll =
            setInterval(
                () => {

                    const maxScroll =
                        reviewSlider.scrollWidth -
                        reviewSlider.clientWidth;


                    if (
                        reviewSlider.scrollLeft >=
                        maxScroll - 10
                    ) {

                        reviewSlider.scrollTo({

                            left: 0,

                            behavior: "smooth"

                        });

                    } else {

                        reviewSlider.scrollBy({

                            left: 380,

                            behavior: "smooth"

                        });

                    }

                },
                5000
            );

    }


    function stopReviewAutoScroll() {

        clearInterval(
            reviewAutoScroll
        );

    }


    if (reviewSlider) {

        startReviewAutoScroll();


        reviewSlider.addEventListener(
            "mouseenter",
            stopReviewAutoScroll
        );


        reviewSlider.addEventListener(
            "mouseleave",
            startReviewAutoScroll
        );

    }


    /* =====================================================
       13. SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {

                threshold: 0.15,

                rootMargin:
                    "0px 0px -50px 0px"

            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );


    /* =====================================================
       14. BACK TO TOP
       ===================================================== */

    const backToTop =
        document.querySelector(
            ".back-to-top"
        );


    function handleBackToTop() {

        if (!backToTop) return;


        if (
            window.scrollY > 600
        ) {

            backToTop.classList.add(
                "active"
            );

        } else {

            backToTop.classList.remove(
                "active"
            );

        }

    }


    window.addEventListener(
        "scroll",
        handleBackToTop,
        { passive: true }
    );


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =====================================================
       15. SMOOTH ANCHOR LINKS
       ===================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.offsetTop -
                    headerHeight;


                window.scrollTo({

                    top:
                        targetPosition,

                    behavior:
                        "smooth"

                });

            }
        );

    });


    /* =====================================================
       16. SEARCH FILTER
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const searchResults =
                    document.querySelector(
                        ".search-results"
                    );


                if (!searchResults) {
                    return;
                }


                if (!query) {

                    searchResults.innerHTML =
                        "<p>Search for car accessories, electronics, lighting and more.</p>";

                    return;

                }


                /*
                 * Temporary frontend search.
                 *
                 * Later this will be replaced
                 * with products from MongoDB.
                 */

                const products =
                    document.querySelectorAll(
                        ".product-card"
                    );


                let matches = [];


                products.forEach(
                    product => {

                        const title =
                            product
                                .querySelector(
                                    "h3"
                                );


                        if (!title) {
                            return;
                        }


                        const productName =
                            title
                                .textContent
                                .toLowerCase();


                        if (
                            productName.includes(
                                query
                            )
                        ) {

                            matches.push(
                                title.textContent
                            );

                        }

                    }
                );


                if (
                    matches.length > 0
                ) {

                    searchResults.innerHTML =

                        matches
                            .map(
                                name =>
                                    `<p>✓ ${name}</p>`
                            )
                            .join("");

                } else {

                    searchResults.innerHTML =

                        "<p>No products found. Try another search.</p>";

                }

            }
        );

    }


    /* =====================================================
       17. PRODUCT CARD CLICK
       ===================================================== */

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

                    /*
                     * Don't redirect if the user
                     * clicked a button or link.
                     *
                     * Product URLs will be added
                     * dynamically later.
                     */

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }


                    const productLink =
                        card.dataset.productUrl;


                    if (
                        productLink
                    ) {

                        window.location.href =
                            productLink;

                    }

                }
            );

        }
    );


    /* =====================================================
       18. PREVENT EMPTY FORM SUBMISSION
       ===================================================== */

    const forms =
        document.querySelectorAll(
            "form"
        );


    forms.forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                const requiredInputs =
                    form.querySelectorAll(
                        "[required]"
                    );


                let valid = true;


                requiredInputs.forEach(
                    input => {

                        if (
                            !input.value.trim()
                        ) {

                            valid = false;

                            input.classList.add(
                                "input-error"
                            );

                        } else {

                            input.classList.remove(
                                "input-error"
                            );

                        }

                    }
                );


                if (!valid) {

                    event.preventDefault();

                }

            }
        );

    });


    /* =====================================================
       19. REMOVE INPUT ERROR
       ===================================================== */

    document.addEventListener(
        "input",
        event => {

            if (
                event.target.classList.contains(
                    "input-error"
                )
            ) {

                if (
                    event.target.value.trim()
                ) {

                    event.target.classList.remove(
                        "input-error"
                    );

                }

            }

        }
    );


    /* =====================================================
       20. RESIZE HANDLING
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            /*
             * Close mobile navigation
             * when switching to desktop.
             */

            if (
                window.innerWidth > 1100
            ) {

                closeMobileMenu();

            }

        }
    );




    /* =====================================================
       21. LIVE STORE: PRODUCTS + CATEGORIES + SEARCH
       ===================================================== */

    const STORE_API_URL = "http://localhost:5000";
    let storeProducts = [];
    let storeCategories = [];
    let activeProductFilter = null;

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeListResponse(data, key) {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.[key])) return data[key];
        if (Array.isArray(data?.data)) return data.data;
        return [];
    }

    function productImages(product) {
        if (Array.isArray(product?.images) && product.images.length) {
            return product.images.filter(Boolean);
        }
        if (product?.image) return [product.image];
        return [];
    }

    function normalizeText(value) {
        return String(value ?? "")
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");
    }

    function categoryName(product) {
        if (product?.categoryName) return String(product.categoryName);
        if (product?.category && typeof product.category === "object") {
            return product.category.name || product.category.title || "Car Accessories";
        }
        if (product?.category) {
            const match = storeCategories.find(c =>
                String(c._id) === String(product.category) ||
                String(c.id) === String(product.category) ||
                normalizeText(c.slug) === normalizeText(product.category)
            );
            return match?.name || String(product.category);
        }
        return "Car Accessories";
    }

    function productCategoryObject(product) {
        if (product?.category && typeof product.category === "object") return product.category;
        return storeCategories.find(c =>
            String(c._id) === String(product?.category) ||
            String(c.id) === String(product?.category)
        ) || null;
    }

    function productMatchesCategory(product, category) {
        if (!category) return true;

        const wanted = normalizeText(category.name || category);
        const catObj = productCategoryObject(product);
        const productCatName = normalizeText(categoryName(product));
        const productCatSlug = normalizeText(catObj?.slug);

        if (productCatName === wanted || productCatSlug === wanted) return true;
        if (catObj && String(catObj._id || catObj.id) === String(category._id || category.id)) return true;
        if (String(product?.category?._id || product?.category?.id || product?.category) === String(category._id || category.id)) return true;

        return false;
    }

    function findStoreCategory(value) {
        const wanted = normalizeText(value?.name || value);
        return storeCategories.find(category =>
            normalizeText(category.name) === wanted ||
            normalizeText(category.slug) === wanted ||
            String(category._id || category.id) === String(value?._id || value?.id || value)
        ) || null;
    }

    function productSubcategoryName(product) {
        if (product?.subcategory && typeof product.subcategory === "object") {
            return product.subcategory.name || product.subcategory.title || "";
        }
        return String(product?.subcategory || "");
    }

    function productPrice(product) {
        const value = Number(product?.sellingPrice ?? product?.price);
        return Number.isFinite(value)
            ? `₹${value.toLocaleString("en-IN")}`
            : "Price on request";
    }

    function productMRP(product) {
        const value = Number(product?.mrp);
        return Number.isFinite(value) && value > 0
            ? `₹${value.toLocaleString("en-IN")}`
            : "";
    }

    function productSearchText(product) {
        const highlights = Array.isArray(product?.highlights)
            ? product.highlights.join(" ")
            : (product?.highlights || "");

        return [
            product?.name,
            product?.brand,
            categoryName(product),
            productSubcategoryName(product),
            product?.description,
            highlights
        ].filter(Boolean).join(" ").toLowerCase();
    }

    function productDetailsURL(product) {
        const value = product?._id || product?.slug;
        return `product-details.html?id=${encodeURIComponent(value)}`;
    }

    function openProduct(product) {
        if (!product?._id && !product?.slug) return;
        window.open(productDetailsURL(product), "_blank", "noopener");
    }

    function renderProductCards(products) {
        const slider = document.getElementById("product-slider");
        if (!slider) return;

        slider.innerHTML = "";

        if (!products.length) {
            slider.innerHTML = `
                <div class="product-empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>No products found.</h3>
                    <p>Try another category, subcategory or search term.</p>
                </div>
            `;
            return;
        }

        products.forEach((product) => {
            const image = productImages(product)[0] || "";
            const category = categoryName(product);
            const subcategory = productSubcategoryName(product);
            const mrp = productMRP(product);
            const stock = Number(product?.stock) > 0;
            const badge = product?.featured
                ? "Featured"
                : product?.bestSeller
                    ? "Bestseller"
                    : product?.newArrival
                        ? "New"
                        : "";

            const card = document.createElement("article");
            card.className = "product-card";
            card.dataset.productId = product._id || product.slug || "";
            card.dataset.productUrl = productDetailsURL(product);

            card.innerHTML = `
                <div class="product-image">
                    ${badge ? `<span class="product-badge">${escapeHTML(badge)}</span>` : ""}
                    ${image
                        ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(product.name || "Car accessory")}" loading="lazy">`
                        : `<div class="product-placeholder"><i class="fa-solid fa-car"></i></div>`
                    }
                    <button class="product-quick-view" type="button" aria-label="View Product">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>

                <div class="product-info">
                    <span class="product-category">${escapeHTML(category)}</span>
                    ${subcategory ? `<small class="product-subcategory">${escapeHTML(subcategory)}</small>` : ""}
                    <h3>${escapeHTML(product.name || "Product")}</h3>

                    <div class="product-rating">
                        <span>★★★★★</span>
                        <small>${escapeHTML(product.rating ?? "New")}</small>
                    </div>

                    <div class="product-price">
                        ${mrp ? `<span class="product-mrp">${mrp}</span>` : ""}
                        <strong>${productPrice(product)}</strong>
                    </div>

                    <button class="product-button" type="button">
                        View Product
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>

                    <span class="product-stock ${stock ? "in-stock" : "out-of-stock"}">
                        ${stock ? "In Stock" : "Currently unavailable"}
                        ${stock ? `<span class="product-trending"><i class="fa-solid fa-arrow-trend-up"></i> Trending</span>` : ""}
                    </span>
                </div>
            `;

            card.addEventListener("click", (event) => {
                if (event.target.closest("button") && !event.target.closest(".product-quick-view") && !event.target.closest(".product-button")) return;
                openProduct(product);
            });

            slider.appendChild(card);
        });
    }

    function setProductSectionHeading(title, subtitle = "") {
        const heading = document.querySelector("#featured-products .section-heading h2");
        const eyebrow = document.querySelector("#featured-products .section-eyebrow");
        if (heading) heading.innerHTML = `${escapeHTML(title)}${subtitle ? ` <span>${escapeHTML(subtitle)}</span>` : ""}`;
        if (eyebrow) eyebrow.textContent = activeProductFilter ? "FILTERED PRODUCTS" : "HANDPICKED FOR YOU";
    }

    function showAllProducts() {
        activeProductFilter = null;
        setProductSectionHeading("Featured", "Products.");
        renderProductCards(storeProducts);
        document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function filterStoreProducts(category = "", subcategory = "") {
        const categoryObject = findStoreCategory(category);
        activeProductFilter = { category: categoryObject?.name || category, subcategory };
        const subWanted = normalizeText(subcategory);

        const filtered = storeProducts.filter((product) => {
            const categoryMatch = !category
                ? true
                : categoryObject
                    ? productMatchesCategory(product, categoryObject)
                    : normalizeText(categoryName(product)) === normalizeText(category);

            if (!categoryMatch) return false;
            if (!subWanted) return true;

            return normalizeText(productSubcategoryName(product)) === subWanted;
        });

        setProductSectionHeading(categoryObject?.name || category || "Products", subcategory || "");
        renderProductCards(filtered);
        document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderDesktopCategories() {
        const megaMenu = document.querySelector(".mega-menu");
        if (!megaMenu) return;

        megaMenu.innerHTML = "";

        if (!storeCategories.length) {
            megaMenu.innerHTML = `<div class="mega-menu-column"><h3>Products</h3><a href="#featured-products">No categories found</a></div>`;
            return;
        }

        storeCategories.forEach((category) => {
            const column = document.createElement("div");
            column.className = "mega-menu-column";

            const title = document.createElement("h3");
            title.textContent = category.name;
            title.style.cursor = "pointer";
            title.addEventListener("click", () => filterStoreProducts(category.name));
            column.appendChild(title);

            const subcategories = Array.isArray(category.subcategories)
                ? category.subcategories
                : [];

            if (!subcategories.length) {
                const link = document.createElement("a");
                link.href = "#featured-products";
                link.textContent = "View Products";
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    filterStoreProducts(category.name);
                });
                column.appendChild(link);
            } else {
                subcategories.forEach((subcategory) => {
                    const name = typeof subcategory === "object"
                        ? (subcategory.name || subcategory.title || "")
                        : String(subcategory);
                    if (!name) return;

                    const link = document.createElement("a");
                    link.href = "#featured-products";
                    link.textContent = name;
                    link.addEventListener("click", (event) => {
                        event.preventDefault();
                        filterStoreProducts(category.name, name);
                    });
                    column.appendChild(link);
                });
            }

            megaMenu.appendChild(column);
        });
    }

    function renderMobileCategories() {
        const submenu = document.getElementById("mobile-products-submenu");
        if (!submenu) return;

        submenu.innerHTML = "";

        storeCategories.forEach((category) => {
            const wrapper = document.createElement("div");
            wrapper.className = "mobile-category";

            const button = document.createElement("button");
            button.type = "button";
            button.innerHTML = `${escapeHTML(category.name)} <i class="fa-solid fa-chevron-down"></i>`;
            button.addEventListener("click", () => {
                wrapper.classList.toggle("active");
            });
            wrapper.appendChild(button);

            const list = document.createElement("div");
            list.className = "mobile-subcategory-list";

            const categoryLink = document.createElement("a");
            categoryLink.href = "#featured-products";
            categoryLink.textContent = `All ${category.name}`;
            categoryLink.addEventListener("click", (event) => {
                event.preventDefault();
                filterStoreProducts(category.name);
                closeMobileMenu();
            });
            list.appendChild(categoryLink);

            (Array.isArray(category.subcategories) ? category.subcategories : []).forEach((subcategory) => {
                const name = typeof subcategory === "object"
                    ? (subcategory.name || subcategory.title || "")
                    : String(subcategory);
                if (!name) return;

                const link = document.createElement("a");
                link.href = "#featured-products";
                link.textContent = name;
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    filterStoreProducts(category.name, name);
                    closeMobileMenu();
                });
                list.appendChild(link);
            });

            wrapper.appendChild(list);
            submenu.appendChild(wrapper);
        });
    }

    function renderCategoryCards() {
        document.querySelectorAll(".category-card").forEach((card) => {
            const title = card.querySelector("h3")?.textContent.trim();
            if (!title) return;

            const match = findStoreCategory(title);
            if (!match) return;

            card.dataset.categoryId = match._id || match.id || "";
            card.href = "#featured-products";

            if (card.dataset.filterBound === "true") return;
            card.dataset.filterBound = "true";

            card.addEventListener("click", (event) => {
                event.preventDefault();
                filterStoreProducts(match.name);
            });
        });
    }

    async function loadStoreData() {
        try {
            const [productsResponse, categoriesResponse] = await Promise.all([
                fetch(`${STORE_API_URL}/api/products`, { cache: "no-store" }),
                fetch(`${STORE_API_URL}/api/categories`, { cache: "no-store" })
            ]);

            if (!productsResponse.ok) throw new Error("Could not load products.");
            if (!categoriesResponse.ok) throw new Error("Could not load categories.");

            const productsData = await productsResponse.json();
            const categoriesData = await categoriesResponse.json();

            storeProducts = normalizeListResponse(productsData, "products");
            storeCategories = normalizeListResponse(categoriesData, "categories");

            renderDesktopCategories();
            renderMobileCategories();
            renderMobileProductsSheet();
            renderCategoryCards();
            renderProductCards(storeProducts);

            console.log("CAR CRAZE live store loaded:", {
                products: storeProducts.length,
                categories: storeCategories.length
            });
        } catch (error) {
            console.error("CAR CRAZE store loading failed:", error);
            renderProductCards([]);
        }
    }

    function renderSearchResults(query) {
        const results = document.getElementById("search-results");
        if (!results) return;

        const q = query.trim().toLowerCase();

        if (!q) {
            results.innerHTML = `<p>Search products by name, brand, category, subcategory or description.</p>`;
            return;
        }

        const matches = storeProducts.filter(product =>
            productSearchText(product).includes(q)
        );

        if (!matches.length) {
            results.innerHTML = `<p>No products found. Try another search.</p>`;
            return;
        }

        results.innerHTML = matches.map((product) => {
            const image = productImages(product)[0];
            const imageHTML = image
                ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(product.name || "Product")}">`
                : `<div class="search-result-placeholder"><i class="fa-solid fa-car"></i></div>`;

            return `
                <button class="search-result-item" type="button" data-product-id="${escapeHTML(product._id || product.slug || "")}">
                    ${imageHTML}
                    <span class="search-result-copy">
                        <strong>${escapeHTML(product.name || "Product")}</strong>
                        <span>${escapeHTML(categoryName(product))}${product?.subcategory ? ` · ${escapeHTML(product.subcategory)}` : ""}</span>
                    </span>
                    <span class="search-result-price">${productPrice(product)}</span>
                </button>
            `;
        }).join("");

        results.querySelectorAll(".search-result-item").forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.dataset.productId;
                const product = storeProducts.find(
                    item => String(item._id || item.slug) === String(id)
                );
                if (product) openProduct(product);
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderSearchResults(searchInput.value);
        });
    }

    const showAllProductsLinks = document.querySelectorAll("[data-show-all-products], #featured-products .btn-outline-orange");
    showAllProductsLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            showAllProducts();
        });
    });


    /* =====================================================
       22. MOBILE QUICK ACTIONS + PRODUCTS BOTTOM SHEET
       ===================================================== */
    const mobileQuickProducts = document.getElementById("mobileQuickProducts");
    const mobileQuickSearch = document.getElementById("mobileQuickSearch");
    const mobileProductsSheet = document.getElementById("mobile-products-sheet");
    const mobileProductsSheetOverlay = document.getElementById("mobile-products-sheet-overlay");
    const closeMobileProductsSheetButton = document.getElementById("close-mobile-products-sheet");
    const mobileProductsSheetGrid = document.getElementById("mobile-products-sheet-grid");

    const sheetIcons = [
        "fa-chair",
        "fa-car-side",
        "fa-lightbulb",
        "fa-display",
        "fa-spray-can-sparkles",
        "fa-bolt"
    ];

    function closeMobileProductsSheet() {
        mobileProductsSheet?.classList.remove("active");
        mobileProductsSheetOverlay?.classList.remove("active");
        mobileProductsSheet?.setAttribute("aria-hidden", "true");
        mobileProductsSheetOverlay?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("products-sheet-open");
    }

    function openMobileProductsSheet() {
        if (!mobileProductsSheet || !mobileProductsSheetGrid) return;
        renderMobileProductsSheet();
        mobileProductsSheet.classList.add("active");
        mobileProductsSheetOverlay?.classList.add("active");
        mobileProductsSheet.setAttribute("aria-hidden", "false");
        mobileProductsSheetOverlay?.setAttribute("aria-hidden", "false");
        document.body.classList.add("products-sheet-open");
    }

    function renderMobileProductsSheet() {
        if (!mobileProductsSheetGrid) return;

        mobileProductsSheetGrid.innerHTML = "";

        const all = document.createElement("button");
        all.type = "button";
        all.className = "mobile-sheet-category mobile-sheet-all";
        all.innerHTML = `<i class="fa-solid fa-grid-2"></i><span>View all products</span>`;
        all.addEventListener("click", () => {
            showAllProducts();
            closeMobileProductsSheet();
        });
        mobileProductsSheetGrid.appendChild(all);

        storeCategories.slice(0, 6).forEach((category, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "mobile-sheet-category";

            const count = (Array.isArray(category.subcategories) ? category.subcategories.length : 0);
            button.innerHTML = `
                <span class="mobile-sheet-category-icon"><i class="fa-solid ${sheetIcons[index] || "fa-layer-group"}"></i></span>
                <span class="mobile-sheet-category-text">
                    <strong>${escapeHTML(category.name || "Category")}</strong>
                    <small>${count ? `${count} subcategories` : "View products"}</small>
                </span>
                <i class="fa-solid fa-chevron-right" style="font-size:8px;color:#aaa"></i>
            `;

            button.addEventListener("click", () => {
                filterStoreProducts(category.name);
                closeMobileProductsSheet();
            });

            mobileProductsSheetGrid.appendChild(button);
        });
    }

    mobileQuickProducts?.addEventListener("click", openMobileProductsSheet);
    closeMobileProductsSheetButton?.addEventListener("click", closeMobileProductsSheet);
    mobileProductsSheetOverlay?.addEventListener("click", closeMobileProductsSheet);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMobileProductsSheet();
    });

    mobileQuickSearch?.addEventListener("click", () => {
        openSearch();
    });


    loadStoreData();

    /* =====================================================
       21. INITIALIZE
       ===================================================== */

    console.log(
        "CAR CRAZE website initialized successfully."
    );

});