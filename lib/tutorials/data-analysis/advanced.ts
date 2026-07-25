import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'da-stats-essentials',
    title: 'Statistics Essentials for Analysts',
    description:
      'Learn the statistical thinking analysts use to make decisions, quantify uncertainty, and avoid overclaiming from data.',
    level: 'advanced',
    section: 'Decision Skills',
    order: 49,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Advanced analysis is not only about writing more pandas code. It is about making better decisions under uncertainty. Statistics gives analysts a shared language for signal, noise, risk, and confidence.',
      },
      {
        type: 'p',
        text: 'A useful analyst does not say only what happened. A useful analyst explains how sure we are, what could be misleading, and what action the evidence supports.',
      },
      { type: 'h2', text: 'The analyst statistics mindset' },
      {
        type: 'ul',
        items: [
          'Describe the data before judging it.',
          'Compare like with like before claiming a difference.',
          'Separate random variation from meaningful change.',
          'State assumptions clearly.',
          'Turn results into decisions, not just numbers.',
        ],
      },
      { type: 'h2', text: 'Population, sample, and metric' },
      {
        type: 'p',
        text: 'A population is the full group you care about. A sample is the part you actually observe. A metric is the number you calculate to represent something important about that group.',
      },
      {
        type: 'table',
        headers: ['Concept', 'Example', 'Analyst question'],
        rows: [
          ['Population', 'All active customers', 'Who are we trying to understand?'],
          ['Sample', 'Customers who answered a survey', 'Is this group representative?'],
          ['Metric', 'Average order value', 'Does this number match the business goal?'],
          ['Segment', 'New customers vs returning customers', 'Should groups be analyzed separately?'],
        ],
      },
      { type: 'h2', text: 'Descriptive vs inferential statistics' },
      {
        type: 'p',
        text: 'Descriptive statistics summarize the data you have. Inferential statistics help you reason about a larger population or a future outcome from a limited sample.',
      },
      {
        type: 'code',
        title: 'Descriptive statistics in pandas',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "North", "South", "South", "West", "West"],
    "revenue": [1200, 1350, 980, 1040, 1600, 1580],
    "orders": [25, 28, 20, 22, 31, 30],
})

summary = sales.groupby("region").agg(
    total_revenue=("revenue", "sum"),
    avg_order_value=("revenue", "mean"),
    total_orders=("orders", "sum"),
)

print(summary)`,
      },
      { type: 'h2', text: 'Signal, noise, and uncertainty' },
      {
        type: 'p',
        text: 'Signal is the pattern you care about. Noise is the natural variation that makes the signal harder to see. Uncertainty is the honest range of what may be true.',
      },
      {
        type: 'note',
        text: 'A small change in a metric is not automatically important. Ask whether it is large enough to matter, stable enough to trust, and connected to a decision.',
      },
      { type: 'h2', text: 'Use confidence intervals for better reporting' },
      {
        type: 'p',
        text: 'A confidence interval gives a plausible range for a metric. It is often more useful than a single point estimate because it shows uncertainty directly.',
      },
      {
        type: 'code',
        title: 'Approximate confidence interval for a mean',
        language: 'python',
        code: `import math
import pandas as pd

ratings = pd.Series([4.2, 3.9, 4.8, 4.5, 4.1, 3.8, 4.6, 4.4, 4.0, 4.7])

mean = ratings.mean()
std_error = ratings.std(ddof=1) / math.sqrt(len(ratings))
margin = 1.96 * std_error

print("mean:", round(mean, 2))
print("95% interval:", round(mean - margin, 2), "to", round(mean + margin, 2))`,
      },
      { type: 'h2', text: 'Practical checklist before a decision' },
      {
        type: 'ol',
        items: [
          'Define the decision the analysis should support.',
          'Define the metric and confirm it matches the decision.',
          'Check the data source, sample size, and missing values.',
          'Compare relevant segments, not only the overall average.',
          'Estimate uncertainty with intervals, tests, or sensitivity checks.',
          'Explain the recommendation and the risk of being wrong.',
        ],
      },
      {
        type: 'try',
        text: 'Take a recent metric from your work or practice data. Write one sentence for the point estimate, one sentence for uncertainty, and one sentence for the decision it supports.',
      },
      {
        type: 'keypoints',
        items: [
          'Statistics helps analysts reason from imperfect data.',
          'A sample must be judged against the population you care about.',
          'Confidence intervals show uncertainty better than single numbers.',
          'Good analysis connects statistical evidence to a clear decision.',
        ],
      },
    ],
  },
  {
    slug: 'da-distributions-stats',
    title: 'Distributions, Mean/Median/Variance',
    description:
      'Understand distributions and summary statistics so you can describe data accurately and avoid misleading averages.',
    level: 'advanced',
    section: 'Decision Skills',
    order: 50,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'A distribution shows how values are spread. Before you compare groups or build a model, you should understand the shape of the data.',
      },
      {
        type: 'p',
        text: 'Many analysis mistakes come from using one summary number for data that has outliers, skew, multiple groups, or unusual missing values.',
      },
      { type: 'h2', text: 'Common distribution shapes' },
      {
        type: 'table',
        headers: ['Shape', 'What it means', 'Example'],
        rows: [
          ['Symmetric', 'Values spread evenly around the center', 'Heights in a similar adult population'],
          ['Right-skewed', 'A few very large values pull the tail right', 'Income, order value, session length'],
          ['Left-skewed', 'A few very small values pull the tail left', 'Scores on an easy test'],
          ['Bimodal', 'Two peaks suggest two groups mixed together', 'New users and power users in one chart'],
        ],
      },
      { type: 'h2', text: 'Mean, median, and mode' },
      {
        type: 'p',
        text: 'The mean is the arithmetic average. The median is the middle value after sorting. The mode is the most common value. Each answers a different question.',
      },
      {
        type: 'code',
        title: 'Mean vs median with an outlier',
        language: 'python',
        code: `import pandas as pd

order_values = pd.Series([18, 22, 24, 25, 28, 30, 32, 500])

print("mean:", order_values.mean())
print("median:", order_values.median())
print("mode:", order_values.mode().tolist())`,
      },
      {
        type: 'warning',
        text: 'If a distribution is strongly skewed, the mean may describe the total business impact, while the median may describe the typical customer experience. Report the one that matches your question.',
      },
      { type: 'h2', text: 'Variance and standard deviation' },
      {
        type: 'p',
        text: 'Variance and standard deviation measure spread. Standard deviation is often easier to explain because it uses the same unit as the original data.',
      },
      {
        type: 'code',
        title: 'Spread measures',
        language: 'python',
        code: `import pandas as pd

delivery_days = pd.Series([2, 2, 3, 3, 3, 4, 5, 9])

print("range:", delivery_days.max() - delivery_days.min())
print("variance:", round(delivery_days.var(ddof=1), 2))
print("standard deviation:", round(delivery_days.std(ddof=1), 2))
print("interquartile range:", delivery_days.quantile(0.75) - delivery_days.quantile(0.25))`,
      },
      { type: 'h2', text: 'Percentiles and quartiles' },
      {
        type: 'p',
        text: 'Percentiles show position inside a distribution. The 90th percentile is the value that 90 percent of observations are at or below.',
      },
      {
        type: 'code',
        title: 'Percentiles for service time',
        language: 'python',
        code: `import pandas as pd

minutes_to_resolve = pd.Series([4, 5, 6, 7, 7, 9, 12, 15, 18, 40])

print(minutes_to_resolve.quantile([0.25, 0.50, 0.75, 0.90]))`,
      },
      { type: 'h2', text: 'Visualize the distribution' },
      {
        type: 'code',
        title: 'Histogram and box plot',
        language: 'python',
        code: `import pandas as pd
import matplotlib.pyplot as plt

values = pd.Series([18, 22, 24, 25, 28, 30, 32, 500])

fig, axes = plt.subplots(1, 2, figsize=(9, 3))
values.plot(kind="hist", bins=8, ax=axes[0], title="Histogram")
values.plot(kind="box", ax=axes[1], title="Box plot")
plt.tight_layout()
plt.show()`,
      },
      {
        type: 'tip',
        text: 'Always pair summary statistics with at least one distribution view. A histogram, box plot, or percentile table can reveal what the average hides.',
      },
      {
        type: 'keypoints',
        items: [
          'A distribution describes the full pattern of values.',
          'The mean is sensitive to outliers; the median is more resistant.',
          'Standard deviation and interquartile range summarize spread.',
          'Percentiles are useful for service levels, risk, and customer experience.',
        ],
      },
    ],
  },
  {
    slug: 'da-hypothesis',
    title: 'Hypothesis Testing Basics',
    description:
      'Use hypothesis tests carefully to compare groups, interpret p-values, and decide when an observed difference is likely meaningful.',
    level: 'advanced',
    section: 'Decision Skills',
    order: 51,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Hypothesis testing helps you decide whether an observed difference is surprising under a baseline assumption. It is useful when you compare groups, campaigns, product changes, or time periods.',
      },
      {
        type: 'p',
        text: 'The goal is not to turn analysis into a magic yes or no machine. The goal is to reduce guesswork and make uncertainty visible.',
      },
      { type: 'h2', text: 'Null and alternative hypotheses' },
      {
        type: 'p',
        text: 'The null hypothesis usually says there is no effect or no difference. The alternative hypothesis says there is a difference, improvement, decline, or relationship.',
      },
      {
        type: 'table',
        headers: ['Business question', 'Null hypothesis', 'Alternative hypothesis'],
        rows: [
          ['Did the new checkout improve conversion?', 'Conversion is the same', 'Conversion changed or improved'],
          ['Are support times different by region?', 'Mean support time is equal', 'At least one region differs'],
          ['Did churn decrease after onboarding emails?', 'Churn rate is unchanged', 'Churn rate decreased'],
        ],
      },
      { type: 'h2', text: 'The p-value in plain language' },
      {
        type: 'p',
        text: 'A p-value is the probability of seeing a result this extreme, or more extreme, if the null hypothesis were true. A small p-value means the observed result would be unusual under the null.',
      },
      {
        type: 'warning',
        text: 'A p-value does not measure the size of the effect, the probability that the hypothesis is true, or whether the result matters to the business.',
      },
      { type: 'h2', text: 'One simple t-test example' },
      {
        type: 'p',
        text: 'A t-test compares means while accounting for sample variation. Use it when you have numeric outcomes and want to compare two groups.',
      },
      {
        type: 'code',
        title: 'Compare average order value between two groups',
        language: 'python',
        code: `import pandas as pd
