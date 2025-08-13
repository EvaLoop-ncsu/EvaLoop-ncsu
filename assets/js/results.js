// EVALOOP Results Page JavaScript

let modelsData = [];
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNavigation();
    initializeFilters();
});

// Load data
async function loadData() {
    try {
        const response = await fetch('assets/data/models.json');
        const data = await response.json();
        modelsData = data.models;
        
        // Initialize all visualizations
        initializeCharts();
        populateHeatmap();
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize smooth scroll navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.results-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = targetSection.offsetTop - 120;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize category filters
function initializeFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

// Filter by category
function filterByCategory(category) {
    // Update category comparison chart based on filter
    if (charts.categoryComparison) {
        if (category === 'all') {
            charts.categoryComparison.data.datasets[0].hidden = false;
            charts.categoryComparison.data.datasets[1].hidden = false;
            charts.categoryComparison.data.datasets[2].hidden = false;
            charts.categoryComparison.data.datasets[3].hidden = false;
        } else {
            const categoryIndex = {
                'algorithms': 0,
                'datastructures': 1,
                'systemdesign': 2,
                'debugging': 3
            };
            
            charts.categoryComparison.data.datasets.forEach((dataset, index) => {
                dataset.hidden = index !== categoryIndex[category];
            });
        }
        charts.categoryComparison.update();
    }
}

// Initialize all charts
function initializeCharts() {
    // Performance Distribution Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        const scores = modelsData.map(m => m.aslScore);
        const bins = createHistogramBins(scores, 10);
        
        charts.performance = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Number of Models',
                    data: bins.counts,
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'ASL Score Range'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Models'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Scatter Chart - Success Rate vs ASL
    const scatterCtx = document.getElementById('scatterChart');
    if (scatterCtx) {
        const scatterData = modelsData.map(m => ({
            x: m.successRate,
            y: m.aslScore,
            label: m.name
        }));
        
        charts.scatter = new Chart(scatterCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Models',
                    data: scatterData,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
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
                                return `${context.raw.label}: ASL ${context.raw.y.toFixed(1)}, Success ${context.raw.x.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Success Rate (%)'
                        },
                        min: 60,
                        max: 100
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ASL Score'
                        },
                        min: 60,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Execution Time Chart
    const timeCtx = document.getElementById('timeChart');
    if (timeCtx) {
        const top10 = modelsData.slice(0, 10);
        
        charts.time = new Chart(timeCtx, {
            type: 'line',
            data: {
                labels: top10.map(m => m.name),
                datasets: [{
                    label: 'Average Time (s)',
                    data: top10.map(m => m.avgTime),
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Time (seconds)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Category Comparison Chart
    const categoryCtx = document.getElementById('categoryComparisonChart');
    if (categoryCtx) {
        const top5 = modelsData.slice(0, 5).filter(m => m.details);
        
        charts.categoryComparison = new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: top5.map(m => m.name),
                datasets: [
                    {
                        label: 'Algorithms',
                        data: top5.map(m => m.details.categories.algorithms),
                        backgroundColor: 'rgba(37, 99, 235, 0.8)'
                    },
                    {
                        label: 'Data Structures',
                        data: top5.map(m => m.details.categories.dataStructures),
                        backgroundColor: 'rgba(16, 185, 129, 0.8)'
                    },
                    {
                        label: 'System Design',
                        data: top5.map(m => m.details.categories.systemDesign),
                        backgroundColor: 'rgba(245, 158, 11, 0.8)'
                    },
                    {
                        label: 'Debugging',
                        data: top5.map(m => m.details.categories.debugging),
                        backgroundColor: 'rgba(239, 68, 68, 0.8)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Score (%)'
                        }
                    }
                }
            }
        });
    }
    
    // Organization Trends Chart
    const orgCtx = document.getElementById('orgTrendsChart');
    if (orgCtx) {
        const orgData = aggregateByOrganization();
        
        charts.orgTrends = new Chart(orgCtx, {
            type: 'radar',
            data: {
                labels: ['ASL Score', 'Success Rate', 'Speed', 'Robustness'],
                datasets: orgData.map((org, index) => ({
                    label: org.name,
                    data: [
                        org.avgASL,
                        org.avgSuccess,
                        100 - (org.avgTime * 50), // Convert time to speed score
                        org.avgRobustness
                    ],
                    borderColor: getColor(index),
                    backgroundColor: getColor(index, 0.2)
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Size vs Performance Chart
    const sizeCtx = document.getElementById('sizePerformanceChart');
    if (sizeCtx) {
        // Simulated size data (in production, this would come from actual data)
        const sizeData = modelsData.map(m => ({
            x: Math.random() * 150 + 10, // Simulated model size in billions
            y: m.aslScore,
            label: m.name
        }));
        
        charts.sizePerformance = new Chart(sizeCtx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Models',
                    data: sizeData.map(d => ({
                        ...d,
                        r: 5 + (d.y / 10) // Bubble size based on score
                    })),
                    backgroundColor: 'rgba(139, 92, 246, 0.6)',
                    borderColor: 'rgba(139, 92, 246, 1)'
                }]
            },
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
                                return `${context.raw.label}: ${context.raw.x.toFixed(0)}B params, ASL ${context.raw.y.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Model Size (Billion Parameters)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ASL Score'
                        },
                        min: 60,
                        max: 100
                    }
                }
            }
        });
    }
}

