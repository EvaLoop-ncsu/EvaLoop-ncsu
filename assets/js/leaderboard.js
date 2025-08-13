// EVALOOP Leaderboard JavaScript

let modelsData = [];
let dataTable = null;
let aslChart = null;
let categoryChart = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadModelData();
    initializeEventListeners();
});

// Load model data from JSON
async function loadModelData() {
    try {
        const response = await fetch('assets/data/models.json');
        const data = await response.json();
        modelsData = data.models;
        
        // Update stats
        updateStatistics(data);
        
        // Initialize table
        initializeDataTable();
        
        // Initialize charts
        initializeCharts();
        
        // Populate comparison dropdowns
        populateComparisonDropdowns();
        
    } catch (error) {
        console.error('Error loading model data:', error);
        showError('Failed to load model data. Please try again later.');
    }
}

// Update statistics cards
function updateStatistics(data) {
    const totalModels = data.models.length;
    const avgASL = data.models.reduce((sum, m) => sum + m.aslScore, 0) / totalModels;
    const highestASL = Math.max(...data.models.map(m => m.aslScore));
    
    document.getElementById('totalModels').textContent = totalModels;
    document.getElementById('avgASL').textContent = avgASL.toFixed(1);
    document.getElementById('highestASL').textContent = highestASL.toFixed(1);
    document.getElementById('lastUpdate').textContent = formatDate(data.lastUpdated);
}

// Initialize DataTable
function initializeDataTable() {
    const tableBody = document.getElementById('leaderboardBody');
    tableBody.innerHTML = '';
    
    modelsData.forEach(model => {
        const row = createTableRow(model);
        tableBody.appendChild(row);
    });
    
    // Initialize DataTable
    dataTable = $('#leaderboardTable').DataTable({
        pageLength: 20,
        order: [[3, 'desc']], // Sort by ASL Score by default
        columnDefs: [
            { orderable: false, targets: [8] }, // Disable sorting for Details column
            { className: 'text-center', targets: [0, 3, 4, 5, 6, 7, 8] }
        ],
        language: {
            search: 'Search models:',
            lengthMenu: 'Show _MENU_ models per page',
            info: 'Showing _START_ to _END_ of _TOTAL_ models',
            paginate: {
                first: 'First',
                last: 'Last',
                next: 'Next',
                previous: 'Previous'
            }
        },
        responsive: true
    });
}