from scipy import stats

control = pd.Series([42, 39, 45, 41, 40, 44, 38, 43, 41, 40])
new_page = pd.Series([46, 47, 44, 49, 45, 48, 46, 50, 43, 47])

result = stats.ttest_ind(new_page, control, equal_var=False)
effect = new_page.mean() - control.mean()

print("control mean:", round(control.mean(), 2))
print("new page mean:", round(new_page.mean(), 2))
print("difference:", round(effect, 2))
print("p-value:", round(result.pvalue, 4))`,
      },
      { type: 'h2', text: 'Statistical significance vs practical significance' },
      {
        type: 'p',
        text: 'A result can be statistically significant but too small to matter. A result can also be practically large but statistically uncertain because the sample is small.',
      },
      {
        type: 'code',
        title: 'Add effect size thinking',
        language: 'python',
        code: `baseline_conversion = 0.082
new_conversion = 0.087
monthly_visitors = 120000
average_margin = 18

extra_conversions = (new_conversion - baseline_conversion) * monthly_visitors
estimated_margin = extra_conversions * average_margin

print("extra conversions:", round(extra_conversions))
print("estimated monthly margin:", round(estimated_margin, 2))`,
      },
      { type: 'h2', text: 'Common testing mistakes' },
      {
        type: 'ul',
        items: [
          'Testing after looking at many slices and reporting only the best result.',
          'Stopping a test early because the p-value briefly looks good.',
          'Ignoring sample size and assuming no significance means no effect.',
          'Using tests on dirty data without checking missing values and outliers.',
          'Confusing correlation with causation.',
        ],
      },
      {
        type: 'note',
        text: 'Hypothesis tests are strongest when the question, metric, sample, and decision rule are written down before looking at the result.',
      },
      {
        type: 'keypoints',
        items: [
          'The null hypothesis is the baseline assumption.',
          'A p-value tells you how surprising the result is under the null.',
          'Report effect size and business impact along with significance.',
          'Testing decisions should be planned before results are inspected.',
        ],
      },
    ],
  },
  {
    slug: 'da-ab-testing',
    title: 'A/B Testing Intro for Analysts',
    description:
      'Plan, analyze, and communicate simple A/B tests with clear metrics, clean experiment data, and responsible conclusions.',
    level: 'advanced',
    section: 'Decision Skills',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'An A/B test compares two or more versions of an experience using randomized assignment. Analysts use A/B tests to estimate whether a change caused a metric to move.',
      },
      {
        type: 'p',
        text: 'Good A/B analysis starts before data arrives. You need a hypothesis, primary metric, guardrail metrics, sample plan, and decision rule.',
      },
      { type: 'h2', text: 'Parts of an A/B test' },
      {
        type: 'table',
        headers: ['Part', 'Meaning', 'Example'],
        rows: [
          ['Variant', 'The experience shown to a user', 'Old checkout vs new checkout'],
          ['Randomization unit', 'What gets assigned', 'User, account, session, store'],
          ['Primary metric', 'Metric used for the decision', 'Purchase conversion rate'],
          ['Guardrail metric', 'Metric that must not get worse', 'Refund rate, page load time'],
          ['Minimum detectable effect', 'Smallest useful change', '0.5 percentage point lift'],
        ],
      },
      { type: 'h2', text: 'Create a small experiment dataset' },
      {
        type: 'code',
        title: 'Sample A/B data',
        language: 'python',
        code: `import pandas as pd

experiment = pd.DataFrame({
    "variant": ["control", "control", "control", "control", "test", "test", "test", "test"],
    "visitors": [1000, 980, 1020, 995, 1010, 1005, 990, 1000],
    "conversions": [82, 79, 88, 80, 92, 91, 89, 95],
    "refunds": [6, 5, 7, 5, 8, 6, 7, 8],
})

summary = experiment.groupby("variant").sum(numeric_only=True)
summary["conversion_rate"] = summary["conversions"] / summary["visitors"]
summary["refund_rate"] = summary["refunds"] / summary["conversions"]

print(summary)`,
      },
      { type: 'h2', text: 'Test a difference in proportions' },
      {
        type: 'p',
        text: 'For conversion rates, analysts often compare two proportions. The example below uses a normal approximation for an introductory analysis.',
      },
      {
        type: 'code',
        title: 'Two-proportion z-test',
        language: 'python',
        code: `import math
from statsmodels.stats.proportion import proportions_ztest

conversions = [329, 367]
visitors = [3995, 4005]

z_stat, p_value = proportions_ztest(count=conversions, nobs=visitors, alternative="two-sided")

control_rate = conversions[0] / visitors[0]
test_rate = conversions[1] / visitors[1]
lift = test_rate - control_rate

pooled = sum(conversions) / sum(visitors)
se = math.sqrt(pooled * (1 - pooled) * (1 / visitors[0] + 1 / visitors[1]))

print("control:", round(control_rate, 4))
print("test:", round(test_rate, 4))
print("absolute lift:", round(lift, 4))
print("z-stat:", round(z_stat, 3))
print("p-value:", round(p_value, 4))
print("approx 95% interval:", round(lift - 1.96 * se, 4), "to", round(lift + 1.96 * se, 4))`,
      },
      { type: 'h2', text: 'Guardrails and segmentation' },
      {
        type: 'p',
        text: 'A winning primary metric can still hide harm. Check guardrails such as errors, refunds, cancellations, page speed, support contacts, or long-term retention.',
      },
      {
        type: 'code',
        title: 'Segment readout',
        language: 'python',
        code: `import pandas as pd

segment_results = pd.DataFrame({
    "segment": ["new", "returning", "mobile", "desktop"],
    "control_rate": [0.052, 0.118, 0.071, 0.096],
    "test_rate": [0.060, 0.121, 0.081, 0.094],
})

segment_results["absolute_lift"] = segment_results["test_rate"] - segment_results["control_rate"]
segment_results["relative_lift_pct"] = segment_results["absolute_lift"] / segment_results["control_rate"] * 100

print(segment_results.sort_values("absolute_lift", ascending=False))`,
      },
      {
        type: 'warning',
        text: 'Do not keep slicing the test until something looks significant. Segment analysis is useful for diagnosis, but the main decision should use the preselected primary metric.',
      },
      { type: 'h2', text: 'A/B test readout template' },
      {
        type: 'ol',
        items: [
          'Restate the hypothesis and primary decision metric.',
          'Show sample size, dates, assignment unit, and exclusions.',
          'Report control and test metric values.',
          'Report absolute lift, relative lift, confidence interval, and p-value.',
          'Check guardrail metrics and important segments.',
          'Recommend ship, do not ship, continue, or redesign.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'A/B tests estimate causal impact through random assignment.',
          'Define success metrics and decision rules before the test starts.',
          'Use conversion counts and visitor counts for proportion tests.',
          'Always review guardrails before recommending launch.',
        ],
      },
    ],
  },
  {
    slug: 'da-ml-bridge',
    title: 'From Analysis to Machine Learning',
    description:
      'See how data analysis connects to machine learning through features, labels, baselines, evaluation, and responsible model use.',
    level: 'advanced',
    section: 'Decision Skills',
    order: 53,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Machine learning is not a replacement for analysis. It is a continuation of analysis when the goal changes from explaining the past to predicting, ranking, classifying, or recommending.',
      },
      {
        type: 'p',
        text: 'Analysts are well positioned to move into machine learning because they already know how to ask questions, clean data, define metrics, and explain results.',
      },
      { type: 'h2', text: 'Analysis questions vs machine learning questions' },
      {
        type: 'table',
        headers: ['Analysis question', 'Machine learning version', 'Typical output'],
        rows: [
          ['Why did churn increase?', 'Which customers are likely to churn?', 'Risk score'],
          ['Which products sell together?', 'What product should we recommend next?', 'Ranked list'],
          ['How many tickets arrived last month?', 'How many tickets will arrive tomorrow?', 'Forecast'],
          ['Which orders were refunded?', 'Which new orders may be fraudulent?', 'Probability'],
        ],
      },
      { type: 'h2', text: 'Features, labels, and leakage' },
      {
        type: 'p',
        text: 'A feature is an input column used by a model. A label is the target the model learns to predict. Leakage happens when a feature includes information that would not be available at prediction time.',
      },
      {
        type: 'warning',
        text: 'Leakage can make a model look excellent in testing and fail in production. If the column is known only after the decision point, it cannot be used as a feature.',
      },
      {
        type: 'code',
        title: 'Build a simple feature table',
        language: 'python',
        code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3, 4],
    "orders_last_30d": [0, 3, 1, 5],
    "days_since_last_order": [90, 7, 24, 3],
    "support_tickets_last_30d": [2, 0, 1, 0],
    "churned_next_30d": [1, 0, 0, 0],
})

features = customers[["orders_last_30d", "days_since_last_order", "support_tickets_last_30d"]]
label = customers["churned_next_30d"]

print(features)
print(label)`,
      },
      { type: 'h2', text: 'Start with a baseline' },
      {
        type: 'p',
        text: 'A baseline is a simple approach that a model must beat. For classification, a baseline may predict the most common class. For forecasting, it may predict that tomorrow equals today.',
      },
      {
        type: 'code',
        title: 'Baseline accuracy',
        language: 'python',
        code: `import pandas as pd

y_true = pd.Series([0, 0, 1, 0, 1, 0, 0, 1, 0, 0])
baseline_prediction = y_true.mode()[0]
y_pred = pd.Series([baseline_prediction] * len(y_true))

accuracy = (y_true == y_pred).mean()
print("baseline prediction:", baseline_prediction)
print("baseline accuracy:", accuracy)`,
      },
      { type: 'h2', text: 'Evaluation depends on the decision' },
      {
        type: 'table',
        headers: ['Problem', 'Useful metrics', 'Decision focus'],
        rows: [
          ['Classification', 'Precision, recall, F1, ROC AUC', 'Cost of false positives vs false negatives'],
          ['Regression', 'MAE, RMSE, R-squared', 'Typical error and large-error penalty'],
          ['Forecasting', 'MAE, MAPE, backtesting error', 'Future planning under time order'],
          ['Ranking', 'Precision at k, recall at k, NDCG', 'Quality of top recommendations'],
        ],
      },
      {
        type: 'code',
        title: 'Tiny classification model',
        language: 'python',
        code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
import pandas as pd

df = pd.DataFrame({
    "visits": [1, 2, 5, 8, 1, 0, 7, 4, 9, 2, 3, 6],
    "days_since_seen": [40, 20, 5, 2, 70, 90, 3, 12, 1, 45, 30, 8],
    "tickets": [2, 1, 0, 0, 3, 2, 0, 1, 0, 2, 1, 0],
    "churned": [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0],
})

X = df[["visits", "days_since_seen", "tickets"]]
y = df["churned"]

X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=7, stratify=y)
model = RandomForestClassifier(random_state=7, n_estimators=50)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print(classification_report(y_test, predictions, zero_division=0))`,
      },
      {
        type: 'note',
        text: 'This tiny model is for structure, not production quality. Real modeling needs more data, careful validation, monitoring, and domain review.',
      },
      {
        type: 'keypoints',
        items: [
          'Machine learning extends analysis toward prediction and automation.',
          'Features must be available at the time the prediction is made.',
          'Always compare models against a simple baseline.',
          'Evaluation metrics should match the decision and business cost.',
        ],
      },
    ],
  },
  {
    slug: 'da-pandas-performance',
    title: 'Speeding Up pandas',
    description:
      'Improve pandas workflows with profiling, vectorization, better dtypes, chunking, indexing, and memory-aware habits.',
    level: 'advanced',
    section: 'Scale & Tools',
    order: 54,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'pandas is fast enough for many analysis projects, but slow code can appear when data grows, loops are used heavily, or memory usage is ignored.',
      },
      {
        type: 'p',
        text: 'Performance work should begin with measurement. Do not optimize a line because it looks slow. Time it, inspect memory, and improve the bottleneck.',
      },
      { type: 'h2', text: 'Measure before changing code' },
      {
        type: 'code',
        title: 'Quick timing in a notebook',
        language: 'python',
        code: `import pandas as pd
