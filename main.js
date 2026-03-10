        const cube = document.querySelector('.cube-3d');

        // Configuration
        const baseSpeed = 0.2;      // How fast it spins when idle
        const friction = 0.05;      // How quickly it slows down after moving (Lower = longer slide)
        const tiltSensitivity = 15; // How much it tilts towards mouse (Higher = more tilt)

        // Physics Variables
        let currentRotationY = 0;   // Current spinning angle
        let currentSpeed = baseSpeed;
        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;

        // Center of screen
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        // 1. Event Listener: Adds Energy to the System
        document.addEventListener('mousemove', (event) => {
            // Calculate Tilt (Where to look)
            // We normalize this from -1 to 1
            const xPos = (event.clientX - windowHalfX) / windowHalfX;
            const yPos = (event.clientY - windowHalfY) / windowHalfY;

            targetTiltY = xPos * tiltSensitivity; // Look Left/Right
            targetTiltX = -yPos * tiltSensitivity; // Look Up/Down

            // Accelerate Spin (The "Reactivity")
            // The faster you move, the higher the speed bump (capped at 3x speed)
            currentSpeed = Math.min(currentSpeed + 0.5, 3.0);
        });

        // 2. The Animation Loop (Runs 60 times per second)
        let isVisible = true;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        });

        const sceneContainer = document.querySelector('.scene-container');
        if (sceneContainer) observer.observe(sceneContainer);

        const animate = () => {
            if (cube && isVisible) {
                // A. Physics: Decay Speed
                // Smoothly drift currentSpeed back down to baseSpeed
                currentSpeed += (baseSpeed - currentSpeed) * friction;

                // B. Physics: Apply Rotation
                currentRotationY += currentSpeed;

                // C. Physics: Smooth Tilt
                // Linearly interpolate (LERP) current tilt towards target tilt for fluidity
                currentTiltX += (targetTiltX - currentTiltX) * 0.05;
                currentTiltY += (targetTiltY - currentTiltY) * 0.05;

                // D. Apply Transforms
                // rotateX = Tilt Up/Down
                // rotateY = Spin + Tilt Left/Right
                cube.style.transform = `
                rotateX(${currentTiltX}deg) 
                rotateY(${currentRotationY + currentTiltY}deg)
            `;
            }

            requestAnimationFrame(animate);
        };

        // Start the engine
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
        });