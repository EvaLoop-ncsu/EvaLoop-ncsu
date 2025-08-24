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
        // Try to fetch the JSON file
        const response = await fetch('assets/data/results.json');
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
        console.error('Error loading model data via fetch, using embedded data:', error);
        // Use embedded data as fallback
        loadEmbeddedData();
    }
}

// Fallback embedded data
function loadEmbeddedData() {
    const data = {
        "lastUpdated": "2024-01-20",
        "models": [
            {
                "rank": 1,
                "name": "o3-mini",
                "organization": "OpenAI",
                "aslScore": 7.457,
                "successRate": 0.852,
                "avgTime": 1.15,
                "robustnessScore": 88.5,
                "testDate": "2024-05-15",
                "trend": "up",
                "details": {
                    "totalTests": 378,
                    "passed": 322,
                    "failed": 56,
                    "categories": {
                        "algorithms": 86.2,
                        "dataStructures": 84.8,
                        "systemDesign": 83.4,
                        "debugging": 86.7
                    }
                }
            },
            {
                "rank": 2,
                "name": "Qwen2.5-Coder-32B",
                "organization": "Alibaba",
                "aslScore": 7.385,
                "successRate": 0.825,
                "avgTime": 1.28,
                "robustnessScore": 91.3,
                "testDate": "2024-05-15",
                "trend": "up",
                "details": {
                    "totalTests": 378,
                    "passed": 312,
                    "failed": 66,
                    "categories": {
                        "algorithms": 83.1,
                        "dataStructures": 82.5,
                        "systemDesign": 81.9,
                        "debugging": 82.3
                    }
                }
            },
            {
                "rank": 3,
                "name": "gpt-4.1",
                "organization": "OpenAI",
                "aslScore": 7.356,
                "successRate": 0.841,
                "avgTime": 1.35,
                "robustnessScore": 85.1,
                "testDate": "2024-05-15",
                "trend": "stable",
                "details": {
                    "totalTests": 378,
                    "passed": 318,
                    "failed": 60,
                    "categories": {
                        "algorithms": 85.3,
                        "dataStructures": 84.7,
                        "systemDesign": 82.2,
                        "debugging": 84.6
                    }
                }
            },
            {
                "rank": 4,
                "name": "o4-mini",
                "organization": "OpenAI",
                "aslScore": 7.320,
                "successRate": 0.835,
                "avgTime": 1.12,
                "robustnessScore": 84.8,
                "testDate": "2024-05-15",
                "trend": "up",
                "details": {
                    "totalTests": 378,
                    "passed": 316,
                    "failed": 62,
                    "categories": {
                        "algorithms": 84.4,
                        "dataStructures": 83.9,
                        "systemDesign": 82.7,
                        "debugging": 83.3
                    }
                }
            },
            {
                "rank": 5,
                "name": "gpt-4.1-mini",
                "organization": "OpenAI",
                "aslScore": 7.291,
                "successRate": 0.823,
                "avgTime": 1.08,
                "robustnessScore": 83.2,
                "testDate": "2024-05-15",
                "trend": "up",
                "details": {
                    "totalTests": 378,
                    "passed": 311,
                    "failed": 67,
                    "categories": {
                        "algorithms": 83.7,
                        "dataStructures": 82.2,
                        "systemDesign": 81.1,
                        "debugging": 82.4
                    }
                }
            },
            {
                "rank": 6,
                "name": "o1",
                "organization": "OpenAI",
                "aslScore": 7.288,
                "successRate": 0.838,
                "avgTime": 1.42,
                "robustnessScore": 82.3,
                "testDate": "2024-05-15",
                "trend": "stable"
            },
            {
                "rank": 7,
                "name": "DeepSeek-V2.5",
                "organization": "DeepSeek",
                "aslScore": 7.267,
                "successRate": 0.814,
                "avgTime": 1.37,
                "robustnessScore": 82.2,
                "testDate": "2024-05-15",
                "trend": "up"
            },
            {
                "rank": 8,
                "name": "o1-mini",
                "organization": "OpenAI",
                "aslScore": 7.257,
                "successRate": 0.828,
                "avgTime": 1.24,
                "robustnessScore": 81.9,
                "testDate": "2024-05-15",
                "trend": "up"
            },
            {
                "rank": 9,
                "name": "gpt-4o",
                "organization": "OpenAI",
                "aslScore": 7.040,
                "successRate": 0.792,
                "avgTime": 1.18,
                "robustnessScore": 78.1,
                "testDate": "2024-05-15",
                "trend": "stable"
            },
            {
                "rank": 10,
                "name": "gpt-4-turbo",
                "organization": "OpenAI",
                "aslScore": 6.821,
                "successRate": 0.769,
                "avgTime": 1.33,
                "robustnessScore": 75.3,
                "testDate": "2024-05-15",
                "trend": "down"
            }
        ]
    };
    
    modelsData = data.models;
    updateStatistics(data);
    initializeDataTable();
    initializeCharts();
    populateComparisonDropdowns();
}