import time

df = pd.DataFrame({
    "price": range(1, 1_000_001),
    "discount": [0.10, 0.15, 0.20, 0.05] * 250000,
})

start = time.perf_counter()
df["net_price"] = df["price"] * (1 - df["discount"])
elapsed = time.perf_counter() - start

print("seconds:", round(elapsed, 4))`,
      },
      { type: 'h2', text: 'Prefer vectorized operations' },
      {
        type: 'p',
        text: 'Vectorized operations work on whole columns at once. They are usually faster and clearer than row-by-row loops.',
      },
      {
        type: 'code',
        title: 'Avoid row loops when possible',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({
    "subtotal": [100, 80, 40],
    "shipping": [5, 0, 8],
    "tax_rate": [0.08, 0.08, 0.07],
})

# Fast column operation
orders["total"] = (orders["subtotal"] + orders["shipping"]) * (1 + orders["tax_rate"])

print(orders)`,
      },
      { type: 'h2', text: 'Use efficient dtypes' },
      {
        type: 'p',
        text: 'Data types affect memory. Smaller numeric types, categorical columns, and parsed dates can make a large dataset easier to work with.',
      },
      {
        type: 'code',
        title: 'Inspect and reduce memory',
        language: 'python',
        code: `import pandas as pd

df = pd.DataFrame({
    "region": ["North", "South", "North", "West"] * 250000,
    "units": [1, 2, 3, 4] * 250000,
})

before = df.memory_usage(deep=True).sum()

df["region"] = df["region"].astype("category")
df["units"] = pd.to_numeric(df["units"], downcast="integer")

after = df.memory_usage(deep=True).sum()

print("before MB:", round(before / 1_000_000, 2))
print("after MB:", round(after / 1_000_000, 2))`,
      },
      { type: 'h2', text: 'Read only what you need' },
      {
        type: 'code',
        title: 'Selective CSV loading',
        language: 'python',
        code: `import pandas as pd

columns = ["order_id", "order_date", "region", "revenue"]

orders = pd.read_csv(
    "orders.csv",
    usecols=columns,
    parse_dates=["order_date"],
    dtype={"region": "category"},
)

print(orders.info())`,
      },
      { type: 'h2', text: 'Process very large files in chunks' },
      {
        type: 'code',
        title: 'Chunked aggregation',
        language: 'python',
        code: `import pandas as pd

totals = []

for chunk in pd.read_csv("orders.csv", chunksize=100_000, usecols=["region", "revenue"]):
    totals.append(chunk.groupby("region")["revenue"].sum())

regional_revenue = pd.concat(totals, axis=1).sum(axis=1).sort_values(ascending=False)
print(regional_revenue)`,
      },
      { type: 'h2', text: 'Practical performance checklist' },
      {
        type: 'ul',
        items: [
          'Filter early and drop unused columns.',
          'Use vectorized column operations instead of row loops.',
          'Convert repeated strings to categorical columns.',
          'Parse dates once, not repeatedly inside loops.',
          'Use chunking when the file does not fit comfortably in memory.',
          'Save intermediate data as Parquet when workflows repeat.',
        ],
      },
      {
        type: 'tip',
        text: 'If a pandas workflow still feels slow after simple fixes, consider SQL pushdown, Polars, DuckDB, Spark, or a warehouse query instead of forcing everything into one DataFrame.',
      },
      {
        type: 'keypoints',
        items: [
          'Measure runtime and memory before optimizing.',
          'Vectorized operations are usually faster than row-wise loops.',
          'Dtypes can dramatically reduce memory usage.',
          'Chunking helps when a file is larger than available memory.',
        ],
      },
    ],
  },
  {
    slug: 'da-polars-intro',
    title: 'Polars Intro (Optional Fast Path)',
    description:
      'Meet Polars, a fast DataFrame library with eager and lazy APIs that can speed up large analytical workflows.',
    level: 'advanced',
    section: 'Scale & Tools',
    order: 55,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Polars is a modern DataFrame library designed for speed, parallel execution, and efficient memory use. It is not required for every analyst, but it is valuable when pandas workflows become slow.',
      },
      {
        type: 'p',
        text: 'If you already know pandas, Polars will feel familiar at a high level: read data, select columns, filter rows, group, aggregate, and join. The syntax is different because expressions are central.',
      },
      { type: 'h2', text: 'Install Polars' },
      {
        type: 'code',
        title: 'Installation',
        language: 'bash',
        code: `python -m pip install polars`,
      },
      { type: 'h2', text: 'Create and query a Polars DataFrame' },
      {
        type: 'code',
        title: 'Polars basics',
        language: 'python',
        code: `import polars as pl

orders = pl.DataFrame({
    "region": ["North", "South", "North", "West"],
    "product": ["A", "A", "B", "B"],
    "revenue": [1200, 900, 1500, 1700],
    "orders": [30, 22, 35, 40],
})

result = (
    orders
    .filter(pl.col("revenue") >= 1000)
    .group_by("region")
    .agg(
        pl.col("revenue").sum().alias("total_revenue"),
        pl.col("orders").sum().alias("total_orders"),
    )
    .sort("total_revenue", descending=True)
)

print(result)`,
      },
      { type: 'h2', text: 'Expressions are reusable instructions' },
      {
        type: 'p',
        text: 'In Polars, expressions describe what should happen to columns. This makes it easier for Polars to optimize work, especially in lazy queries.',
      },
      {
        type: 'code',
        title: 'Derived columns with expressions',
        language: 'python',
        code: `import polars as pl

orders = pl.DataFrame({
    "revenue": [1200, 900, 1500],
    "orders": [30, 22, 35],
})

with_metrics = orders.with_columns(
    (pl.col("revenue") / pl.col("orders")).alias("avg_order_value")
)

print(with_metrics)`,
      },
      { type: 'h2', text: 'Lazy scanning for larger files' },
      {
        type: 'p',
        text: 'Lazy queries build a plan first and execute later. Polars can push filters and selected columns closer to the file read, which can reduce work.',
      },
      {
        type: 'code',
        title: 'Lazy CSV query',
        language: 'python',
        code: `import polars as pl

query = (
    pl.scan_csv("orders.csv")
    .filter(pl.col("order_date") >= "2026-01-01")
    .group_by("region")
    .agg(pl.col("revenue").sum().alias("revenue"))
    .sort("revenue", descending=True)
)

result = query.collect()
print(result)`,
      },
      { type: 'h2', text: 'pandas and Polars side by side' },
      {
        type: 'table',
        headers: ['Task', 'pandas style', 'Polars style'],
        rows: [
          ['Filter rows', 'df[df["x"] > 10]', 'df.filter(pl.col("x") > 10)'],
          ['Create column', 'df["z"] = df["x"] + df["y"]', 'df.with_columns((pl.col("x") + pl.col("y")).alias("z"))'],
          ['Group by', 'df.groupby("region").sum()', 'df.group_by("region").agg(pl.col("revenue").sum())'],
          ['Lazy file read', 'Usually read first', 'scan_csv or scan_parquet'],
        ],
      },
      {
        type: 'note',
        text: 'Polars is an optional fast path. Learn it when you need speed or want modern DataFrame patterns, but keep pandas and SQL strong because they remain widely used.',
      },
      {
        type: 'keypoints',
        items: [
          'Polars is a fast DataFrame library with expression-based syntax.',
          'Lazy queries allow Polars to optimize file scans and transformations.',
          'Polars is useful when pandas workflows become slow or memory-heavy.',
          'The best tool depends on data size, team skills, and deployment needs.',
        ],
      },
    ],
  },
  {
    slug: 'da-big-data-mindset',
    title: 'Big Data Mindset (what changes at scale)',
    description:
      'Learn what changes when data no longer fits comfortably on one machine: storage, compute, sampling, partitioning, cost, and reliability.',
    level: 'advanced',
    section: 'Scale & Tools',
    order: 56,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Big data is not only a larger CSV. At scale, data movement, storage format, query planning, permissions, cost, and reliability become part of the analysis.',
      },
      {
        type: 'p',
        text: 'The mindset shift is simple: stop assuming your laptop is the center of the workflow. Push work to the system that stores or processes the data efficiently.',
      },
      { type: 'h2', text: 'What changes at scale' },
      {
        type: 'table',
        headers: ['Small data habit', 'Scale-aware habit', 'Why it matters'],
        rows: [
          ['Download full files', 'Query only needed columns and rows', 'Reduces transfer and memory'],
          ['Use CSV everywhere', 'Use Parquet or warehouse tables', 'Improves compression and scan speed'],
          ['Rerun everything manually', 'Schedule reproducible jobs', 'Improves reliability'],
          ['Inspect every row', 'Profile, sample, and aggregate', 'Makes exploration practical'],
          ['Ignore query cost', 'Estimate scanned data and runtime', 'Controls cloud bills'],
        ],
      },
      { type: 'h2', text: 'Storage formats matter' },
      {
        type: 'p',
        text: 'CSV is easy to share, but it is row-based, loosely typed, and often slow to scan. Parquet is columnar, compressed, and stores schema information.',
      },
      {
        type: 'code',
        title: 'Convert CSV to Parquet',
        language: 'python',
        code: `import pandas as pd

orders = pd.read_csv("orders.csv", parse_dates=["order_date"])
orders.to_parquet("orders.parquet", index=False)

reloaded = pd.read_parquet("orders.parquet", columns=["order_date", "region", "revenue"])
print(reloaded.head())`,
      },
      { type: 'h2', text: 'Partitioning and pruning' },
      {
        type: 'p',
        text: 'Partitioning stores data in folders or table partitions based on values such as date or region. A query that filters on the partition can skip large amounts of data.',
      },
      {
        type: 'code',
        title: 'Partitioned output example',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({
    "order_date": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-02-01"]),
    "region": ["North", "South", "North"],
    "revenue": [1200, 900, 1500],
})

orders["order_month"] = orders["order_date"].dt.to_period("M").astype(str)
orders.to_parquet("orders_by_month", partition_cols=["order_month"], index=False)`,
      },
      { type: 'h2', text: 'Sampling is a tool, not a shortcut' },
      {
        type: 'p',
        text: 'Sampling helps exploration move faster, but it must preserve the structure needed for your question. A random sample may miss rare fraud, enterprise accounts, or low-volume regions.',
      },
      {
        type: 'code',
        title: 'Stratified sample by segment',
        language: 'python',
        code: `import pandas as pd

df = pd.DataFrame({
    "segment": ["SMB"] * 1000 + ["Enterprise"] * 50,
    "revenue": list(range(1050)),
})

sample = (
    df.groupby("segment", group_keys=False)
    .apply(lambda group: group.sample(frac=0.10, random_state=42))
)

print(sample["segment"].value_counts())`,
      },
      { type: 'h2', text: 'A scale-aware workflow' },
      {
        type: 'ol',
        items: [
          'Start with metadata: table size, columns, partitions, owner, freshness, and grain.',
          'Profile with counts, null rates, date ranges, and distinct values.',
          'Use SQL or warehouse compute for large joins and filters.',
          'Bring only the final narrow result into pandas or visualization tools.',
          'Save repeatable logic as a query, notebook, job, or documented pipeline.',
        ],
      },
      {
        type: 'tip',
        text: 'At scale, the fastest analysis is often the one that avoids moving unnecessary data. Filter early, select fewer columns, and aggregate where the data lives.',
      },
      {
        type: 'keypoints',
        items: [
          'Big data work changes storage, compute, cost, and reliability concerns.',
          'Columnar formats such as Parquet are often better than CSV for analytics.',
          'Partitioning helps systems skip irrelevant data.',
          'Sampling must match the decision and preserve important segments.',
        ],
      },
    ],
  },
  {
    slug: 'da-dashboards',
    title: 'Lightweight Dashboards & Reporting',
    description:
      'Design useful reports and simple dashboards that communicate metrics clearly, refresh safely, and support decisions.',
    level: 'advanced',
    section: 'Communication',
    order: 57,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A dashboard is not a place to display every chart you can make. It is a decision surface. The best dashboards answer a recurring question for a known audience.',
      },
      {
        type: 'p',
        text: 'Lightweight reporting can be a notebook, a static HTML report, a scheduled CSV, a dashboard app, or a BI page. The format matters less than clarity, trust, and maintainability.',
      },
      { type: 'h2', text: 'Start with the audience' },
      {
        type: 'table',
        headers: ['Audience', 'Needs', 'Dashboard focus'],
        rows: [
          ['Executive', 'Fast status and trend', 'Few KPIs, targets, exceptions'],
          ['Operations', 'Daily action list', 'Freshness, filters, drilldowns'],
          ['Marketing', 'Campaign performance', 'Spend, conversion, channel mix'],
          ['Product', 'Behavior and retention', 'Funnels, cohorts, feature adoption'],
        ],
      },
      { type: 'h2', text: 'Dashboard design principles' },
      {
        type: 'ul',
        items: [
          'Put the most important metric first.',
          'Use consistent time ranges and definitions.',
          'Show comparison: previous period, target, forecast, or benchmark.',
          'Include freshness and data source notes.',
          'Prefer clear labels over decorative complexity.',
          'Make exceptions easy to notice.',
        ],
      },
      { type: 'h2', text: 'Create a simple HTML report' },
      {
        type: 'code',
        title: 'Generate a small report from pandas',
        language: 'python',
        code: `import pandas as pd
import matplotlib.pyplot as plt

daily = pd.DataFrame({
    "date": pd.date_range("2026-01-01", periods=7),
    "revenue": [1200, 1350, 1280, 1500, 1620, 1580, 1710],
    "orders": [25, 28, 26, 31, 34, 32, 36],
})

daily["avg_order_value"] = daily["revenue"] / daily["orders"]

ax = daily.plot(x="date", y="revenue", marker="o", title="Daily revenue")
ax.set_xlabel("Date")
ax.set_ylabel("Revenue")
plt.tight_layout()
plt.savefig("daily-revenue.png")

summary = daily.describe().round(2).to_html()

html = f"""
<html>
  <body>
    <h1>Weekly Revenue Report</h1>
    <p>Data through {daily["date"].max().date()}</p>
    <img src="daily-revenue.png" alt="Daily revenue chart" />
    <h2>Summary</h2>
    {summary}
  </body>
</html>
"""

with open("weekly-report.html", "w", encoding="utf-8") as file:
    file.write(html)`,
      },
      { type: 'h2', text: 'Use Streamlit for a lightweight dashboard' },
      {
        type: 'code',
        title: 'Minimal Streamlit app',
        language: 'python',
        code: `import pandas as pd
import streamlit as st

st.title("Sales Dashboard")

sales = pd.DataFrame({
    "region": ["North", "South", "West", "North", "South", "West"],
    "date": pd.to_datetime(["2026-01-01", "2026-01-01", "2026-01-01", "2026-01-02", "2026-01-02", "2026-01-02"]),
    "revenue": [1200, 900, 1500, 1320, 980, 1600],
})

region = st.selectbox("Region", ["All"] + sorted(sales["region"].unique()))

filtered = sales if region == "All" else sales[sales["region"] == region]

st.metric("Revenue", "$" + format(filtered["revenue"].sum(), ",.0f"))
st.line_chart(filtered.groupby("date")["revenue"].sum())`,
      },
      {
        type: 'code',
        title: 'Run the app',
        language: 'bash',
        code: `streamlit run app.py`,
      },
      { type: 'h2', text: 'Reporting quality checklist' },
      {
        type: 'ol',
        items: [
          'Define each metric in plain language.',
          'List the data source and refresh schedule.',
          'Show the date range and timezone.',
          'Use alerts only for changes that need action.',
          'Archive or remove unused dashboards.',
          'Review access permissions for sensitive data.',
        ],
      },
      {
        type: 'warning',
        text: 'A dashboard without ownership becomes stale. Every recurring report should have an owner, a refresh expectation, and a clear way to report data quality issues.',
      },
      {
        type: 'keypoints',
        items: [
          'Dashboards should serve a specific audience and decision.',
          'Good reports include definitions, freshness, and context.',
          'Lightweight tools can be enough for many reporting needs.',
          'Maintainability is part of dashboard quality.',
        ],
      },
    ],
  },
  {
    slug: 'da-ethics-bias',
    title: 'Ethics, Bias & Responsible Analysis',
    description:
      'Practice responsible analysis by identifying bias, protecting privacy, communicating limits, and reducing harm from data decisions.',
    level: 'advanced',
    section: 'Communication',
    order: 58,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Data analysis affects people. A spreadsheet can influence prices, hiring, healthcare, lending, education, policing, product access, and public policy. Responsible analysts think about harm before they publish conclusions.',
      },
      {
        type: 'p',
        text: 'Ethics is not a separate step at the end. It is part of question design, data collection, cleaning, modeling, visualization, and communication.',
      },
      { type: 'h2', text: 'Common sources of bias' },
      {
        type: 'table',
        headers: ['Bias type', 'What happens', 'Example'],
        rows: [
          ['Selection bias', 'The data overrepresents some groups', 'Survey responses mostly from highly engaged users'],
          ['Measurement bias', 'The measurement differs by group', 'App usage excludes people with poor connectivity'],
          ['Survivorship bias', 'Failed or missing cases are ignored', 'Analyzing only customers who stayed'],
          ['Historical bias', 'Past unfairness is encoded in data', 'Previous lending approvals reflect unequal access'],
          ['Confirmation bias', 'Analyst looks for evidence of a preferred answer', 'Only charts that support a launch are shown'],
        ],
      },
      { type: 'h2', text: 'Privacy and minimization' },
      {
        type: 'p',
        text: 'Use only the data needed for the analysis. Remove direct identifiers when they are not required. Limit access to sensitive data and avoid exporting raw personal data when aggregated data is enough.',
      },
      {
        type: 'code',
        title: 'Minimize a customer dataset',
        language: 'python',
        code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [101, 102, 103],
    "email": ["a@example.com", "b@example.com", "c@example.com"],
    "age": [29, 41, 35],
    "city": ["Austin", "Boston", "Austin"],
    "revenue": [120, 80, 200],
})

analysis_view = customers.drop(columns=["email"])
city_summary = analysis_view.groupby("city").agg(
    customers=("customer_id", "count"),
    revenue=("revenue", "sum"),
)

print(city_summary)`,
      },
      { type: 'h2', text: 'Fairness checks for analysts' },
      {
        type: 'p',
        text: 'Even when you are not building machine learning models, compare important outcomes across groups. Look for differences in missingness, error rates, eligibility, access, and impact.',
      },
      {
        type: 'code',
        title: 'Compare outcomes by group',
        language: 'python',
        code: `import pandas as pd

applications = pd.DataFrame({
    "group": ["A", "A", "A", "B", "B", "B", "B"],
    "approved": [1, 1, 0, 1, 0, 0, 0],
    "missing_income": [0, 0, 1, 0, 1, 1, 0],
})

fairness_summary = applications.groupby("group").agg(
    approval_rate=("approved", "mean"),
    missing_income_rate=("missing_income", "mean"),
    count=("approved", "size"),
)

print(fairness_summary)`,
      },
      { type: 'h2', text: 'Communicate uncertainty and limits' },
      {
        type: 'p',
        text: 'Responsible reporting includes limitations. Explain data coverage, exclusions, sample size, known quality issues, and whether the analysis supports correlation or causation.',
      },
      {
        type: 'code',
        title: 'Limitations section template',
        language: 'markdown',
        code: `## Limitations

- Data covers active users only, so churned users are underrepresented.
- Segment labels are self-reported and may contain missing or outdated values.
- The analysis shows association, not proven causation.
- Results should be reviewed again after the next monthly refresh.`,
      },
      { type: 'h2', text: 'Responsible analysis checklist' },
      {
        type: 'ol',
        items: [
          'Ask who could be helped or harmed by the analysis.',
          'Use the minimum data needed for the task.',
          'Check whether important groups are missing or underrepresented.',
          'Compare error, missingness, and outcomes across groups.',
          'Avoid charts that exaggerate effects.',
          'State uncertainty, limitations, and recommended review points.',
          'Escalate sensitive decisions to domain, legal, security, or ethics reviewers when needed.',
        ],
      },
      {
        type: 'note',
        text: 'Responsible analysis is a professional skill. It protects users, organizations, and analysts from decisions that look data-driven but are incomplete or harmful.',
      },
      {
        type: 'keypoints',
        items: [
          'Bias can enter through sampling, measurement, history, and interpretation.',
          'Privacy improves when analysts minimize data access and share aggregates.',
          'Fairness checks compare outcomes and data quality across relevant groups.',
          'Ethical analysis communicates limits, uncertainty, and potential harm.',
        ],
      },
    ],
  },
  {
    slug: 'da-project-sales',
    title: 'Mini Project: Sales Performance Analysis',
    description:
      'Build a complete sales performance analysis from sample data: load, clean, explore, visualize, and conclude with recommendations.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project turns a messy sales table into a business readout. You will create sample data, clean it, explore revenue and margin, visualize results, and write conclusions.',
      },
      {
        type: 'p',
        text: 'The workflow is the same pattern you can reuse in real work: load, clean, explore, visualize, conclude.',
      },
      { type: 'h2', text: 'Project question' },
      {
        type: 'p',
        text: 'Which regions, products, and channels are driving revenue and margin, and where should the business focus next month?',
      },
      { type: 'h2', text: 'Step 1: Create and load sample data' },
      {
        type: 'code',
        title: 'Create a realistic sample sales dataset',
        language: 'python',
        code: `import pandas as pd

raw_sales = pd.DataFrame({
    "order_id": [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010],
    "order_date": ["2026-01-03", "2026-01-04", "2026-01-04", "2026-01-05", "2026-01-06", "2026-01-07", "2026-01-08", "bad-date", "2026-01-10", "2026-01-10"],
    "region": ["North", "South", "West", "North", "South", "West", "North", "South", "West", "North"],
    "channel": ["Online", "Retail", "Online", "Partner", "Online", "Retail", "Online", "Retail", "Partner", "Online"],
    "product": ["Laptop", "Tablet", "Laptop", "Monitor", "Tablet", "Laptop", "Monitor", "Tablet", "Monitor", "Laptop"],
    "units": [2, 3, 1, 4, 5, 2, 3, 2, 6, 1],
    "unit_price": [1200, 420, 1250, 300, 410, 1180, None, 415, 310, 1190],
    "unit_cost": [850, 260, 870, 180, 255, 850, 175, 260, 185, 840],
})

sales = raw_sales.copy()
print(sales.head())`,
      },
      { type: 'h2', text: 'Step 2: Clean and validate' },
      {
        type: 'p',
        text: 'Clean dates, fix missing prices with a product median, and create revenue and margin fields. Keep track of records that need review.',
      },
      {
        type: 'code',
        title: 'Clean the sales data',
        language: 'python',
        code: `sales["order_date"] = pd.to_datetime(sales["order_date"], errors="coerce")

product_price_median = sales.groupby("product")["unit_price"].transform("median")
sales["unit_price"] = sales["unit_price"].fillna(product_price_median)

sales["revenue"] = sales["units"] * sales["unit_price"]
sales["cost"] = sales["units"] * sales["unit_cost"]
sales["gross_margin"] = sales["revenue"] - sales["cost"]
sales["gross_margin_rate"] = sales["gross_margin"] / sales["revenue"]

review_rows = sales[sales["order_date"].isna()]
clean_sales = sales.dropna(subset=["order_date"])

print("rows needing date review:")
print(review_rows[["order_id", "order_date", "product"]])
print(clean_sales.head())`,
      },
      { type: 'h2', text: 'Step 3: Explore performance' },
      {
        type: 'code',
        title: 'Regional and product summaries',
        language: 'python',
        code: `region_summary = (
    clean_sales.groupby("region")
    .agg(
        revenue=("revenue", "sum"),
        gross_margin=("gross_margin", "sum"),
        orders=("order_id", "nunique"),
        units=("units", "sum"),
    )
    .assign(gross_margin_rate=lambda df: df["gross_margin"] / df["revenue"])
    .sort_values("revenue", ascending=False)
)

product_summary = (
    clean_sales.groupby("product")
    .agg(revenue=("revenue", "sum"), gross_margin=("gross_margin", "sum"), units=("units", "sum"))
    .assign(gross_margin_rate=lambda df: df["gross_margin"] / df["revenue"])
    .sort_values("gross_margin", ascending=False)
)

print(region_summary.round(2))
print(product_summary.round(2))`,
      },
      {
        type: 'code',
        title: 'Channel mix and daily trend',
        language: 'python',
        code: `channel_summary = clean_sales.pivot_table(
    index="channel",
    columns="region",
    values="revenue",
    aggfunc="sum",
    fill_value=0,
)

daily_revenue = clean_sales.groupby("order_date")["revenue"].sum()

print(channel_summary)
print(daily_revenue)`,
      },
      { type: 'h2', text: 'Step 4: Visualize' },
      {
        type: 'code',
        title: 'Create charts for the readout',
        language: 'python',
        code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(11, 4))

