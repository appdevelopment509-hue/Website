// ====== Three.js Starfield Background ======
function initStarfield() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const sizesArray = new Float32Array(particlesCount);

    const colorBlue = new THREE.Color('#00f0ff');
    const colorPurple = new THREE.Color('#7000ff');
    const colorWhite = new THREE.Color('#ffffff');
    const colorCyan = new THREE.Color('#22d3ee');

    for(let i = 0; i < particlesCount * 3; i+=3) {
        const radius = 200;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const r = Math.cbrt(Math.random()) * radius;

        posArray[i] = r * Math.sin(phi) * Math.cos(theta);     // x
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);   // y
        posArray[i+2] = r * Math.cos(phi);                     // z

        const randomColor = Math.random();
        let mixedColor = colorWhite;
        if(randomColor > 0.8) mixedColor = colorBlue;
        else if(randomColor > 0.6) mixedColor = colorPurple;
        else if(randomColor > 0.4) mixedColor = colorCyan;

        colorsArray[i] = mixedColor.r;
        colorsArray[i+1] = mixedColor.g;
        colorsArray[i+2] = mixedColor.b;
        
        sizesArray[i/3] = Math.random() * 0.5 + 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // Nebula / Glowing spheres in background
    const addNebula = (color, x, y, z) => {
        const geometry = new THREE.SphereGeometry(30, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.03,
            blending: THREE.AdditiveBlending
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);
        scene.add(sphere);
    };

    addNebula('#00f0ff', 40, 20, -50);
    addNebula('#7000ff', -40, -20, -80);
    addNebula('#ff003c', 0, -50, -60);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particleMesh.rotation.y = elapsedTime * 0.03;
        particleMesh.rotation.z = elapsedTime * 0.02;

        targetX = mouseX * 0.0005;
        targetY = mouseY * 0.0005;
        
        particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
        particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);

        camera.position.y = -scrollY * 0.01;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ====== Reveal Elements on Scroll ======
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

// ====== Form Submission Mock ======
function submitForm(formElement) {
    const btn = formElement.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    if(!formElement.checkValidity()) {
        formElement.reportValidity();
        return;
    }

    btn.innerHTML = 'Sending <i class="ph ph-spinner ph-spin"></i>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        formElement.reset();
        btn.innerHTML = 'Application Sent <i class="ph ph-check-circle"></i>';
        btn.style.background = 'linear-gradient(45deg, #00f0ff, #22d3ee)';
        btn.style.color = '#000';
        btn.style.boxShadow = '0 0 20px #00f0ff';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.boxShadow = '';
            btn.style.pointerEvents = 'auto';
        }, 4000);
    }, 1500);
}

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initScrollReveal();
});
