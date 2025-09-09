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
                "rankChange": "+2",
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
                "rankChange": "+1",
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
        pageLength: 50,
        order: [[3, 'desc']], // Sort by ASL Score by default
        columnDefs: [
            { className: 'text-center', targets: [0, 3, 4, 5, 6] },
            { orderable: false, targets: [0, 1, 2] }, // Disable sorting for Rank, Model, Organization
            { orderable: true, targets: [3, 4, 5, 6] } // Enable sorting for score columns
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

// Generate rank change indicator from model data
function getRankChange(model) {
    if (!model.rankChange) {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    }
    
    const rankChangeStr = model.rankChange.toString();
    
    if (rankChangeStr.startsWith('+')) {
        const change = rankChangeStr.substring(1);
        return `<span class="rank-change rank-up" title="Up ${change} positions">↗${change}</span>`;
    } else if (rankChangeStr.startsWith('-')) {
        const change = rankChangeStr.substring(1);
        return `<span class="rank-change rank-down" title="Down ${change} positions">↘${change}</span>`;
    } else if (rankChangeStr === '=') {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    } else {
        // Handle cases without + or - prefix (assume positive)
        return `<span class="rank-change rank-up" title="Up ${rankChangeStr} positions">↗${rankChangeStr}</span>`;
    }
}

// Generate rank change indicator for robustness score
function getRobustnessRankChange(model) {
    if (!model.rankByRobustnessChange) {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    }
    
    const rankChangeStr = model.rankByRobustnessChange.toString();
    
    if (rankChangeStr.startsWith('+')) {
        const change = rankChangeStr.substring(1);
        return `<span class="rank-change rank-up" title="Up ${change} positions">↗${change}</span>`;
    } else if (rankChangeStr.startsWith('-')) {
        const change = rankChangeStr.substring(1);
        return `<span class="rank-change rank-down" title="Down ${change} positions">↘${change}</span>`;
    } else if (rankChangeStr === '=') {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    } else {
        // Handle cases without + or - prefix (assume positive)
        return `<span class="rank-change rank-up" title="Up ${rankChangeStr} positions">↗${rankChangeStr}</span>`;
    }
}

// Generate rank change indicator for semantic similarity score
function getSemanticRankChange(model) {
    if (!model.rankBySemanticSimilarityChange) {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    }
    
    const rankChangeStr = model.rankBySemanticSimilarityChange.toString();
    
    if (rankChangeStr.startsWith('+')) {
        const change = rankChangeStr.substring(1);
        return `<span class="rank-change rank-up" title="Up ${change} positions">↗${change}</span>`;
    } else if (rankChangeStr.startsWith('-')) {
        const change = rankChangeStr.substring(1);
        return `<span class="rank-change rank-down" title="Down ${change} positions">↘${change}</span>`;
    } else if (rankChangeStr === '=') {
        return `<span class="rank-change rank-stable" title="No change">—</span>`;
    } else {
        // Handle cases without + or - prefix (assume positive)
        return `<span class="rank-change rank-up" title="Up ${rankChangeStr} positions">↗${rankChangeStr}</span>`;
    }
}

// Create table row
function createTableRow(model) {
    const row = document.createElement('tr');
    row.id = `model-${model.rank}`;
    
    // Add clickable functionality if link exists
    if (model.link) {
        row.style.cursor = 'pointer';
        row.title = `Click to visit ${model.name} page`;
        row.addEventListener('click', function(e) {
            // Don't trigger if clicking on interactive elements
            if (!e.target.closest('.sortable-header, .expand-btn, .rank-change')) {
                window.open(model.link, '_blank');
            }
        });
        
        // Add hover effect
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    }
    
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
            <strong>${model.name}</strong>${model.link ? ' <i class="bi bi-box-arrow-up-right text-muted" style="font-size: 0.8rem;" title="Click to open model page"></i>' : ''}
        </td>
        <td>${model.organization || 'N/A'}</td>
        <td class="score-cell">
            <span class="badge bg-primary">${model.aslScore.toFixed(3)}</span>
            ${getRankChange(model)}
        </td>
        <td class="score-cell">
            <span class="badge bg-success">${model.robustnessScore.toFixed(3)}</span>
            ${getRobustnessRankChange(model)}
        </td>
        <td class="score-cell">
            <span class="badge bg-info">${model.semanticSimilarityScore.toFixed(3)}</span>
            ${getSemanticRankChange(model)}
        </td>
        <td>${(model.successRate * 100).toFixed(1)}%</td>
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
                            <td colspan="7">
                                <div class="p-3">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h6 class="mb-3">Model Performance</h6>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Rank:</span>
                                                <strong>#${model.rank}</strong>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>ASL Std:</span>
                                                <strong class="text-primary">${model.aslScore.toFixed(3)}</strong>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>ASL Base (Robustness):</span>
                                                <strong class="text-success">${model.robustnessScore.toFixed(3)}</strong>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>ASL Semantic:</span>
                                                <strong class="text-info">${model.semanticSimilarityScore.toFixed(3)}</strong>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Success Rate:</span>
                                                <strong class="text-success">${(model.successRate * 100).toFixed(1)}%</strong>
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
                    label: 'ASL Std',
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
                                return `ASL Std: ${context.raw.toFixed(3)}`;
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
                    labels: ['ASL Std', 'Success Rate', 'ASL Base', 'ASL Semantic'],
                    datasets: top5Models.map((model, index) => ({
                        label: model.name,
                        data: [
                            model.aslScore,
                            model.successRate * 100,
                            model.robustnessScore,
                            model.semanticSimilarityScore
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
    
    // Clear any existing score range filters
    $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(function(fn) {
        return fn.name !== 'scoreRangeFilter';
    });
    
    // Apply score range filter
    if (scoreFilter) {
        const [min, max] = scoreFilter.split('-').map(Number);
        const scoreRangeFilter = function(settings, data, dataIndex) {
            const score = parseFloat(data[3]) || 0;
            return score >= min && score <= max;
        };
        scoreRangeFilter.name = 'scoreRangeFilter';
        $.fn.dataTable.ext.search.push(scoreRangeFilter);
    }
    
    // Apply sorting
    let columnIndex = 3; // Default to ASL Std
    switch(sortBy) {
        case 'aslStd':
            columnIndex = 3; // ASL Std
            break;
        case 'aslBase':
            columnIndex = 4; // ASL Base
            break;
        case 'aslSemantic':
            columnIndex = 5; // ASL Semantic
            break;
        case 'success':
            columnIndex = 6; // Pass Rate
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
    const headers = ['Rank', 'Model', 'Organization', 'ASL Std', 'ASL Base', 'ASL Semantic', 'Pass Rate'];
    const rows = data.map(m => [
        m.rank,
        m.name,
        m.organization || '',
        m.aslScore.toFixed(3),
        m.robustnessScore.toFixed(3),
        m.semanticSimilarityScore.toFixed(3),
        (m.successRate * 100).toFixed(1)
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
                            <strong>ASL Std:</strong> 
                            <span class="float-end badge bg-primary">${model1.aslScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>ASL Base:</strong> 
                            <span class="float-end badge bg-success">${model1.robustnessScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>ASL Semantic:</strong> 
                            <span class="float-end badge bg-info">${model1.semanticSimilarityScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>Success Rate:</strong> 
                            <span class="float-end">${(model1.successRate * 100).toFixed(1)}%</span>
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
                            <strong>ASL Std:</strong> 
                            <span class="float-end badge bg-secondary">${model2.aslScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>ASL Base:</strong> 
                            <span class="float-end badge bg-success">${model2.robustnessScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>ASL Semantic:</strong> 
                            <span class="float-end badge bg-info">${model2.semanticSimilarityScore.toFixed(3)}</span>
                        </div>
                        <div class="mb-2">
                            <strong>Success Rate:</strong> 
                            <span class="float-end">${(model2.successRate * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 p-3 bg-light rounded">
            <h6>Comparison Summary</h6>
            <p class="mb-1">
                <strong>ASL Std Difference:</strong> 
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
    
    // Add click event listeners to sortable headers
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.addEventListener('click', function() {
            const columnIndex = parseInt(this.getAttribute('data-column'));
            handleColumnSort(columnIndex, this);
        });
    });
}

// Handle column sorting with toggle between asc/desc
function handleColumnSort(columnIndex, headerElement) {
    // Check current sort state stored as data attribute
    let currentSort = headerElement.getAttribute('data-sort') || 'none';
    let sortDirection = 'asc'; // Default to descending (bigger to smaller)
    
    // Toggle sort direction
    if (currentSort === 'asc') {
        sortDirection = 'desc';
    } else {
        sortDirection = 'asc';
    }
    
    // Clear all sort states from headers
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.removeAttribute('data-sort');
        header.style.backgroundColor = '';
    });
    
    // Set current sort state and visual feedback
    headerElement.setAttribute('data-sort', sortDirection);
    headerElement.style.backgroundColor = '#e3f2fd';
    
    // Apply the sort to DataTable
    if (dataTable) {
        dataTable.order([columnIndex, sortDirection]).draw();
    }
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