region_summary["revenue"].plot(kind="bar", ax=axes[0], title="Revenue by region")
axes[0].set_ylabel("Revenue")

product_summary["gross_margin"].plot(kind="bar", ax=axes[1], title="Gross margin by product")
axes[1].set_ylabel("Gross margin")

plt.tight_layout()
plt.show()

daily_revenue.plot(marker="o", title="Daily revenue trend")
plt.ylabel("Revenue")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Step 5: Conclude' },
      {
        type: 'code',
        title: 'Generate simple conclusion bullets',
        language: 'python',
        code: `top_region = region_summary.index[0]
top_product = product_summary.index[0]
best_margin_product = product_summary["gross_margin_rate"].idxmax()

print(f"Top revenue region: {top_region}")
print(f"Top gross margin product: {top_product}")
print(f"Best margin rate product: {best_margin_product}")
print("Recommendation: protect high-margin products, review weak channels, and fix invalid order dates at ingestion.")`,
      },
      {
        type: 'note',
        text: 'In a real project, add context such as monthly targets, prior-period comparison, returns, discounting, and inventory constraints before making budget recommendations.',
      },
      {
        type: 'keypoints',
        items: [
          'A sales project should validate dates, prices, units, and margin calculations.',
          'Revenue and margin can tell different stories.',
          'Pivot tables help compare channel and regional mix.',
          'Conclusions should include recommended action and data quality follow-up.',
        ],
      },
    ],
  },
  {
    slug: 'da-project-customers',
    title: 'Mini Project: Customer Segmentation Analysis',
    description:
      'Segment customers with RFM-style features, compare groups, visualize behavior, and recommend actions for each segment.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Customer segmentation helps teams understand different behavior patterns instead of treating all customers as one average. This project uses recency, frequency, and monetary value features.',
      },
      {
        type: 'p',
        text: 'You will create transactions, clean dates, build customer-level features, assign segments, visualize differences, and conclude with actions.',
      },
      { type: 'h2', text: 'Project question' },
      {
        type: 'p',
        text: 'Which customers are champions, loyal customers, new customers, or at risk, and what should the business do for each group?',
      },
      { type: 'h2', text: 'Step 1: Load sample transaction data' },
      {
        type: 'code',
        title: 'Create customer transactions',
        language: 'python',
        code: `import pandas as pd

transactions = pd.DataFrame({
    "customer_id": [1, 1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8],
    "order_id": [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514],
    "order_date": ["2026-01-02", "2026-02-14", "2026-03-01", "2026-02-01", "2026-02-20", "2025-12-15", "2026-03-03", "2026-03-10", "2026-03-11", "2025-11-10", "2026-01-05", "2026-03-09", "2026-02-25", "2026-03-12"],
    "revenue": [120, 180, 220, 75, 90, 300, 45, 65, 40, 500, 120, 55, 200, 210],
    "channel": ["Email", "Search", "Email", "Social", "Social", "Email", "Search", "Search", "Social", "Email", "Email", "Search", "Partner", "Partner"],
})

transactions["order_date"] = pd.to_datetime(transactions["order_date"])
print(transactions.head())`,
      },
      { type: 'h2', text: 'Step 2: Clean and define the analysis date' },
      {
        type: 'p',
        text: 'Segmentation depends on the reference date. In production, this might be the report date. Here we use one day after the latest order.',
      },
      {
        type: 'code',
        title: 'Validate transaction records',
        language: 'python',
        code: `analysis_date = transactions["order_date"].max() + pd.Timedelta(days=1)

clean_transactions = transactions.drop_duplicates(subset=["order_id"]).copy()
clean_transactions = clean_transactions[clean_transactions["revenue"] >= 0]

print("analysis date:", analysis_date.date())
print("orders:", clean_transactions["order_id"].nunique())
print("customers:", clean_transactions["customer_id"].nunique())`,
      },
      { type: 'h2', text: 'Step 3: Explore and build RFM features' },
      {
        type: 'code',
        title: 'Create recency, frequency, and monetary features',
        language: 'python',
        code: `rfm = (
    clean_transactions.groupby("customer_id")
    .agg(
        last_order_date=("order_date", "max"),
        frequency=("order_id", "nunique"),
        monetary=("revenue", "sum"),
        avg_order_value=("revenue", "mean"),
    )
)

rfm["recency_days"] = (analysis_date - rfm["last_order_date"]).dt.days
rfm = rfm.sort_values(["monetary", "frequency"], ascending=False)

print(rfm.round(2))`,
      },
      {
        type: 'code',
        title: 'Assign simple business segments',
        language: 'python',
        code: `def assign_segment(row):
    if row["frequency"] >= 3 and row["recency_days"] <= 45:
        return "Champion"
    if row["frequency"] >= 2 and row["recency_days"] <= 60:
        return "Loyal"
    if row["recency_days"] <= 14:
        return "New or Recent"
    if row["recency_days"] > 75:
        return "At Risk"
    return "Needs Nurture"

rfm["segment"] = rfm.apply(assign_segment, axis=1)

segment_summary = (
    rfm.groupby("segment")
    .agg(
        customers=("frequency", "size"),
        avg_recency=("recency_days", "mean"),
        avg_frequency=("frequency", "mean"),
        total_revenue=("monetary", "sum"),
    )
    .sort_values("total_revenue", ascending=False)
)

print(segment_summary.round(2))`,
      },
      { type: 'h2', text: 'Step 4: Visualize customer segments' },
      {
        type: 'code',
        title: 'Segment charts',
        language: 'python',
        code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(11, 4))

