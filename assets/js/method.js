// EVALOOP Method Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCorrelationChart();
    initializeCodeHighlighting();
    initializeTabNavigation();
});

// Initialize correlation chart
function initializeCorrelationChart() {
    const ctx = document.getElementById('correlationChart');
    if (!ctx) return;
    
    // Sample correlation data
    const correlationData = {
        labels: ['ASL', 'Pass@1', 'Pass@10', 'BLEU', 'HumanEval'],
        datasets: [{
            label: 'Correlation with Human Evaluation',
            data: [0.87, 0.72, 0.75, 0.45, 0.68],
            backgroundColor: [
                'rgba(37, 99, 235, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
            ],
            borderColor: [
                'rgba(37, 99, 235, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(139, 92, 246, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: correlationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Correlation: ${context.raw.toFixed(2)}`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Metric Correlation with Human Evaluation',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Correlation Coefficient (r)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Evaluation Metrics'
                    }
                }
            }
        }
    });
}

// Initialize code highlighting
function initializeCodeHighlighting() {
    // Add line numbers to code blocks
    const codeBlocks = document.querySelectorAll('.algorithm-block pre');
    codeBlocks.forEach(block => {
        const lines = block.textContent.split('\n');
        const numberedLines = lines.map((line, index) => {
            if (line.trim() === '') return line;
            return line; // Line numbers are already in the HTML
        });
        // Prism will handle syntax highlighting if loaded
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    });
}

// Initialize tab navigation with smooth transitions
function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function(event) {
            // Animate tab content on switch
            const targetPane = document.querySelector(event.target.getAttribute('data-bs-target'));
            if (targetPane) {
                targetPane.style.opacity = '0';
                targetPane.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    targetPane.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    targetPane.style.opacity = '1';
                    targetPane.style.transform = 'translateY(0)';
                }, 10);
            }
            
            // Scroll to top of content
            window.scrollTo({
                top: document.querySelector('.method-header').offsetHeight + 60,
                behavior: 'smooth'
            });
        });
    });
}

// Copy formula to clipboard
function copyFormula(element) {
    const formula = element.querySelector('code').textContent;
    navigator.clipboard.writeText(formula).then(() => {
        // Show temporary success message
        const originalContent = element.innerHTML;
        const successMsg = document.createElement('div');
        successMsg.className = 'text-success text-center mt-2';
        successMsg.innerHTML = '<i class="bi bi-check-circle"></i> Copied to clipboard!';
        element.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 2000);
    });
}

// Add click-to-copy functionality to formula boxes
document.querySelectorAll('.formula-box').forEach(box => {
    box.style.cursor = 'pointer';
    box.title = 'Click to copy';
    box.addEventListener('click', function() {
        copyFormula(this);
    });
});

// Smooth scroll for accordion items
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function() {
        setTimeout(() => {
            const accordion = this.closest('.accordion-item');
            if (accordion) {
                const offset = accordion.offsetTop - 100;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        }, 350); // Wait for accordion animation
    });
});

// Add interactive hover effects to metric cards
document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const value = this.querySelector('.metric-value');
        if (value) {
            value.style.transform = 'scale(1.1)';
            value.style.transition = 'transform 0.2s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const value = this.querySelector('.metric-value');
        if (value) {
            value.style.transform = 'scale(1)';
        }
    });
});

// Animate process steps on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, 10);
            }, index * 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe process steps
document.querySelectorAll('.process-step').forEach(step => {
    observer.observe(step);
});

// Add print-friendly functionality
function printMethodology() {
    window.print();
}

// Export methodology as PDF (placeholder - would need server-side implementation)
function exportMethodologyPDF() {
    alert('PDF export functionality would be implemented server-side');
}
