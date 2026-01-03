
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}


const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 150 && 
            window.scrollY < sectionTop + sectionHeight - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);


function animateOnScroll() {
    gsap.registerPlugin(ScrollTrigger);
    
  
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2
        });
    });
    

    gsap.utils.toArray('.footer-section').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.15
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap !== 'undefined') {
        animateOnScroll();
    }
    
    addRandomVehicles();
});


function goToNextPage(userType) {
    if (userType === 'user') {
        window.location.href = "magic";
    } else if (userType === 'staff') {
        window.location.href = "index";
    }
    else if (userType === 'bus') {
        window.location.href = "Vehiclelogin";
    }
}


function addRandomVehicles() {
    const background = document.querySelector('.animated-background');
    const vehicleTypes = ['car', 'bus', 'truck'];
    const colors = ['#4cc9f0', '#f72585', '#4361ee', '#3a0ca3', '#7209b7'];
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const vehicle = document.createElement('div');
            const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            vehicle.classList.add('vehicle', type);
            vehicle.style.backgroundColor = color;
            vehicle.style.bottom = '100px';
            vehicle.style.left = '-100px';
            vehicle.style.animationDuration = (15 + Math.random() * 10) + 's';
            vehicle.style.animationDelay = (i * 5) + 's';
            
            if (type === 'truck') {
                vehicle.style.width = '120px';
                vehicle.style.height = '50px';
                vehicle.style.borderRadius = '10px 5px 5px 10px';
                
                const cabin = document.createElement('div');
                cabin.style.position = 'absolute';
                cabin.style.width = '40px';
                cabin.style.height = '30px';
                cabin.style.backgroundColor = color;
                cabin.style.borderRadius = '5px';
                cabin.style.top = '-20px';
                cabin.style.left = '0';
                
                vehicle.appendChild(cabin);
            }
            
          
            const wheelFront = document.createElement('div');
            wheelFront.classList.add('wheel', 'front');
            wheelFront.style.position = 'absolute';
            wheelFront.style.width = '20px';
            wheelFront.style.height = '20px';
            wheelFront.style.backgroundColor = '#333';
            wheelFront.style.borderRadius = '50%';
            wheelFront.style.bottom = '-10px';
            wheelFront.style.right = '20px';
            wheelFront.style.border = '3px solid #777';
            wheelFront.style.animation = 'wheelRotate 1.5s linear infinite';
            
            const wheelBack = document.createElement('div');
            wheelBack.classList.add('wheel', 'back');
            wheelBack.style.position = 'absolute';
            wheelBack.style.width = '20px';
            wheelBack.style.height = '20px';
            wheelBack.style.backgroundColor = '#333';
            wheelBack.style.borderRadius = '50%';
            wheelBack.style.bottom = '-10px';
            wheelBack.style.left = '20px';
            wheelBack.style.border = '3px solid #777';
            wheelBack.style.animation = 'wheelRotate 1.5s linear infinite';
            
            vehicle.appendChild(wheelFront);
            vehicle.appendChild(wheelBack);
            
            background.appendChild(vehicle);
        }, i * 2000);
    }
}


window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
});


const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power1.out'
        });
    });
    
    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power1.out'
        });
    });
});


window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    
    const spinnerContainer = document.createElement('div');
    spinnerContainer.classList.add('spinner-container');
    
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    
    spinnerContainer.appendChild(spinner);
    loader.appendChild(spinnerContainer);
    
    document.body.appendChild(loader);
   
    const style = document.createElement('style');
    style.textContent = `
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .spinner-container {
            width: 100px;
            height: 100px;
            position: relative;
        }
        
        .spinner {
            width: 100%;
            height: 100%;
            border: 5px solid transparent;
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .spinner:before, .spinner:after {
            content: '';
            position: absolute;
            border: 5px solid transparent;
            border-radius: 50%;
        }
        
        .spinner:before {
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border-top-color: var(--accent-color);
            animation: spin 2s linear infinite;
        }
        
        .spinner:after {
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border-top-color: var(--secondary-color);
            animation: spin 1.5s linear infinite;
        }
        
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;
    
    document.head.appendChild(style);
    
    
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        setTimeout(() => {
            loader.remove();
            style.remove();
        }, 500);
    }, 1500);
});


const scrollTopBtn = document.createElement('button');
scrollTopBtn.classList.add('scroll-top-btn');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);


const scrollTopStyle = document.createElement('style');
scrollTopStyle.textContent = `
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 99;
    }
    
    .scroll-top-btn:hover {
        background-color: var(--secondary-color);
        transform: translateY(-5px);
    }
    
    .scroll-top-btn.visible {
        opacity: 1;
        visibility: visible;
    }
`;

document.head.appendChild(scrollTopStyle);


window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});


scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