// Create table row
function createTableRow(model) {
    const row = document.createElement('tr');
    row.id = `model-${model.rank}`;
    
    // Determine rank badge
    let rankBadge = '';
    if (model.rank === 1) {
        rankBadge = '<span class="rank-badge rank-1">1</span>';
    } else if (model.rank === 2) {
        rankBadge = '<span class="rank-badge rank-2">2</span>';
    } else if (model.rank === 3) {
        rankBadge = '<span class="rank-badge rank-3">3</span>';
    } else {
        rankBadge = `<span class="badge bg-secondary">${model.rank}</span>`;
    }
    
    // Determine trend icon
    let trendIcon = '';
    switch(model.trend) {
        case 'up':
            trendIcon = '<i class="bi bi-arrow-up-circle-fill trend-up"></i>';
            break;
        case 'down':
            trendIcon = '<i class="bi bi-arrow-down-circle-fill trend-down"></i>';
            break;
        default:
            trendIcon = '<i class="bi bi-dash-circle-fill trend-stable"></i>';
    }
    
    row.innerHTML = `
        <td>${rankBadge}</td>
        <td class="text-start">
            <strong>${model.name}</strong>
        </td>
        <td>${model.organization}</td>
        <td class="score-cell">
            <span class="badge bg-primary">${model.aslScore.toFixed(1)}</span>
        </td>
        <td>${model.successRate.toFixed(1)}%</td>
        <td>${model.avgTime.toFixed(2)}</td>
        <td>${model.robustnessScore.toFixed(1)}</td>
        <td>${trendIcon}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary expand-btn" 
                    onclick="toggleDetails(${model.rank})"
                    data-bs-toggle="tooltip" 
                    title="View Details">
                <i class="bi bi-chevron-down"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Toggle model details
function toggleDetails(rank) {
    const model = modelsData.find(m => m.rank === rank);
    const row = document.getElementById(`model-${rank}`);
    const nextRow = row.nextElementSibling;
    
    // Check if details row already exists
    if (nextRow && nextRow.classList.contains('details-row')) {
        nextRow.remove();
        return;
    }
    
    // Create details row
    if (model.details) {
        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('details-row');
        detailsRow.innerHTML = `
            <td colspan="9">
                <div class="p-3">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="mb-3">Test Results</h6>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Total Tests:</span>
                                <strong>${model.details.totalTests}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Passed:</span>
                                <strong class="text-success">${model.details.passed}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Failed:</span>
                                <strong class="text-danger">${model.details.failed}</strong>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h6 class="mb-3">Category Scores</h6>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Algorithms:</span>
                                <strong>${model.details.categories.algorithms}%</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Data Structures:</span>
                                <strong>${model.details.categories.dataStructures}%</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>System Design:</span>
                                <strong>${model.details.categories.systemDesign}%</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Debugging:</span>
                                <strong>${model.details.categories.debugging}%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        `;
        row.parentNode.insertBefore(detailsRow, row.nextSibling);
    }
}

// Initialize charts
function initializeCharts() {
    // ASL Score Bar Chart
    const aslCtx = document.getElementById('aslChart');
    if (aslCtx) {
        const top10Models = modelsData.slice(0, 10);
        
        aslChart = new Chart(aslCtx, {
            type: 'bar',
            data: {
                labels: top10Models.map(m => m.name),
                datasets: [{
                    label: 'ASL Score',
                    data: top10Models.map(m => m.aslScore),
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
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
                                return `ASL Score: ${context.raw.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Category Performance Radar Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        const top3Models = modelsData.slice(0, 3).filter(m => m.details);
        
        if (top3Models.length > 0) {
            categoryChart = new Chart(categoryCtx, {
                type: 'radar',
                data: {
                    labels: ['Algorithms', 'Data Structures', 'System Design', 'Debugging'],
                    datasets: top3Models.map((model, index) => ({
                        label: model.name,
                        data: [
                            model.details.categories.algorithms,
                            model.details.categories.dataStructures,
                            model.details.categories.systemDesign,
                            model.details.categories.debugging
                        ],
                        backgroundColor: `rgba(${index * 80}, ${99 + index * 40}, ${235 - index * 50}, 0.2)`,
                        borderColor: `rgba(${index * 80}, ${99 + index * 40}, ${235 - index * 50}, 1)`,
                        borderWidth: 2
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

// Apply filters
function applyFilters() {
    const orgFilter = document.getElementById('orgFilter').value;
    const scoreFilter = document.getElementById('scoreFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Clear current search
    dataTable.search('').columns().search('');
    
    // Apply organization filter
    if (orgFilter) {
        dataTable.column(2).search(orgFilter);
    }
    
    // Apply score range filter
    if (scoreFilter) {
        const [min, max] = scoreFilter.split('-').map(Number);
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            const score = parseFloat(data[3]) || 0;
            return score >= min && score <= max;
        });
    } else {
        $.fn.dataTable.ext.search.pop();
    }
    
    // Apply sorting
    let columnIndex = 3; // Default to ASL Score
    switch(sortBy) {
        case 'success':
            columnIndex = 4;
            break;
        case 'time':
            columnIndex = 5;
            break;
        case 'robustness':
            columnIndex = 6;
            break;
    }
    dataTable.order([columnIndex, 'desc']).draw();
}

// Export data functions
function exportData(format) {
    let data = '';
    let filename = '';
    
    if (format === 'csv') {
        data = convertToCSV(modelsData);
        filename = 'evaloop_leaderboard.csv';
        downloadFile(data, filename, 'text/csv');
    } else if (format === 'json') {
        data = JSON.stringify(modelsData, null, 2);
        filename = 'evaloop_leaderboard.json';
        downloadFile(data, filename, 'application/json');
    }
}

// Convert data to CSV
function convertToCSV(data) {
    const headers = ['Rank', 'Model', 'Organization', 'ASL Score', 'Success Rate', 'Avg Time', 'Robustness Score'];
    const rows = data.map(m => [
        m.rank,
        m.name,
        m.organization,
        m.aslScore,
        m.successRate,
        m.avgTime,
        m.robustnessScore
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
}

// Download file
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Show BibTeX modal
function showBibTeX() {
    const modal = new bootstrap.Modal(document.getElementById('bibtexModal'));
    modal.show();
}

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexContent = document.getElementById('bibtexContent').textContent;
    navigator.clipboard.writeText(bibtexContent).then(() => {
        // Show success feedback
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check-circle"></i> Copied!';
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('btn-success');
        }, 2000);
    });
}

// Populate comparison dropdowns
function populateComparisonDropdowns() {
    const select1 = document.getElementById('compareModel1');
    const select2 = document.getElementById('compareModel2');
    
    modelsData.forEach(model => {
        const option1 = new Option(`${model.rank}. ${model.name}`, model.rank);
        const option2 = new Option(`${model.rank}. ${model.name}`, model.rank);
        select1.add(option1);
        select2.add(option2);
    });
    
    // Add change event listeners
    select1.addEventListener('change', compareModels);
    select2.addEventListener('change', compareModels);
}

// Compare models
function compareModels() {
    const rank1 = parseInt(document.getElementById('compareModel1').value);
    const rank2 = parseInt(document.getElementById('compareModel2').value);
    
    if (!rank1 || !rank2) {
        document.getElementById('comparisonResult').innerHTML = '';
        return;
    }
    
    const model1 = modelsData.find(m => m.rank === rank1);
    const model2 = modelsData.find(m => m.rank === rank2);
    
    const comparisonHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0">${model1.name}</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <strong>ASL Score:</strong> 
                            <span class="float-end badge bg-primary">${model1.aslScore.toFixed(1)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>Success Rate:</strong> 
                            <span class="float-end">${model1.successRate.toFixed(1)}%</span>
                        </div>
                        <div class="mb-2">
                            <strong>Avg Time:</strong> 
                            <span class="float-end">${model1.avgTime.toFixed(2)}s</span>
                        </div>
                        <div class="mb-2">
                            <strong>Robustness:</strong> 
                            <span class="float-end">${model1.robustnessScore.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-secondary text-white">
                        <h6 class="mb-0">${model2.name}</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <strong>ASL Score:</strong> 
                            <span class="float-end badge bg-secondary">${model2.aslScore.toFixed(1)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>Success Rate:</strong> 
                            <span class="float-end">${model2.successRate.toFixed(1)}%</span>
                        </div>
                        <div class="mb-2">
                            <strong>Avg Time:</strong> 
                            <span class="float-end">${model2.avgTime.toFixed(2)}s</span>
                        </div>
                        <div class="mb-2">
                            <strong>Robustness:</strong> 
                            <span class="float-end">${model2.robustnessScore.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 p-3 bg-light rounded">
            <h6>Comparison Summary</h6>
            <p class="mb-1">
                <strong>ASL Score Difference:</strong> 
                ${Math.abs(model1.aslScore - model2.aslScore).toFixed(1)} points
                ${model1.aslScore > model2.aslScore ? 
                    `<span class="text-success">(${model1.name} leads)</span>` : 
                    `<span class="text-success">(${model2.name} leads)</span>`}
            </p>
            <p class="mb-1">
                <strong>Performance Gap:</strong> 
                ${Math.abs(model1.successRate - model2.successRate).toFixed(1)}% success rate difference
            </p>
            <p class="mb-0">
                <strong>Speed Comparison:</strong> 
                ${model1.avgTime < model2.avgTime ? 
                    `${model1.name} is ${((model2.avgTime - model1.avgTime) / model2.avgTime * 100).toFixed(1)}% faster` :
                    `${model2.name} is ${((model1.avgTime - model2.avgTime) / model1.avgTime * 100).toFixed(1)}% faster`}
            </p>
        </div>
    `;
    
    document.getElementById('comparisonResult').innerHTML = comparisonHTML;
}

// Initialize event listeners
function initializeEventListeners() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Show error message
function showError(message) {
    const container = document.querySelector('.container');
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(alert, container.firstChild);
}
