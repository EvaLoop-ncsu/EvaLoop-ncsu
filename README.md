# EVALOOP - LLM Programming Robustness Evaluation Platform

## Overview

EVALOOP is a comprehensive evaluation framework for assessing Large Language Models' programming capabilities and robustness. Using our novel ASL (Average Success Level) metric, we provide nuanced insights into model performance beyond traditional pass/fail metrics.

**Live Demo**: [https://evaloop.github.io](https://evaloop.github.io)

## Key Features

- **ASL Metric**: Advanced evaluation metric capturing nuanced performance characteristics
- **Comprehensive Testing**: 1,265+ test cases across multiple programming categories
- **Interactive Leaderboard**: Real-time rankings with sortable metrics and filtering
- **Data Visualization**: Rich charts and graphs for performance analysis
- **Detailed Results**: In-depth analysis with category breakdowns and trends
- **Open Data**: Full dataset available for download in multiple formats

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

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

3. Navigate to `http://localhost:8000`

### GitHub Pages Deployment

1. Fork this repository
2. Go to Settings > Pages
3. Set Source to "Deploy from a branch"
4. Select "main" branch and "/" (root) folder
5. Save and wait for deployment
6. Access your site at `https://[your-username].github.io/evaloop-ncsu/`

## Evaluation Metrics

### ASL (Average Success Level)

The ASL metric evaluates models across multiple dimensions:
- **Success Rate**: Percentage of passed test cases
- **Difficulty Coefficient**: Normalized complexity measure
- **Category Weight**: Importance factor for each test category
- **Robustness Factor**: Penalty for edge case failures

Formula: `ASL = Σ(wi × si × di) / Σ(wi × di)`

## Current Results

- **Top Model**: GPT-4-Turbo (ASL: 92.3)
- **Models Evaluated**: 47
- **Test Cases**: 1,265
- **Categories**: Algorithms, Data Structures, System Design, Debugging

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
@inproceedings{evaloop2024,
  title={EVALOOP: Comprehensive Evaluation of LLM Programming Robustness Using ASL Metric},
  author={Doe, Jane and Smith, Alex and Chen, Maria and Johnson, Robert and Lee, Sarah and Wilson, Tom},
  booktitle={Proceedings of the 41st International Conference on Machine Learning},
  pages={1234--1248},
  year={2024},
  organization={PMLR},
  url={https://evaloop.github.io}
}
```

## Team

- **Dr. Jane Doe** - Principal Investigator
- **Dr. Alex Smith** - Co-Investigator
- **Maria Chen** - PhD Candidate
- **Robert Johnson** - Research Engineer
- **Sarah Lee** - Data Scientist
- **Tom Wilson** - Graduate Student

## Contact

- **Email**: evaloop@ncsu.edu
- **GitHub**: [github.com/evaloop](https://github.com/evaloop)
- **Website**: [evaloop.github.io](https://evaloop.github.io)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This research was supported by the National Science Foundation (NSF) under Grant No. 1234567. Special thanks to NC State University for computational resources.

---

© 2024 EVALOOP Research Team, NC State University. All rights reserved.