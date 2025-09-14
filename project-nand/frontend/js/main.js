$(document).ready(function() {
    // Cache DOM elements
    const $header = $('.header');
    const $sidebar = $('.sidebar');
    const $overlay = $('.overlay');
    const $chatWidget = $('.chat-widget');
    const $chatToggle = $('.chat-toggle');
    const $menuToggle = $('.menu-toggle');
    const $navLinks = $('.nav-links');
    const $testimonialsWrapper = $('.testimonials-wrapper');
    const $sidebarToggle = $('.sidebar-toggle');
    const $closeSidebar = $('.close-sidebar');

    // Header scroll effect
    let lastScroll = 0;
    $(window).on('scroll', function() {
        const currentScroll = $(window).scrollTop();
        
        if (currentScroll <= 0) {
            $header.removeClass('scroll-down scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !$header.hasClass('scroll-down')) {
            $header.removeClass('scroll-up').addClass('scroll-down');
        } else if (currentScroll < lastScroll && $header.hasClass('scroll-down')) {
            $header.removeClass('scroll-down').addClass('scroll-up');
        }
        
        $header.toggleClass('scrolled', currentScroll > 100);
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
            closeMobileMenu();
        }
    });

    // Mobile menu functionality
    $menuToggle.on('click', function() {
        $(this).toggleClass('active');
        $navLinks.toggleClass('active');
        $overlay.toggleClass('active');
        $('body').toggleClass('menu-open');
    });

    // Chat widget functionality
    $chatToggle.on('click', function() {
        $chatWidget.toggleClass('active');
        $(this).toggleClass('active');
    });

    // Testimonials slider
    let currentSlide = 0;
    const $testimonials = $('.testimonial-card');
    const totalSlides = $testimonials.length;

    $('.nav-btn.next').on('click', function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateTestimonialSlider();
    });

    $('.nav-btn.prev').on('click', function() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateTestimonialSlider();
    });

    function updateTestimonialSlider() {
        const translateValue = -currentSlide * 100;
        $testimonialsWrapper.css('transform', `translateX(${translateValue}%)`);
    }

    // Close menus when clicking outside
    $(document).on('click', function(e) {
        const $target = $(e.target);
        
        // Close mobile menu
        if (!$target.closest('.menu-toggle, .nav-links').length) {
            closeMobileMenu();
        }
        
        // Close chat widget
        if (!$target.closest('.chat-widget, .chat-toggle').length) {
            $chatWidget.removeClass('active');
            $chatToggle.removeClass('active');
        }
    });

    // Close menus on ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            $chatWidget.removeClass('active');
            $chatToggle.removeClass('active');
        }
    });

    // Helper functions
    function closeMobileMenu() {
        $menuToggle.removeClass('active');
        $navLinks.removeClass('active');
        $overlay.removeClass('active');
        $('body').removeClass('menu-open');
    }

    // Handle window resize
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if ($(window).width() > 768) {
                closeMobileMenu();
            }
        }, 250);
    });

    // Sidebar toggle
    function toggleSidebar() {
        $sidebar.toggleClass('active');
        $overlay.toggleClass('active');
        $('body').toggleClass('sidebar-open');
    }

    $sidebarToggle.on('click', toggleSidebar);
    $closeSidebar.on('click', toggleSidebar);
    $overlay.on('click', toggleSidebar);

    // Close sidebar on escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $sidebar.hasClass('active')) {
            toggleSidebar();
        }
    });

    // News Category Filtering
    $('.category-btn').on('click', function() {
        const category = $(this).data('category');
        
        // Update active button
        $('.category-btn').removeClass('active');
        $(this).addClass('active');
        
        if (category === 'all') {
            $('.news-category-section').fadeIn(400);
        } else {
            $('.news-category-section').hide();
            $(`.news-category-section[data-category="${category}"]`).fadeIn(400);
        }
    });

    // Load More Functionality
    $('.load-more').on('click', function() {
        const $btn = $(this);
        $btn.prop('disabled', true);
        $('.loading-spinner').show();
        
        // Simulate loading more content
        setTimeout(() => {
            // Add your AJAX call here to load more news
            $btn.prop('disabled', false);
            $('.loading-spinner').hide();
        }, 1500);
    });

    // Doctors filtering functionality
    $('.doctors-filter .filter-btn').on('click', function() {
        const specialty = $(this).data('filter');
        
        // Update active button state
        $('.doctors-filter .filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Hide all doctors and show selected specialty
        $('.doctor-card').hide();
        $(`.doctor-card[data-specialty="${specialty}"]`).fadeIn(400);
        
        // Update layout
        updateDoctorsLayout();
    });

    // Helper function to maintain grid layout
    function updateDoctorsLayout() {
        const $visibleDoctors = $('.doctor-card:visible');
        const totalVisible = $visibleDoctors.length;
        
        // Show/hide "View All" button based on visible doctors
        if (totalVisible > 6) {
            $('.doctors-cta').show();
            $visibleDoctors.slice(6).hide();
        } else {
            $('.doctors-cta').hide();
        }
    }

    // View All Doctors functionality
    $('.btn-view-all').on('click', function() {
        const $hiddenDoctors = $('.doctor-card:hidden');
        $hiddenDoctors.fadeIn(400);
        $(this).hide();
    });

    // Initialize with first specialty selected
    $(document).ready(function() {
        // Show first specialty's doctors
        const firstSpecialty = $('.doctors-filter .filter-btn').first().data('filter');
        $(`.doctor-card[data-specialty="${firstSpecialty}"]`).show();
        updateDoctorsLayout();
    });

    // Animate statistics when in viewport
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const updateStat = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target + '+';
                }
            };

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateStat();
                    observer.disconnect();
                }
            });

            observer.observe(stat);
        });
    }

    // Initialize animations when document is ready
    document.addEventListener('DOMContentLoaded', () => {
        animateStats();
    });

 
        $('.video-play').on('click', function(e) {
            e.preventDefault();
            const videoUrl = 'https://www.youtube.com/embed/swI_NbkvSp8?si=kuXnDb-0alrp7lK1';
            $('#videoIframe').attr('src', videoUrl);
            $('#cont_videoModal').show();
            $('#videoModal').fadeIn().css('display', 'flex');
            $('body').css('overflow', 'hidden');
        });

        $('.close-modal, #videoModal').on('click', function(e) {
            if (e.target === this) {
                $('#videoIframe').attr('src', '');
                $('#videoModal').fadeOut();
                $('body').css('overflow', '');
                $('#cont_videoModal').hide();
            }
        });
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                $('#videoIframe').attr('src', '');
                $('#videoModal').fadeOut();
                $('body').css('overflow', '');
                $('#cont_videoModal').hide();
            }
        });
}); 