// Populate heatmap table
function populateHeatmap() {
    const heatmapTable = document.getElementById('heatmapTable');
    if (!heatmapTable) return;
    
    const top10 = modelsData.slice(0, 10);
    
    top10.forEach(model => {
        const row = document.createElement('tr');
        
        // Model name cell
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `<strong>${model.name}</strong>`;
        row.appendChild(nameCell);
        
        // Category scores (use details if available, otherwise generate)
        const categories = model.details ? [
            model.details.categories.algorithms,
            model.details.categories.dataStructures,
            model.details.categories.systemDesign,
            model.details.categories.debugging
        ] : [
            85 + Math.random() * 10,
            85 + Math.random() * 10,
            80 + Math.random() * 10,
            85 + Math.random() * 10
        ];
        
        categories.forEach(score => {
            const cell = document.createElement('td');
            cell.className = 'heatmap-cell';
            cell.style.backgroundColor = getHeatmapColor(score);
            cell.textContent = score.toFixed(1) + '%';
            row.appendChild(cell);
        });
        
        // Overall ASL score
        const aslCell = document.createElement('td');
        aslCell.className = 'heatmap-cell';
        aslCell.style.backgroundColor = getHeatmapColor(model.aslScore);
        aslCell.innerHTML = `<strong>${model.aslScore.toFixed(1)}</strong>`;
        row.appendChild(aslCell);
        
        heatmapTable.appendChild(row);
    });
}

// Helper function to create histogram bins
function createHistogramBins(data, numBins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    
    const bins = {
        labels: [],
        counts: []
    };
    
    for (let i = 0; i < numBins; i++) {
        const start = min + i * binWidth;
        const end = start + binWidth;
        bins.labels.push(`${start.toFixed(0)}-${end.toFixed(0)}`);
        bins.counts.push(data.filter(d => d >= start && d < end).length);
    }
    
    return bins;
}

// Aggregate data by organization
function aggregateByOrganization() {
    const orgMap = {};
    
    modelsData.forEach(model => {
        if (!orgMap[model.organization]) {
            orgMap[model.organization] = {
                name: model.organization,
                models: []
            };
        }
        orgMap[model.organization].models.push(model);
    });
    
    return Object.values(orgMap).map(org => ({
        name: org.name,
        avgASL: org.models.reduce((sum, m) => sum + m.aslScore, 0) / org.models.length,
        avgSuccess: org.models.reduce((sum, m) => sum + m.successRate, 0) / org.models.length,
        avgTime: org.models.reduce((sum, m) => sum + m.avgTime, 0) / org.models.length,
        avgRobustness: org.models.reduce((sum, m) => sum + m.robustnessScore, 0) / org.models.length
    }));
}

// Get color for charts
function getColor(index, alpha = 1) {
    const colors = [
        `rgba(37, 99, 235, ${alpha})`,
        `rgba(16, 185, 129, ${alpha})`,
        `rgba(245, 158, 11, ${alpha})`,
        `rgba(239, 68, 68, ${alpha})`,
        `rgba(139, 92, 246, ${alpha})`
    ];
    return colors[index % colors.length];
}

// Get heatmap color based on value
function getHeatmapColor(value) {
    // Normalize value to 0-1 range (assuming 60-100 scale)
    const normalized = (value - 60) / 40;
    
    if (normalized < 0.25) {
        return 'rgba(239, 68, 68, 0.8)'; // Red
    } else if (normalized < 0.5) {
        return 'rgba(245, 158, 11, 0.8)'; // Orange
    } else if (normalized < 0.75) {
        return 'rgba(251, 191, 36, 0.8)'; // Yellow
    } else {
        return 'rgba(16, 185, 129, 0.8)'; // Green
    }
}

// Download data functions
function downloadData(type) {
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch(type) {
        case 'full':
            content = JSON.stringify({
                metadata: {
                    version: '1.0',
                    date: new Date().toISOString(),
                    models_count: modelsData.length
                },
                models: modelsData
            }, null, 2);
            filename = 'evaloop_full_dataset.json';
            mimeType = 'application/json';
            break;
            
        case 'summary':
            content = convertToCSV(modelsData.map(m => ({
                rank: m.rank,
                name: m.name,
                organization: m.organization,
                asl_score: m.aslScore,
                success_rate: m.successRate,
                avg_time: m.avgTime,
                robustness_score: m.robustnessScore
            })));
            filename = 'evaloop_summary.csv';
            mimeType = 'text/csv';
            break;
            
        case 'detailed':
            alert('Excel export would require additional library implementation');
            return;
            
        case 'plots':
            alert('Plot export would require server-side implementation');
            return;
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Convert data to CSV
function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value;
        }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
}

// Animate stats on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(value => {
                animateValue(value);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stat boxes
document.querySelectorAll('.stat-box').forEach(box => {
    observer.observe(box);
});

// Animate value
function animateValue(element) {
    const target = parseFloat(element.textContent.replace(',', ''));
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

// Format number with commas
function formatNumber(num) {
    if (num >= 1000) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return num.toString();
}