segment_summary["customers"].plot(kind="bar", ax=axes[0], title="Customers by segment")
axes[0].set_ylabel("Customers")

segment_summary["total_revenue"].plot(kind="bar", ax=axes[1], title="Revenue by segment")
axes[1].set_ylabel("Revenue")

plt.tight_layout()
plt.show()

rfm.plot(kind="scatter", x="recency_days", y="monetary", title="Recency vs monetary value")
plt.xlabel("Recency days")
plt.ylabel("Total revenue")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Step 5: Conclude with actions' },
      {
        type: 'code',
        title: 'Recommended actions by segment',
        language: 'python',
        code: `actions = {
    "Champion": "Invite to loyalty benefits and ask for referrals.",
    "Loyal": "Recommend bundles and early access offers.",
    "New or Recent": "Send onboarding and second-purchase offers.",
    "At Risk": "Send win-back campaign with a clear value message.",
    "Needs Nurture": "Use educational content and lower-pressure reminders.",
}

for segment in segment_summary.index:
    print(segment + ":", actions.get(segment, "Review manually."))`,
      },
      {
        type: 'warning',
        text: 'Segmentation labels are simplifications. Validate them with business partners and avoid targeting that could be invasive, discriminatory, or based on sensitive attributes.',
      },
      {
        type: 'keypoints',
        items: [
          'Customer segmentation should use customer-level features, not only transaction rows.',
          'RFM features are a practical starting point for behavioral segmentation.',
          'Segments need recommended actions to become useful.',
          'Real segmentation should be monitored and validated over time.',
        ],
      },
    ],
  },
  {
    slug: 'da-project-timeseries',
    title: 'Mini Project: Time Series Trends Report',
    description:
      'Create a time series trends report with sample data, cleaning, rolling averages, seasonal comparison, visualization, and conclusions.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Time series analysis focuses on data ordered by time. Common tasks include tracking trends, comparing periods, identifying seasonality, and explaining unusual changes.',
      },
      {
        type: 'p',
        text: 'This project uses daily website sessions and conversions. You will create data, clean gaps, explore trends, visualize, and write a short report.',
      },
      { type: 'h2', text: 'Project question' },
      {
        type: 'p',
        text: 'Are sessions and conversions improving over time, and are there any unusual days that need investigation?',
      },
      { type: 'h2', text: 'Step 1: Create and load sample time series data' },
      {
        type: 'code',
        title: 'Create daily metrics',
        language: 'python',
        code: `import pandas as pd

dates = pd.date_range("2026-01-01", periods=30, freq="D")

traffic = pd.DataFrame({
    "date": dates,
    "sessions": [920, 940, 880, 760, 990, 1010, 1040, 980, 1005, 1030, 900, 870, 1100, 1120, 1160, 1190, 1185, 970, 940, 1210, 1250, 1275, 1300, 1260, 990, 960, 1320, 1350, 1380, 1410],
    "conversions": [62, 65, 59, 48, 70, 72, 74, 66, 68, 71, 60, 58, 79, 82, 84, 87, 85, 64, 61, 88, 91, 93, 95, 92, 66, 63, 97, 99, 101, 104],
})

# Add one duplicate row to simulate a common data issue.
traffic = pd.concat([traffic, traffic.iloc[[10]]], ignore_index=True)

print(traffic.tail())`,
      },
      { type: 'h2', text: 'Step 2: Clean dates, duplicates, and missing days' },
      {
        type: 'code',
        title: 'Clean the time series',
        language: 'python',
        code: `traffic["date"] = pd.to_datetime(traffic["date"])

daily = (
    traffic.drop_duplicates(subset=["date"])
    .set_index("date")
    .sort_index()
)

full_index = pd.date_range(daily.index.min(), daily.index.max(), freq="D")
daily = daily.reindex(full_index)
daily.index.name = "date"

daily[["sessions", "conversions"]] = daily[["sessions", "conversions"]].interpolate()
daily["conversion_rate"] = daily["conversions"] / daily["sessions"]

print(daily.head())
print("missing values after clean:")
print(daily.isna().sum())`,
      },
      { type: 'h2', text: 'Step 3: Explore trends and rolling averages' },
      {
        type: 'code',
        title: 'Trend features',
        language: 'python',
        code: `daily["sessions_7d_avg"] = daily["sessions"].rolling(7).mean()
daily["conversion_rate_7d_avg"] = daily["conversion_rate"].rolling(7).mean()
daily["weekday"] = daily.index.day_name()

weekly = daily.resample("W").agg(
    sessions=("sessions", "sum"),
    conversions=("conversions", "sum"),
)
weekly["conversion_rate"] = weekly["conversions"] / weekly["sessions"]

print(weekly.round(4))`,
      },
      {
        type: 'code',
        title: 'Detect unusual days with z-scores',
        language: 'python',
        code: `session_mean = daily["sessions"].mean()
session_std = daily["sessions"].std(ddof=1)
daily["session_z"] = (daily["sessions"] - session_mean) / session_std

unusual_days = daily[daily["session_z"].abs() >= 1.5]

print(unusual_days[["sessions", "session_z", "conversion_rate"]].round(3))`,
      },
      { type: 'h2', text: 'Step 4: Visualize trends' },
      {
        type: 'code',
        title: 'Sessions and conversion rate charts',
        language: 'python',
        code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 1, figsize=(10, 7), sharex=True)