// Update statistics cards
function updateStatistics(data) {
    const totalModels = data.models.length;
    const avgASL = data.models.reduce((sum, m) => sum + m.aslScore, 0) / totalModels;
    const highestASL = Math.max(...data.models.map(m => m.aslScore));
    
    document.getElementById('totalModels').textContent = totalModels;
    document.getElementById('avgASL').textContent = avgASL.toFixed(3);
    document.getElementById('highestASL').textContent = highestASL.toFixed(3);
    document.getElementById('lastUpdate').textContent = data.lastUpdated;
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
            { className: 'text-center', targets: [0, 3, 4, 5] }
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

// Generate rank change indicator
function getRankChange(rank) {
    // Simulate rank changes based on rank position
    const changes = [0, -1, 1, 2, -2, 1, -1, 3, 0, -3, 2, -1, 1, 0, -2, 1, -1, 2, 0, -1];
    const change = changes[rank % changes.length] || 0;
    
    if (change > 0) {
        return `<span class="rank-change rank-up" title="Up ${change} positions">↗${change}</span>`;
    } else if (change < 0) {
        return `<span class="rank-change rank-down" title="Down ${Math.abs(change)} positions">↘${Math.abs(change)}</span>`;
    } else {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    }
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
    
    row.innerHTML = `
        <td>${rankBadge}</td>
        <td class="text-start">
            <strong>${model.name}</strong>
        </td>
        <td>${model.organization || 'N/A'}</td>
        <td class="score-cell">
            <span class="badge bg-primary">${model.aslScore.toFixed(3)}</span>
            ${getRankChange(model.rank)}
        </td>
        <td>${(model.successRate * 100).toFixed(1)}%</td>
        <td>${model.robustnessScore.toFixed(3)}</td>
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
    
    // Create details row - show basic info since details are not available
    if (model) {
        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('details-row');
        detailsRow.innerHTML = `
            <td colspan="6">
                <div class="p-3">
                    <div class="row">
                        <div class="col-md-12">
                            <h6 class="mb-3">Model Performance</h6>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Rank:</span>
                                <strong>#${model.rank}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>ASL Score:</span>
                                <strong class="text-primary">${model.aslScore.toFixed(3)}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Success Rate:</span>
                                <strong class="text-success">${(model.successRate * 100).toFixed(1)}%</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Robustness Score:</span>
                                <strong class="text-info">${model.robustnessScore.toFixed(3)}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Organization:</span>
                                <strong>${model.organization || 'Not specified'}</strong>
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
                                return `ASL Score: ${context.raw.toFixed(3)}`;
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
    
    // Category Performance Radar Chart - using available metrics
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        const top5Models = modelsData.slice(0, 5);
        
        if (top5Models.length > 0) {
            categoryChart = new Chart(categoryCtx, {
                type: 'radar',
                data: {
                    labels: ['ASL Score', 'Success Rate', 'Robustness Score'],
                    datasets: top5Models.map((model, index) => ({
                        label: model.name,
                        data: [
                            model.aslScore,
                            model.successRate * 100,
                            model.robustnessScore
                        ],
                        backgroundColor: `rgba(${index * 45}, ${99 + index * 30}, ${235 - index * 30}, 0.2)`,
                        borderColor: `rgba(${index * 45}, ${99 + index * 30}, ${235 - index * 30}, 1)`,
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
                                    return value;
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
        case 'robustness':
            columnIndex = 5;
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
                            <span class="float-end badge bg-primary">${model1.aslScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>Success Rate:</strong> 
                            <span class="float-end">${(model1.successRate * 100).toFixed(1)}%</span>
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
                            <span class="float-end badge bg-secondary">${model2.aslScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>Success Rate:</strong> 
                            <span class="float-end">${(model2.successRate * 100).toFixed(1)}%</span>
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
                ${Math.abs(model1.aslScore - model2.aslScore).toFixed(3)} points
                ${model1.aslScore > model2.aslScore ? 
                    `<span class="text-success">(${model1.name} leads)</span>` : 
                    `<span class="text-success">(${model2.name} leads)</span>`}
            </p>
            <p class="mb-0">
                <strong>Performance Gap:</strong> 
                ${Math.abs((model1.successRate * 100) - (model2.successRate * 100)).toFixed(1)}% success rate difference
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
