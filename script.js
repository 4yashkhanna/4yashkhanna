// Get the current page's filename to highlight active menu link
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll('.menu-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Project data with p5 and Scratch projects
const projectData = {
    project1: {
        title: "Project 1: Colour Bounce",
        description: "Detailed description of Project 1. This is where you add more information about this specific project, explaining its purpose, goals, and outcomes.",
        image: "images/project1-preview.jpg",
        p5Sketch: true // Indicates that this project includes a p5.js sketch
    },
    project2: {
        title: "Project 2: Interactive Game (Scratch)",
        description: "This project showcases an interactive Scratch game. Click to open and play the game.",
        scratchEmbedUrl: "https://scratch.mit.edu/projects/1061798315/embed", // Scratch project URL
        isScratchGame: true // Indicates this project includes a Scratch game
    },
    project3: {
        title: "Project 3: Motion Graphics",
        description: "Explore this project to see creative motion graphics that bring ideas to life visually and dynamically.",
        image: "images/project3-preview.jpg"
    },
};

// Modal elements
const projectModal = document.getElementById('projectModal');
const projectDetailContent = document.getElementById('projectDetailContent');
const closeModalButton = document.getElementById('closeModal');

let p5Instance; // Store p5.js instance here

// Function to open the modal and populate with project data
function openModal(projectId) {
    const project = projectData[projectId];
    if (project) {
        if (project.p5Sketch) {
            projectDetailContent.innerHTML = `
                <h1>${project.title}</h1>
                <p>${project.description}</p>
                <div id="p5Container"></div> <!-- Container for the p5.js sketch -->
            `;
            initP5Sketch(); // Initialize the p5.js sketch for Project 1
        } else if (project.isScratchGame) {
            projectDetailContent.innerHTML = `
                <h1>${project.title}</h1>
                <p>${project.description}</p>
                <iframe src="${project.scratchEmbedUrl}" width="485" height="402" frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            projectDetailContent.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-modal-image">
                <h1>${project.title}</h1>
                <p>${project.description}</p>
            `;
        }
        projectModal.setAttribute('aria-hidden', 'false');
        projectModal.style.display = 'flex';
    }
}

// Function to close the modal
function closeModal() {
    projectModal.style.display = 'none';
    projectModal.setAttribute('aria-hidden', 'true');
    disposeP5Sketch(); // Dispose of the p5.js instance if it exists
}

// Function to initialize a p5.js sketch
function initP5Sketch(projectId) {
    disposeP5Sketch(); // Dispose any existing p5 instance to avoid duplicates
    
    const sketch = (p) => {
        let boxes = [];
        let ball;
        let colors = [];
        let lastColorChangeTime = 0;
        const colorChangeInterval = 5000; // 5 seconds

        p.setup = function() {
            p.createCanvas(600, 600); // Canvas size

            // Initial colors for each side
            colors = [
                ['#0000FF', '#0000FF', '#0000FF'],  // Top boxes colors (blue)
                ['#00FF00', '#00FF00', '#00FF00'],  // Bottom boxes colors (green)
                ['#FFFF00', '#FFFF00', '#FFFF00'],  // Left boxes colors (yellow)
                ['#FF007F', '#FF007F', '#FF007F']   // Right boxes colors (pink)
            ];

            // Create boxes for each side
            createBoxes();

            // Initialize the ball at the center with a starting color and no speed
            ball = new Ball(p.color(0, 0, 0)); // Start ball with black color
        };

        p.draw = function() {
            p.background(0); // Black background
            ball.update();
            ball.display();

            // Check for collision with boxes
            for (let box of boxes) {
                box.display();
                if (ball.hits(box)) {
                    ball.changeColor(box.color);
                    ball.bounce(box); // Bounce off the box
                }
            }

            // Change colors every 5 seconds in a clockwise manner
            if (p.millis() - lastColorChangeTime > colorChangeInterval) {
                rotateColorsClockwise();
                lastColorChangeTime = p.millis();
            }
        };

        // Create boxes for all sides
        function createBoxes() {
            const boxWidth = 100;
            const boxHeight = 100;

            // Top side boxes
            for (let i = 0; i < 3; i++) {
                boxes.push(new Box(150 + i * 100, 50, boxWidth, boxHeight, colors[0][i]));
            }

            // Bottom side boxes
            for (let i = 0; i < 3; i++) {
                boxes.push(new Box(150 + i * 100, p.height - 150, boxWidth, boxHeight, colors[1][i]));
            }

            // Left side boxes
            for (let i = 0; i < 3; i++) {
                boxes.push(new Box(50, 150 + i * 100, boxWidth, boxHeight, colors[2][i]));
            }

            // Right side boxes
            for (let i = 0; i < 3; i++) {
                boxes.push(new Box(p.width - 150, 150 + i * 100, boxWidth, boxHeight, colors[3][i]));
            }
        }

        // Rotate the colors of the boxes clockwise
        function rotateColorsClockwise() {
            const temp = colors[0]; // Save the top side's color

            // Shift colors clockwise
            colors[0] = colors[2];
            colors[2] = colors[1];
            colors[1] = colors[3];
            colors[3] = temp;

            // Update the colors of the boxes
            for (let i = 0; i < 3; i++) {
                boxes[i].color = colors[0][i];
                boxes[3 + i].color = colors[1][i];
                boxes[6 + i].color = colors[2][i];
                boxes[9 + i].color = colors[3][i];
            }
        }

        // Box class
        class Box {
            constructor(x, y, w, h, color) {
                this.x = x;
                this.y = y;
                this.width = w;
                this.height = h;
                this.color = color;
            }

            display() {
                p.fill(this.color);
                p.stroke(255);
                p.strokeWeight(2);
                p.rect(this.x, this.y, this.width, this.height);
            }
        }

        // Ball class
        class Ball {
            constructor(startColor) {
                this.x = p.width / 2;
                this.y = p.height / 2;
                this.diameter = 40;
                this.xSpeed = 0;
                this.ySpeed = 0;
                this.currentColor = startColor;
            }

            update() {
                this.x += this.xSpeed;
                this.y += this.ySpeed;

                // Bounce off the walls
                if (this.x < this.diameter / 2 || this.x > p.width - this.diameter / 2) {
                    this.xSpeed *= -1;
                }
                if (this.y < this.diameter / 2 || this.y > p.height - this.diameter / 2) {
                    this.ySpeed *= -1;
                }
            }

            display() {
                p.fill(this.currentColor);
                p.ellipse(this.x, this.y, this.diameter);
            }

            hits(box) {
                return (
                    this.x + this.diameter / 2 > box.x &&
                    this.x - this.diameter / 2 < box.x + box.width &&
                    this.y + this.diameter / 2 > box.y &&
                    this.y - this.diameter / 2 < box.y + box.height
                );
            }

            changeColor(newColor) {
                this.currentColor = newColor;
            }

            bounce(box) {
                const ballLeft = this.x - this.diameter / 2;
                const ballRight = this.x + this.diameter / 2;
                const ballTop = this.y - this.diameter / 2;
                const ballBottom = this.y + this.diameter / 2;

                const boxLeft = box.x;
                const boxRight = box.x + box.width;
                const boxTop = box.y;
                const boxBottom = box.y + box.height;

                const overlapLeft = ballRight - boxLeft;
                const overlapRight = boxRight - ballLeft;
                const overlapTop = ballBottom - boxTop;
                const overlapBottom = boxBottom - ballTop;

                const minOverlapX = p.min(overlapLeft, overlapRight);
                const minOverlapY = p.min(overlapTop, overlapBottom);

                if (minOverlapX < minOverlapY) {
                    this.xSpeed *= -1;
                } else {
                    this.ySpeed *= -1;
                }
            }
        }

        // Launch the ball in the direction of the mouse click
        p.mousePressed = function() {
            if (p.dist(p.mouseX, p.mouseY, ball.x, ball.y) < ball.diameter / 2) {
                ball.xSpeed = 0;
                ball.ySpeed = 0;
                ball.changeColor(p.color(0, 0, 0));
            } else {
                const angle = p.atan2(p.mouseY - ball.y, p.mouseX - ball.x);
                const speed = 5;
                ball.xSpeed = speed * p.cos(angle);
                ball.ySpeed = speed * p.sin(angle);
            }
        };
    };

    // Create a new p5 instance and attach it to the p5Container div
    const p5Container = document.getElementById('p5Container');
    if (p5Container) {
        p5Instance = new p5(sketch, p5Container);
    }
}

// Function to dispose of the p5.js instance
function disposeP5Sketch() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
}

// Event listener for project card clicks (event delegation)
document.querySelector('.project-list').addEventListener('click', (event) => {
    const projectCard = event.target.closest('.project-card');
    if (projectCard) {
        const projectId = projectCard.getAttribute('data-id');
        openModal(projectId);
    }
});

// Event listener to close modal on close button click
closeModalButton.addEventListener('click', closeModal);

// Optional: Close modal when clicking outside the modal content area
projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) {
        closeModal();
    }
});

// Optional: Close modal with ESC key for accessibility
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectModal.style.display === 'flex') {
        closeModal();
    }
});

// New: Scrolling functionality for project list
const projectList = document.getElementById('projectList');
const scrollAmount = 500; // Adjust this value as needed for smooth scrolling

// Scroll left event listener
document.getElementById('scrollLeft').addEventListener('click', () => {
    projectList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

// Scroll right event listener
document.getElementById('scrollRight').addEventListener('click', () => {
    projectList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});
