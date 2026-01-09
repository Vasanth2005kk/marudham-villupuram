document.addEventListener("DOMContentLoaded", function () {
    const portfolioContainer = document.querySelector('.dynamic-portfolio');
    if (!portfolioContainer) return;

    // Use the global window.portfolioData object
    const data = window.portfolioData;
    if (!data) {
        console.error('Portfolio data not found. Ensure assets/js/portfolio-data.js is included.');
        return;
    }

    // 1. Setup Filters
    const filtersContainer = portfolioContainer.querySelector('.portfolio-filters');
    const defaultFilter = data.settings.defaultFilter;

    data.filters.forEach(filter => {
        const li = document.createElement('li');
        li.textContent = filter.name;
        li.setAttribute('data-filter', filter.filter);
        if (filter.filter === defaultFilter) {
            li.classList.add('filter-active');
        }
        filtersContainer.appendChild(li);
    });

    // 2. Setup Items
    const itemsContainer = portfolioContainer.querySelector('.isotope-container');

    data.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${item.category}`;

        itemDiv.innerHTML = `
      <div class="portfolio-content h-100">
        <img src="${item.image}" class="img-fluid" alt="${item.title}">
        <div class="portfolio-info">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <a href="${item.image}" title="${item.title}" data-gallery="portfolio-gallery" class="glightbox preview-link">
            <i class="bi bi-zoom-in"></i>
          </a>
        </div>
      </div>
    `;
        itemsContainer.appendChild(itemDiv);
    });

    // 3. Initialize Isotope
    let layout = portfolioContainer.getAttribute('data-layout') ?? 'masonry';
    let sort = portfolioContainer.getAttribute('data-sort') ?? 'original-order';
    let filter = defaultFilter;

    let initIsotope;
    // imagesLoaded is defined by imagesloaded.pkgd.min.js
    if (typeof imagesLoaded === 'function') {
        imagesLoaded(itemsContainer, function () {
            initIsotope = new Isotope(itemsContainer, {
                itemSelector: '.isotope-item',
                layoutMode: layout,
                filter: filter,
                sortBy: sort
            });
        });
    } else {
        // Fallback if imagesLoaded is not available
        initIsotope = new Isotope(itemsContainer, {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter,
            sortBy: sort
        });
    }

    // 4. Filter Event Listeners
    const filterItems = filtersContainer.querySelectorAll('li');
    filterItems.forEach(item => {
        item.addEventListener('click', function () {
            filtersContainer.querySelector('.filter-active').classList.remove('filter-active');
            this.classList.add('filter-active');
            if (initIsotope) {
                initIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
            }
            if (typeof AOS !== 'undefined') {
                AOS.init();
            }
        });
    });

    // 5. Re-init GLightbox for new items
    if (typeof GLightbox !== 'undefined') {
        const glightbox = GLightbox({
            selector: '.glightbox'
        });
    }
});
