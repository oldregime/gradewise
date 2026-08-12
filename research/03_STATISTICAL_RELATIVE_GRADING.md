# Research Report 03: Statistical Analysis & Relative Grading Engine

---

## 1. Introduction to Relative Grading & Psychometrics

In higher education and competitive examinations, absolute grading ($Score = \frac{Earned}{Total} \times 100$) can be misleading due to varying exam difficulty, strictness of grading, or class baseline performance.

**GradeWise** incorporates a comprehensive **Relative Grading & Psychometric Engine** that allows educators to normalize grades, fit bell curves, and analyze exam reliability scientifically.

---

## 2. Statistical Formulas & Algorithms

### 📊 1. Descriptive Class Statistics
For a dataset of student scores $X = \{x_1, x_2, \dots, x_N\}$:
* **Mean ($\mu$)**: 
  $$\mu = \frac{1}{N} \sum_{i=1}^{N} x_i$$
* **Standard Deviation ($\sigma$)**:
  $$\sigma = \sqrt{\frac{1}{N-1} \sum_{i=1}^{N} (x_i - \mu)^2}$$
* **Median ($M$) & Interquartile Range ($IQR$)**: $IQR = Q_3 - Q_1$, used for robust non-parametric analysis.

---

### 📈 2. Relative Grading Curves (Normal / Gaussian Fitting)

#### **A. Z-Score Standardization**
Transforms raw student score $x_i$ into standard normal distribution unit $z_i$:
$$z_i = \frac{x_i - \mu}{\sigma}$$

#### **B. Target Grade Mapping via Normal Distribution Curve**
Map $z_i$ to letter grades ($S, A, B, C, D, F$) based on standard deviation thresholds:
* **Grade S (Outstanding)**: $z_i \ge +1.5\sigma$
* **Grade A (Excellent)**: $+0.8\sigma \le z_i < +1.5\sigma$
* **Grade B (Very Good)**: $+0.0\sigma \le z_i < +0.8\sigma$
* **Grade C (Good)**: $-0.8\sigma \le z_i < +0.0\sigma$
* **Grade D (Pass)**: $-1.5\sigma \le z_i < -0.8\sigma$
* **Grade F (Fail)**: $z_i < -1.5\sigma$

*Note: Teachers can interactively adjust the mean $\mu_{target}$ and standard deviation $\sigma_{target}$ sliders in the GradeWise dashboard to preview grade shifts in real time.*

---

### 🎯 3. Item Analysis (Question Difficulty & Discrimination)

For each question $j$:

#### **A. Difficulty Index ($P_j$)**
Measures how easy or hard question $j$ was for the class:
$$P_j = \frac{\bar{x}_j}{MaxMarks_j}$$
* $P_j > 0.85$: Very Easy (Consider pruning in future tests).
* $0.30 \le P_j \le 0.85$: Ideal Difficulty Range.
* $P_j < 0.30$: Very Difficult (Potential grading leniency or re-teaching needed).

#### **B. Discrimination Index ($D_j$)**
Measures how well question $j$ distinguishes top performers (top 27%) from bottom performers (bottom 27%):
$$D_j = \frac{\bar{x}_{j, Upper27\%} - \bar{x}_{j, Lower27\%}}{MaxMarks_j}$$
* $D_j \ge 0.40$: Excellent Discrimination.
* $0.30 \le D_j < 0.40$: Good Discrimination.
* $0.20 \le D_j < 0.30$: Fair (Needs minor review).
* $D_j < 0.20$: Poor Discrimination (Flawed question or ambiguous rubric).

---

### 🛡️ 4. Exam Reliability: Cronbach’s Alpha ($\alpha$)

Measures internal consistency across all questions:
$$\alpha = \frac{K}{K - 1} \left( 1 - \frac{\sum_{j=1}^{K} \sigma_{qj}^2}{\sigma_{Total}^2} \right)$$
where:
* $K$ = Total number of questions.
* $\sigma_{qj}^2$ = Variance of scores on question $j$.
* $\sigma_{Total}^2$ = Variance of total exam scores.

*Rule of thumb*: $\alpha \ge 0.80$ indicates a highly reliable exam format.