daily["sessions"].plot(ax=axes[0], alpha=0.35, label="Daily sessions")
daily["sessions_7d_avg"].plot(ax=axes[0], linewidth=2, label="7-day average")
axes[0].set_title("Sessions trend")
axes[0].set_ylabel("Sessions")
axes[0].legend()

daily["conversion_rate"].plot(ax=axes[1], alpha=0.35, label="Daily conversion rate")
daily["conversion_rate_7d_avg"].plot(ax=axes[1], linewidth=2, label="7-day average")
axes[1].set_title("Conversion rate trend")
axes[1].set_ylabel("Conversion rate")
axes[1].legend()

plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Step 5: Conclude' },
      {
        type: 'code',
        title: 'Create trend conclusion',
        language: 'python',
        code: `first_week_sessions = weekly["sessions"].iloc[0]
last_week_sessions = weekly["sessions"].iloc[-1]
session_growth = (last_week_sessions - first_week_sessions) / first_week_sessions

best_week = weekly["conversion_rate"].idxmax().date()

print(f"Sessions grew {session_growth:.1%} from the first week to the last week.")
print(f"Best weekly conversion rate ended on {best_week}.")
print("Investigate unusual low-session days and annotate known campaigns, outages, or holidays.")`,
      },
      {
        type: 'tip',
        text: 'Time series reports become more useful when you annotate events such as launches, campaigns, holidays, outages, price changes, or tracking changes.',
      },
      {
        type: 'keypoints',
        items: [
          'Time series data needs sorted dates, duplicate checks, and missing date handling.',
          'Rolling averages make noisy daily data easier to interpret.',
          'Weekly or monthly resampling can reveal broader patterns.',
          'Conclusions should mention trend, anomalies, and likely next investigations.',
        ],
      },
    ],
  },
  {
    slug: 'da-project-sql-pandas',
    title: 'Mini Project: SQL + pandas Business Report',
    description:
      'Combine SQL and pandas to produce a business report from relational tables with cleaning, exploration, visualization, and conclusions.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Real analyst work often starts in SQL and finishes in pandas. SQL is excellent for filtering, joining, and aggregating where the data lives. pandas is excellent for final shaping, checks, visualization, and report logic.',
      },
      {
        type: 'p',
        text: 'This project creates a small SQLite database, queries business metrics, imports the result into pandas, and writes conclusions.',
      },
      { type: 'h2', text: 'Project question' },
      {
        type: 'p',
        text: 'Which customers and products generated the most revenue, and what does the order pipeline suggest for follow-up?',
      },
      { type: 'h2', text: 'Step 1: Create sample relational data' },
      {
        type: 'code',
        title: 'Create tables with SQLite',
        language: 'python',
        code: `import sqlite3
import pandas as pd

connection = sqlite3.connect(":memory:")

customers = pd.DataFrame({
    "customer_id": [1, 2, 3, 4],
    "customer_name": ["Apex Co", "Bright Labs", "Cedar Shop", "Delta Works"],
    "segment": ["Enterprise", "SMB", "SMB", "Enterprise"],
})

orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105, 106],
    "customer_id": [1, 2, 1, 3, 4, 2],
    "order_date": ["2026-01-05", "2026-01-06", "2026-01-15", "2026-01-20", "2026-01-22", "2026-02-01"],
    "status": ["paid", "paid", "refunded", "paid", "paid", "pending"],
})

order_items = pd.DataFrame({
    "order_id": [101, 101, 102, 103, 104, 105, 105, 106],
    "product": ["Analytics Pro", "Support", "Analytics Lite", "Analytics Pro", "Support", "Analytics Pro", "Training", "Analytics Lite"],
    "quantity": [1, 2, 3, 1, 1, 2, 1, 4],
    "unit_price": [1500, 250, 400, 1500, 250, 1500, 800, 400],
})

customers.to_sql("customers", connection, index=False, if_exists="replace")
orders.to_sql("orders", connection, index=False, if_exists="replace")
order_items.to_sql("order_items", connection, index=False, if_exists="replace")`,
      },
      { type: 'h2', text: 'Step 2: Use SQL to cleanly join and aggregate' },
      {
        type: 'code',
        title: 'SQL business query',
        language: 'sql',
        code: `SELECT
  c.segment,
  c.customer_name,
  oi.product,
  COUNT(DISTINCT o.order_id) AS orders,
  SUM(oi.quantity) AS units,
  SUM(oi.quantity * oi.unit_price) AS gross_revenue
FROM orders AS o
JOIN customers AS c
  ON o.customer_id = c.customer_id
JOIN order_items AS oi
  ON o.order_id = oi.order_id
WHERE o.status = 'paid'
GROUP BY c.segment, c.customer_name, oi.product
ORDER BY gross_revenue DESC;`,
      },
      {
        type: 'code',
        title: 'Load SQL result into pandas',
        language: 'python',
        code: `query = """
SELECT
  c.segment,
  c.customer_name,
  oi.product,
  COUNT(DISTINCT o.order_id) AS orders,
  SUM(oi.quantity) AS units,
  SUM(oi.quantity * oi.unit_price) AS gross_revenue
FROM orders AS o
JOIN customers AS c
  ON o.customer_id = c.customer_id
JOIN order_items AS oi
  ON o.order_id = oi.order_id
WHERE o.status = 'paid'
GROUP BY c.segment, c.customer_name, oi.product
ORDER BY gross_revenue DESC;
"""

report = pd.read_sql_query(query, connection)
print(report)`,
      },
      { type: 'h2', text: 'Step 3: Explore in pandas' },
      {
        type: 'code',
        title: 'Customer and product summaries',
        language: 'python',
        code: `customer_summary = (
    report.groupby(["segment", "customer_name"])
    .agg(revenue=("gross_revenue", "sum"), units=("units", "sum"))
    .sort_values("revenue", ascending=False)
)

product_summary = (
    report.groupby("product")
    .agg(revenue=("gross_revenue", "sum"), units=("units", "sum"), customers=("customer_name", "nunique"))
    .sort_values("revenue", ascending=False)
)

print(customer_summary)
print(product_summary)`,
      },
      {
        type: 'code',
        title: 'Check pending pipeline',
        language: 'python',
        code: `pipeline_query = """
SELECT
  c.customer_name,
  o.order_id,
  o.order_date,
  SUM(oi.quantity * oi.unit_price) AS pending_value
FROM orders AS o
JOIN customers AS c
  ON o.customer_id = c.customer_id
JOIN order_items AS oi
  ON o.order_id = oi.order_id
WHERE o.status = 'pending'
GROUP BY c.customer_name, o.order_id, o.order_date;
"""

pipeline = pd.read_sql_query(pipeline_query, connection, parse_dates=["order_date"])
print(pipeline)`,
      },
      { type: 'h2', text: 'Step 4: Visualize the report' },
      {
        type: 'code',
        title: 'Business report charts',
        language: 'python',
        code: `import matplotlib.pyplot as plt

product_summary["revenue"].plot(kind="bar", title="Revenue by product")
plt.ylabel("Revenue")
plt.tight_layout()
plt.show()

customer_summary.reset_index().plot(
    kind="bar",
    x="customer_name",
    y="revenue",
    title="Revenue by customer",
)
plt.ylabel("Revenue")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Step 5: Conclude' },
      {
        type: 'code',
        title: 'Write summary bullets',
        language: 'python',
        code: `top_product = product_summary.index[0]
top_customer = customer_summary.index.get_level_values("customer_name")[0]
pending_total = pipeline["pending_value"].sum()

print(f"Top product by revenue: {top_product}.")
print(f"Top customer by revenue: {top_customer}.")
print(f"Pending pipeline value: \${pending_total:,.0f}.")
print("Recommendation: follow up on pending orders and review product mix by segment.")`,
      },
      {
        type: 'note',
        text: 'Use SQL for the heavy relational work and pandas for report-specific checks, reshaping, visualization, and narrative. This division keeps projects faster and easier to review.',
      },
      {
        type: 'keypoints',
        items: [
          'SQL and pandas work well together in business reporting.',
          'Use SQL joins and filters to reduce data before loading into pandas.',
          'pandas is useful for final summaries, charts, and conclusion logic.',
          'A business report should include current performance and next follow-up actions.',
        ],
      },
    ],
  },
  {
    slug: 'da-common-mistakes',
    title: 'Common Data Analysis Mistakes (and Fixes)',
    description:
      'Recognize and fix common analysis mistakes involving metrics, data quality, joins, time, visualization, statistics, and communication.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Most analysis mistakes are not caused by one bad chart. They come from unclear questions, misunderstood data, hidden assumptions, or conclusions that outrun the evidence.',
      },
      {
        type: 'p',
        text: 'Advanced analysts build checks into their workflow so mistakes are caught before a stakeholder uses the result.',
      },
      { type: 'h2', text: 'Mistake 1: Starting without a decision' },
      {
        type: 'p',
        text: 'If the question is vague, the analysis will drift. Start by writing the decision, audience, metric, time period, and expected action.',
      },
      {
        type: 'code',
        title: 'Analysis brief template',
        language: 'markdown',
        code: `## Analysis brief

Decision:
Audience:
Primary metric:
Time period:
Segments:
Known limitations:
Recommended action needed by:`,
      },
      { type: 'h2', text: 'Mistake 2: Trusting joins without validation' },
      {
        type: 'code',
        title: 'Validate join row counts',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({"order_id": [1, 2, 3], "customer_id": [10, 20, 20]})
customers = pd.DataFrame({"customer_id": [10, 20], "segment": ["SMB", "Enterprise"]})

joined = orders.merge(customers, on="customer_id", how="left", validate="many_to_one")

print("orders:", len(orders))
print("joined:", len(joined))
print("missing customer rows:", joined["segment"].isna().sum())`,
      },
      { type: 'h2', text: 'Mistake 3: Ignoring time definitions' },
      {
        type: 'p',
        text: 'Dates need definitions: event time or processing time, timezone, fiscal calendar, inclusive or exclusive endpoints, and whether the data is complete for the latest period.',
      },
      {
        type: 'code',
        title: 'Avoid partial-period confusion',
        language: 'python',
        code: `import pandas as pd

daily = pd.DataFrame({
    "date": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03"]),
    "revenue": [100, 140, 20],
    "is_complete_day": [True, True, False],
})

complete_daily = daily[daily["is_complete_day"]]
print(complete_daily["revenue"].sum())`,
      },
      { type: 'h2', text: 'Mistake 4: Using misleading charts' },
      {
        type: 'ul',
        items: [
          'Truncated axes can exaggerate small differences.',
          'Pie charts become hard to read with many categories.',
          'Dual-axis charts can imply relationships that are not real.',
          'Too many colors can hide the main point.',
          'Missing labels force readers to guess.',
        ],
      },
      { type: 'h2', text: 'Mistake 5: Reporting correlation as causation' },
      {
        type: 'p',
        text: 'Correlation means two variables move together. Causation means one variable produced a change in another. Causation usually needs experimental design, natural experiments, or strong domain evidence.',
      },
      {
        type: 'warning',
        text: 'Use careful language: associated with, correlated with, higher among, or lower among. Reserve caused by for designs that support causal claims.',
      },
      { type: 'h2', text: 'Mistake 6: Hiding uncertainty' },
      {
        type: 'p',
        text: 'Single numbers can sound more certain than they are. Add sample size, confidence intervals, sensitivity checks, or scenario ranges when the decision is important.',
      },
      { type: 'h2', text: 'Pre-publish review checklist' },
      {
        type: 'ol',
        items: [
          'Can a non-technical reader understand the question and recommendation?',
          'Are metric definitions included?',
          'Are filters, exclusions, and date ranges stated?',
          'Were joins validated and missing values reviewed?',
          'Are charts labeled clearly and honestly?',
          'Are limitations and uncertainty visible?',
          'Does the conclusion match the evidence?',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Start analysis with a decision and metric definition.',
          'Validate joins, missing values, and time periods.',
          'Use chart choices that make comparisons honest and clear.',
          'State uncertainty and avoid causal claims without causal evidence.',
        ],
      },
    ],
  },
  {
    slug: 'da-portfolio',
    title: 'Building a Data Analysis Portfolio',
    description:
      'Create a portfolio that shows practical analysis skill through clear questions, clean code, strong communication, and real project structure.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A data analysis portfolio should prove that you can turn messy data into useful decisions. It should show your thinking, not only your charts.',
      },
      {
        type: 'p',
        text: 'The strongest beginner-to-analyst portfolios use a few polished projects instead of many unfinished notebooks. Each project should have a business question, reproducible code, and a clear conclusion.',
      },
      { type: 'h2', text: 'What a portfolio project should include' },
      {
        type: 'table',
        headers: ['Part', 'What to show', 'Why it matters'],
        rows: [
          ['Question', 'A specific decision or investigation', 'Shows focus'],
          ['Data source', 'Where data came from and what it contains', 'Builds trust'],
          ['Cleaning', 'Missing values, types, duplicates, assumptions', 'Shows real-world skill'],
          ['Analysis', 'Metrics, segments, comparisons, statistics', 'Shows judgment'],
          ['Visualization', 'Charts that support the conclusion', 'Shows communication'],
          ['Conclusion', 'Recommendation and limitations', 'Shows business value'],
        ],
      },
      { type: 'h2', text: 'Recommended project types' },
      {
        type: 'ul',
        items: [
          'Sales performance report with revenue, margin, and region analysis.',
          'Customer segmentation analysis with RFM features and recommendations.',
          'Product funnel analysis with conversion rates and drop-off points.',
          'Time series trend report with seasonality and anomaly notes.',
          'SQL plus pandas business report using multiple related tables.',
          'Ethics-focused analysis that examines fairness, missingness, or access.',
        ],
      },
      { type: 'h2', text: 'Repository structure' },
      {
        type: 'code',
        title: 'Portfolio project layout',
        language: 'text',
        code: `customer-segmentation/
  README.md
  data/
    sample_transactions.csv
  notebooks/
    01_exploration.ipynb
  src/
    prepare_data.py
    build_report.py
  outputs/
    segment-summary.png
  requirements.txt`,
      },
      { type: 'h2', text: 'README template' },
      {
        type: 'code',
        title: 'Project README outline',
        language: 'markdown',
        code: `# Customer Segmentation Analysis

## Business question
Which customer groups should marketing prioritize next month?

## Data
Describe the source, fields, time period, and limitations.

## Methods
Explain cleaning, feature creation, segmentation, and validation.

## Key findings
1. Finding with evidence.
2. Finding with evidence.
3. Finding with evidence.

## Recommendation
State the action and expected impact.

## Limitations
List missing data, assumptions, and what should be checked next.`,
      },
      { type: 'h2', text: 'Make projects reproducible' },
      {
        type: 'code',
        title: 'Minimal requirements file',
        language: 'text',
        code: `pandas
matplotlib
seaborn
jupyter`,
      },
      {
        type: 'code',
        title: 'Run instructions',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
jupyter notebook`,
      },
      { type: 'h2', text: 'Portfolio quality checklist' },
      {
        type: 'ol',
        items: [
          'Can someone understand the project in two minutes from the README?',
          'Is the business question specific?',
          'Can the code be rerun without private files?',
          'Are charts labeled and exported?',
          'Are conclusions supported by evidence?',
          'Are limitations honest and visible?',
          'Does each project show a different skill?',
        ],
      },
      {
        type: 'tip',
        text: 'If you use public datasets, add your own business framing. Hiring managers see many identical datasets; your value is in the question, analysis, and communication.',
      },
      {
        type: 'keypoints',
        items: [
          'A portfolio should show decision-making, not only tool usage.',
          'A few polished projects are stronger than many shallow notebooks.',
          'Every project needs a question, methods, findings, recommendation, and limitations.',
          'Reproducibility and clean communication make your work easier to trust.',
        ],
      },
    ],
  },
  {
    slug: 'da-next-steps',
    title: 'What to Learn After Data Analysis',
    description:
      'Choose your next learning path after data analysis: business intelligence, analytics engineering, data science, machine learning, or data engineering.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'After you can clean data, analyze metrics, visualize findings, use SQL, and explain recommendations, you have several strong next paths. The best path depends on the problems you enjoy.',
      },
      {
        type: 'p',
        text: 'You do not need to learn everything at once. Pick the path that matches your target role, then build one project that proves that skill.',
      },
      { type: 'h2', text: 'Common paths after data analysis' },
      {
        type: 'table',
        headers: ['Path', 'Focus', 'Learn next'],
        rows: [
          ['Business intelligence', 'Dashboards, metrics, stakeholder reporting', 'BI tools, dashboard design, metric layers'],
          ['Analytics engineering', 'Reliable data models for analysts', 'dbt, dimensional modeling, testing, warehouse SQL'],
          ['Data science', 'Experimentation, causal thinking, advanced statistics', 'Regression, experimentation, inference, research design'],
          ['Machine learning', 'Prediction and automation', 'scikit-learn, feature engineering, model evaluation, deployment basics'],
          ['Data engineering', 'Pipelines, storage, orchestration, scale', 'Airflow, Spark, cloud storage, batch and streaming systems'],
        ],
      },
      { type: 'h2', text: 'Deepen your statistics' },
      {
        type: 'ul',
        items: [
          'Confidence intervals and sampling distributions.',
          'Regression and interpretation.',
          'Experimental design and power analysis.',
          'Causal inference basics.',
          'Bayesian thinking for uncertainty.',
        ],
      },
      { type: 'h2', text: 'Strengthen your technical foundation' },
      {
        type: 'ul',
        items: [
          'Advanced SQL: windows, CTEs, query plans, and warehouse performance.',
          'Python packaging, testing, and reusable analysis scripts.',
          'Version control workflows with Git and GitHub.',
          'Data modeling and documentation.',
          'Cloud basics for storage, compute, and permissions.',
        ],
      },
      { type: 'h2', text: 'Practice plan for the next 30 days' },
      {
        type: 'ol',
        items: [
          'Choose one path and write a target role description.',
          'Pick one portfolio project that matches that path.',
          'Create a small dataset or use a public dataset with a clear question.',
          'Write clean SQL or Python code and document each step.',
          'Add one advanced element: experiment readout, model baseline, dashboard, or data model.',
          'Publish a README with findings, recommendation, limitations, and next steps.',
        ],
      },
      {
        type: 'code',
        title: 'Learning tracker',
        language: 'markdown',
        code: `| Week | Goal | Output |
| --- | --- | --- |
| 1 | Define project question and data | Project brief |
| 2 | Clean and explore data | Notebook or SQL report |
| 3 | Build advanced component | Model, dashboard, or tested data model |
| 4 | Polish communication | README, charts, and final recommendation |`,
      },
      { type: 'h2', text: 'How to keep improving' },
      {
        type: 'p',
        text: 'Review your old analyses after learning new techniques. Ask what you would change: better metric definition, cleaner code, stronger visualization, more careful uncertainty, or a sharper recommendation.',
      },
      {
        type: 'note',
        text: 'The best analysts combine technical skill, business judgment, ethical responsibility, and communication. Keep improving all four.',
      },
      {
        type: 'keypoints',
        items: [
          'Your next path can lead toward BI, analytics engineering, data science, machine learning, or data engineering.',
          'Choose based on the problems you enjoy and the role you want.',
          'Build projects that demonstrate the next skill, not only courses completed.',
          'Long-term growth comes from technical depth plus clear decision communication.',
        ],
      },
    ],
  },
];
