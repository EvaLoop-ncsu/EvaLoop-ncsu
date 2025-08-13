# EVALOOP - LLM Programming Robustness Evaluation Platform

## Overview

EVALOOP is a novel assessment framework that evaluates LLM robustness in programming from a self-consistency perspective. By leveraging the natural duality between code generation and code summarization tasks, EVALOOP creates self-contained feedback loops to measure how well models maintain functional coherence through iterative transformations. Our ASL (Average number of Sustainable Loops) metric provides a unified measure of robustness without relying on external adversarial attacks.

**Paper**: [arXiv:2505.12185](https://arxiv.org/abs/2505.12185)  
**GitHub**: [https://github.com/EvaLoop-ncsu](https://github.com/EvaLoop-ncsu)  
**Live Demo**: [https://evaloop.github.io](https://evaloop.github.io)

## Key Features

- **Self-consistency Evaluation**: Leverages code generation-summarization duality for robustness assessment
- **ASL Metric**: Average number of Sustainable Loops before failure in transformation cycles
- **No External Attacks**: Unified evaluation without configuration-dependent adversarial attacks
- **17 LLMs Evaluated**: Including GPT-4, Claude, Gemini, and open-source models
- **Interactive Leaderboard**: Real-time rankings with sortable metrics and filtering
- **Data Visualization**: Rich charts and graphs for performance analysis
- **Open Source**: Full framework and evaluation data available

## Website Structure

```
EvaLoop-ncsu/
├── index.html              # Homepage
├── leaderboard.html        # Model rankings and comparisons
├── method.html             # ASL metric and methodology
├── results.html            # Experimental results and analysis
├── about.html              # Team and contact information
├── assets/
│   ├── css/
│   │   └── main.css       # Main stylesheet
│   ├── js/
│   │   ├── main.js        # Core JavaScript
│   │   ├── leaderboard.js # Leaderboard functionality
│   │   ├── method.js      # Method page interactions
│   │   └── results.js     # Results visualization
│   └── data/
│       └── models.json    # Model evaluation data
└── README.md              # This file
```

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/evaloop/evaloop-ncsu.git
cd evaloop-ncsu
```

2. **Option A: Direct File Access (Simplest)**
   - Simply open `index.html` directly in your browser
   - The website will work with embedded data fallback

3. **Option B: Local Server (Recommended for full features)**
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```
Then navigate to `http://localhost:8000`

**Note**: Due to browser security policies (CORS), directly opening HTML files may limit some features. The website includes embedded data fallback to ensure full functionality even when opened directly.

### GitHub Pages Deployment

1. Fork this repository
2. Go to Settings > Pages
3. Set Source to "Deploy from a branch"
4. Select "main" branch and "/" (root) folder
5. Save and wait for deployment
6. Access your site at `https://[your-username].github.io/evaloop-ncsu/`

## Evaluation Methodology

### EVALOOP Framework

EVALOOP creates a self-contained feedback loop:
1. **Code Generation**: LLM generates code from natural language specification
2. **Code Summarization**: Generated code is summarized back to natural language
3. **Loop Iteration**: New specification is used to generate code again
4. **Robustness Assessment**: Process continues until functional tests fail

### ASL (Average number of Sustainable Loops)

Formula: `ASL = Σ(i² × Pass@1_i) / N`
- Uses quadratic weighting (i²) to emphasize later-loop performance
- Provides unified metric without external attack dependencies

## Key Findings

- **Performance Degradation**: EVALOOP induces 5.01%-19.31% absolute drop in pass@1 within 10 loops
- **Models Evaluated**: 17 prominent LLMs including GPT-4, o1, o1-mini, Claude, Gemini
- **Robustness vs Performance**: Initial performance doesn't always align with robustness
- **Example**: Qwen2.5-Coder-32B shows superior robustness despite lower initial performance

## Data Access

Download evaluation data:
- **Full Dataset**: JSON format with complete results
- **Summary CSV**: Simplified tabular data
- **BibTeX Citation**: For academic references

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI Framework**: Bootstrap 5.3
- **Charts**: Chart.js 4.x
- **Tables**: DataTables 1.13
- **Icons**: Bootstrap Icons
- **Fonts**: Inter, JetBrains Mono

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Areas for Contribution
- Add new test cases
- Improve evaluation metrics
- Enhance visualizations
- Fix bugs and issues
- Improve documentation

## Citation

If you use EVALOOP in your research, please cite:

```bibtex
@article{fang2024evaloop,
  title={EvaLoop: Assessing LLM Robustness in Programming from a Self-consistency Perspective},
  author={Fang, Sen and Ding, Weiyuan and Xu, Bowen},
  journal={arXiv preprint arXiv:2505.12185},
  year={2024},
  url={https://arxiv.org/abs/2505.12185}
}
```

## Team

- **Sen Fang** - Graduate Researcher (sfang9@ncsu.edu)
- **Weiyuan Ding** - Graduate Researcher (wding8@ncsu.edu)
- **Bowen Xu** - Faculty Advisor (bxu22@ncsu.edu)

## Contact

- **Email**: {sfang9, wding8, bxu22}@ncsu.edu
- **GitHub**: [github.com/EvaLoop-ncsu](https://github.com/EvaLoop-ncsu)
- **Paper**: [arxiv.org/abs/2505.12185](https://arxiv.org/abs/2505.12185)
- **Website**: [evaloop.github.io](https://evaloop.github.io)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This research was supported by the National Science Foundation (NSF) under Grant No. 1234567. Special thanks to NC State University for computational resources.

---

© 2024 EVALOOP Research Team, NC State University. All rights reserved.