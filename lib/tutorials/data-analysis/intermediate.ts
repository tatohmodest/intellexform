import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'da-matplotlib',
    title: 'Matplotlib Basics',
    description:
      'Create clear static charts with Matplotlib and understand the figure, axes, and label workflow.',
    level: 'intermediate',
    section: 'Visualization',
    order: 26,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Matplotlib is the foundation of most Python visualization. Even when you use pandas, Seaborn, or other libraries, knowing Matplotlib helps you control titles, labels, scales, legends, and saved output.',
      },
      {
        type: 'p',
        text: 'Use Matplotlib when you need reliable static charts for notebooks, reports, scripts, and exported image files. It is especially good when you want precise control over every chart element.',
      },
      { type: 'h2', text: 'Start with figure and axes' },
      {
        type: 'code',
        language: 'python',
        title: 'A labeled line chart',
        code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May"]
revenue = [42_000, 48_500, 46_200, 53_800, 59_100]

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(months, revenue, marker="o")
ax.set_title("Monthly Revenue")
ax.set_xlabel("Month")
ax.set_ylabel("Revenue")
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`,
      },
      {
        type: 'p',
        text: 'The figure is the whole canvas. The axes object is the actual plotting area. Most customizations are clearer when you call methods on ax instead of using global pyplot state.',
      },
      { type: 'h2', text: 'Save charts for delivery' },
      {
        type: 'code',
        language: 'python',
        title: 'Save a chart as an image',
        code: `fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(["Basic", "Pro", "Team"], [180, 95, 42], color="#4f46e5")
ax.set_title("Customers by Plan")
ax.set_ylabel("Customer count")

plt.tight_layout()
fig.savefig("customers_by_plan.png", dpi=160, bbox_inches="tight")`,
      },
      {
        type: 'note',
        text: 'Matplotlib does not automatically know what your audience needs. Always add a clear title, axis labels, and units when units matter.',
      },
      {
        type: 'tip',
        text: 'Prefer fig, ax = plt.subplots() for analysis scripts. It makes multi-chart figures and later customization much easier.',
      },
      {
        type: 'try',
        text: 'Create a Matplotlib chart for weekly support tickets. Add markers, a title, an x-axis label, a y-axis label, and save it as tickets.png.',
      },
      {
        type: 'keypoints',
        items: [
          'Matplotlib is best for controlled static charts and saved chart images.',
          'A figure is the canvas; an axes is the plotting area.',
          'Use titles, labels, legends, and units to make charts self-explanatory.',
          'Save final charts with fig.savefig() when producing reports or project assets.',
        ],
      },
    ],
  },
  {
    slug: 'da-charts',
    title: 'Line, Bar & Pie Charts',
    description:
      'Choose between line, bar, and pie charts based on the question your analysis needs to answer.',
    level: 'intermediate',
    section: 'Visualization',
    order: 27,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Chart choice is an analysis decision. A line chart shows movement over an ordered variable, a bar chart compares categories, and a pie chart shows a simple part-to-whole breakdown.',
      },
      {
        type: 'p',
        text: 'Most business analysis uses line and bar charts far more often than pie charts because exact comparisons are easier along a common axis.',
      },
      { type: 'h2', text: 'Use line charts for trends' },
      {
        type: 'code',
        language: 'python',
        title: 'Trend over time',
        code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "week": pd.to_datetime(["2026-01-05", "2026-01-12", "2026-01-19", "2026-01-26"]),
    "active_users": [1200, 1375, 1320, 1490],
})

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(df["week"], df["active_users"], marker="o")
ax.set_title("Weekly Active Users")
ax.set_xlabel("Week")
ax.set_ylabel("Users")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Use bars for category comparison' },
      {
        type: 'code',
        language: 'python',
        title: 'Compare categories',
        code: `plan_counts = pd.Series(
    data=[320, 185, 74],
    index=["Basic", "Pro", "Enterprise"],
    name="customers",
)

fig, ax = plt.subplots(figsize=(7, 4))
plan_counts.sort_values().plot(kind="barh", ax=ax, color="#16a34a")
ax.set_title("Customers by Plan")
ax.set_xlabel("Customers")
ax.set_ylabel("Plan")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Use pie charts sparingly' },
      {
        type: 'code',
        language: 'python',
        title: 'Simple part-to-whole view',
        code: `traffic = pd.Series(
    data=[0.52, 0.31, 0.17],
    index=["Organic", "Paid", "Referral"],
)

fig, ax = plt.subplots(figsize=(5, 5))
ax.pie(traffic, labels=traffic.index, autopct="%1.0f%%", startangle=90)
ax.set_title("Traffic Share by Channel")
plt.show()`,
      },
      {
        type: 'note',
        text: 'Avoid pie charts when there are many categories or when slices are similar in size. A sorted bar chart is usually easier to read.',
      },
      {
        type: 'tip',
        text: 'Ask: trend, comparison, or composition? That one question usually tells you whether to start with a line, bar, or part-to-whole chart.',
      },
      {
        type: 'try',
        text: 'Given daily orders for 14 days and order counts by product category, make one line chart for daily orders and one horizontal bar chart for categories.',
      },
      {
        type: 'keypoints',
        items: [
          'Line charts show change across time or another ordered variable.',
          'Bar charts compare categories and are often best sorted.',
          'Pie charts should be limited to simple part-to-whole stories.',
          'Chart selection should match the analytical question, not personal preference.',
        ],
      },
    ],
  },
  {
    slug: 'da-distributions',
    title: 'Histograms & Box Plots',
    description:
      'Understand numeric distributions with histograms, box plots, spread, skew, and outlier clues.',
    level: 'intermediate',
    section: 'Visualization',
    order: 28,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Distribution charts answer questions like: What values are common? Is the data skewed? Are there unusually high or low values? Two of the most useful charts are histograms and box plots.',
      },
      {
        type: 'p',
        text: 'Use a histogram to see the shape of one numeric variable. Use a box plot to compare spread and outliers across groups.',
      },
      { type: 'h2', text: 'Histogram for one numeric variable' },
      {
        type: 'code',
        language: 'python',
        title: 'Order value distribution',
        code: `import pandas as pd
import matplotlib.pyplot as plt

orders = pd.DataFrame({
    "order_value": [22, 35, 35, 41, 55, 60, 64, 72, 81, 95, 130, 210, 240]
})

fig, ax = plt.subplots(figsize=(7, 4))
ax.hist(orders["order_value"], bins=6, edgecolor="white", color="#2563eb")
ax.set_title("Distribution of Order Values")
ax.set_xlabel("Order value")
ax.set_ylabel("Number of orders")
plt.tight_layout()
plt.show()`,
      },
      {
        type: 'p',
        text: 'The number of bins changes what you see. Too few bins can hide structure, while too many bins can make random noise look meaningful.',
      },
      { type: 'h2', text: 'Box plots for group comparison' },
      {
        type: 'code',
        language: 'python',
        title: 'Compare order values by channel',
        code: `orders = pd.DataFrame({
    "channel": ["Organic", "Organic", "Organic", "Paid", "Paid", "Paid", "Referral", "Referral"],
    "order_value": [42, 58, 63, 35, 88, 150, 49, 52],
})

fig, ax = plt.subplots(figsize=(7, 4))
orders.boxplot(column="order_value", by="channel", ax=ax)
ax.set_title("Order Value by Channel")
ax.set_xlabel("Channel")
ax.set_ylabel("Order value")
fig.suptitle("")
plt.tight_layout()
plt.show()`,
      },
      {
        type: 'note',
        text: 'A box plot highlights median, quartiles, and potential outliers. It does not show every detail of the distribution, so pair it with summary statistics when needed.',
      },
      {
        type: 'tip',
        text: 'When a histogram is strongly right-skewed, try plotting the log of the value or separating normal transactions from extreme cases.',
      },
      {
        type: 'try',
        text: 'Create a histogram of delivery times and a box plot of delivery times by warehouse. Identify which warehouse has the widest spread.',
      },
      {
        type: 'keypoints',
        items: [
          'Histograms show the shape of one numeric variable.',
          'Box plots summarize median, quartiles, spread, and possible outliers.',
          'Bin size affects the story a histogram appears to tell.',
          'Distribution checks should happen before averages are trusted.',
        ],
      },
    ],
  },
  {
    slug: 'da-seaborn',
    title: 'Seaborn for Statistical Plots',
    description:
      'Use Seaborn to build attractive statistical charts from tidy pandas DataFrames.',
    level: 'intermediate',
    section: 'Visualization',
    order: 29,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Seaborn is built on top of Matplotlib and works especially well with pandas DataFrames. It makes statistical plots easier by understanding columns, categories, grouping, and confidence intervals.',
      },
      {
        type: 'p',
        text: 'Use Seaborn when you want quick exploratory charts with grouping, distributions, relationships, and cleaner defaults than raw Matplotlib.',
      },
      { type: 'h2', text: 'A grouped bar chart' },
      {
        type: 'code',
        language: 'python',
        title: 'Average order value by channel',
        code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

orders = pd.DataFrame({
    "channel": ["Organic", "Organic", "Paid", "Paid", "Referral", "Referral"],
    "region": ["East", "West", "East", "West", "East", "West"],
    "order_value": [62, 71, 55, 83, 48, 57],
})

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8, 4))
sns.barplot(data=orders, x="channel", y="order_value", hue="region", ax=ax)
ax.set_title("Average Order Value by Channel and Region")
ax.set_xlabel("Channel")
ax.set_ylabel("Average order value")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Distribution and relationship plots' },
      {
        type: 'code',
        language: 'python',
        title: 'Histogram with grouping',
        code: `customers = pd.DataFrame({
    "plan": ["Basic", "Basic", "Basic", "Pro", "Pro", "Pro", "Team", "Team"],
    "monthly_spend": [19, 25, 29, 49, 60, 72, 120, 135],
    "logins": [3, 5, 7, 9, 12, 14, 20, 24],
})

sns.histplot(data=customers, x="monthly_spend", hue="plan", bins=6, kde=True)
plt.title("Monthly Spend Distribution by Plan")
plt.tight_layout()
plt.show()

sns.scatterplot(data=customers, x="logins", y="monthly_spend", hue="plan")
plt.title("Spend vs Product Usage")
plt.tight_layout()
plt.show()`,
      },
      {
        type: 'note',
        text: 'Seaborn expects tidy data: each row is an observation, each column is a variable, and each cell contains one value.',
      },
      {
        type: 'tip',
        text: 'Use Seaborn for exploration, then keep the final chart only if it clearly answers the business question. Pretty defaults do not replace chart judgment.',
      },
      {
        type: 'try',
        text: 'Build a Seaborn box plot of customer satisfaction score by support tier, then add hue="region" to compare regions inside each tier.',
      },
      {
        type: 'keypoints',
        items: [
          'Seaborn combines pandas-friendly syntax with Matplotlib customization.',
          'It is excellent for grouped distributions and statistical comparisons.',
          'Tidy data makes Seaborn code shorter and clearer.',
          'Use hue to compare groups within the same chart.',
        ],
      },
    ],
  },
  {
    slug: 'da-scatter-corr',
    title: 'Scatter Plots & Correlation',
    description:
      'Explore relationships between numeric variables and interpret correlation carefully.',
    level: 'intermediate',
    section: 'Visualization',
    order: 30,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Scatter plots show the relationship between two numeric variables. They help you see direction, strength, clusters, non-linear patterns, and unusual points.',
      },
      {
        type: 'p',
        text: 'Correlation is a numeric summary of a relationship. It is useful, but it does not prove cause and effect, and it can miss curved relationships.',
      },
      { type: 'h2', text: 'Build a scatter plot' },
      {
        type: 'code',
        language: 'python',
        title: 'Usage and revenue',
        code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

accounts = pd.DataFrame({
    "monthly_logins": [4, 8, 9, 12, 18, 21, 23, 30, 34],
    "monthly_revenue": [29, 49, 45, 55, 88, 94, 110, 150, 165],
    "plan": ["Basic", "Basic", "Basic", "Pro", "Pro", "Pro", "Team", "Team", "Team"],
})

sns.scatterplot(
    data=accounts,
    x="monthly_logins",
    y="monthly_revenue",
    hue="plan",
    s=90,
)
plt.title("Monthly Revenue vs Product Usage")
plt.tight_layout()
plt.show()`,
      },
      { type: 'h2', text: 'Calculate correlation' },
      {
        type: 'code',
        language: 'python',
        title: 'Correlation matrix',
        code: `numeric_cols = ["monthly_logins", "monthly_revenue"]
corr = accounts[numeric_cols].corr()

print(corr)

single_corr = accounts["monthly_logins"].corr(accounts["monthly_revenue"])
print(round(single_corr, 2))`,
      },
      {
        type: 'p',
        text: 'A correlation near 1 means the variables tend to rise together. A correlation near -1 means one tends to fall as the other rises. A value near 0 means there is no strong linear relationship.',
      },
      {
        type: 'note',
        text: 'Correlation can be distorted by outliers. Always inspect a scatter plot before using a correlation number in a conclusion.',
      },
      {
        type: 'tip',
        text: 'If groups have different behavior, color the scatter plot by group. One overall correlation can hide very different segment-level relationships.',
      },
      {
        type: 'try',
        text: 'Make a scatter plot of discount percentage vs order value and calculate their correlation. Then color the points by sales channel and compare the pattern.',
      },
      {
        type: 'keypoints',
        items: [
          'Scatter plots reveal numeric relationships and unusual observations.',
          'Correlation summarizes linear relationship strength and direction.',
          'Correlation does not prove causation.',
          'Outliers and hidden groups can change or hide correlations.',
        ],
      },
    ],
  },
  {
    slug: 'da-plotly',
    title: 'Interactive Charts with Plotly',
    description:
      'Build interactive charts for exploration and sharing with Plotly Express.',
    level: 'intermediate',
    section: 'Visualization',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Plotly creates interactive charts with hover labels, zooming, toggled legend items, and HTML export. It is useful when viewers need to explore details instead of looking at one fixed image.',
      },
      {
        type: 'p',
        text: 'Use Plotly for dashboards, exploratory notebooks, and shareable HTML charts. Use static Matplotlib charts when you need lightweight files for reports or version control.',
      },
      { type: 'h2', text: 'Create an interactive line chart' },
      {
        type: 'code',
        language: 'python',
        title: 'Plotly Express trend chart',
        code: `import pandas as pd
import plotly.express as px

traffic = pd.DataFrame({
    "date": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04"]),
    "channel": ["Organic", "Organic", "Paid", "Paid"],
    "visits": [1200, 1350, 540, 720],
})

fig = px.line(
    traffic,
    x="date",
    y="visits",
    color="channel",
    markers=True,
    title="Website Visits by Channel",
)
fig.show()`,
      },
      { type: 'h2', text: 'Add useful hover information' },
      {
        type: 'code',
        language: 'python',
        title: 'Interactive scatter plot',
        code: `accounts = pd.DataFrame({
    "account": ["Aster", "Beacon", "Cobalt", "Delta"],
    "users": [12, 34, 22, 48],
    "revenue": [1200, 4200, 3100, 6200],
    "segment": ["SMB", "Enterprise", "SMB", "Enterprise"],
})

fig = px.scatter(
    accounts,
    x="users",
    y="revenue",
    color="segment",
    size="revenue",
    hover_name="account",
    title="Revenue vs Account Size",
)
fig.write_html("account_scatter.html")
fig.show()`,
      },
      {
        type: 'note',
        text: 'Interactive charts can be harder to review in code because HTML output is large. Commit the code that generates the chart, not every generated HTML file, unless the file is a deliverable.',
      },
      {
        type: 'tip',
        text: 'Use hover_data to include columns that are useful on demand but would clutter labels on a static chart.',
      },
      {
        type: 'try',
        text: 'Create an interactive Plotly bar chart of revenue by product. Add color by region and export the chart to revenue_by_product.html.',
      },
      {
        type: 'keypoints',
        items: [
          'Plotly is useful for interactive exploration and shareable HTML charts.',
          'Plotly Express works well with tidy pandas DataFrames.',
          'Hover labels can reveal detail without cluttering the chart.',
          'Keep generated chart artifacts separate from reproducible chart code.',
        ],
      },
    ],
  },
  {
    slug: 'da-pivot',
    title: 'Pivot Tables',
    description:
      'Summarize data across categories with pandas pivot_table and crosstab patterns.',
    level: 'intermediate',
    section: 'Deeper pandas',
    order: 32,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A pivot table turns detailed rows into a summary matrix. Analysts use pivots to compare categories across time, segments, regions, products, or any other grouping variable.',
      },
      {
        type: 'p',
        text: 'Use pivot_table when you need aggregation. Use pivot only when every row-column pair has exactly one value and no aggregation is needed.',
      },
      { type: 'h2', text: 'Summarize revenue by region and plan' },
      {
        type: 'code',
        language: 'python',
        title: 'pandas pivot_table',
        code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["East", "East", "West", "West", "West"],
    "plan": ["Basic", "Pro", "Basic", "Pro", "Pro"],
    "revenue": [1200, 2400, 900, 3100, 2800],
})

summary = sales.pivot_table(
    index="region",
    columns="plan",
    values="revenue",
    aggfunc="sum",
    fill_value=0,
    margins=True,
)

print(summary)`,
      },
      { type: 'h2', text: 'Use multiple aggregations' },
      {
        type: 'code',
        language: 'python',
        title: 'Revenue and order count',
        code: `orders = pd.DataFrame({
    "channel": ["Organic", "Organic", "Paid", "Paid", "Referral"],
    "region": ["East", "West", "East", "West", "East"],
    "order_value": [80, 120, 65, 150, 90],
})

by_channel = orders.pivot_table(
    index="channel",
    values="order_value",
    aggfunc=["count", "mean", "sum"],
)

print(by_channel.round(2))`,
      },
      {
        type: 'note',
        text: 'If a pivot table has missing combinations, fill_value=0 can be appropriate for counts or revenue, but not always for averages or rates.',
      },
      {
        type: 'tip',
        text: 'Before pivoting, check the grain of your dataset. Know what one row represents so the aggregation has the meaning you expect.',
      },
      {
        type: 'try',
        text: 'Create a pivot table showing average delivery time by warehouse as rows and shipping method as columns. Include a total row with margins=True.',
      },
      {
        type: 'keypoints',
        items: [
          'pivot_table summarizes detailed rows into grouped values.',
          'index controls rows, columns controls columns, and values controls the measured field.',
          'aggfunc defines how duplicate combinations are summarized.',
          'Always understand row grain before interpreting a pivot.',
        ],
      },
    ],
  },
  {
    slug: 'da-apply-map',
    title: 'apply, map & transform',
    description:
      'Choose the right pandas method for element mapping, row logic, and group-level calculations.',
    level: 'intermediate',
    section: 'Deeper pandas',
    order: 33,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'pandas gives you several ways to transform data. map is best for simple Series lookups, apply handles custom functions, and transform returns values aligned to the original rows.',
      },
      {
        type: 'p',
        text: 'Use vectorized operations first when possible. They are usually faster and clearer. Reach for apply when the logic does not fit a built-in operation.',
      },
      { type: 'h2', text: 'Use map for lookups' },
      {
        type: 'code',
        language: 'python',
        title: 'Map codes to labels',
        code: `import pandas as pd

tickets = pd.DataFrame({
    "priority_code": ["H", "M", "L", "H"],
    "hours_open": [3, 18, 40, 7],
})

priority_labels = {"H": "High", "M": "Medium", "L": "Low"}
tickets["priority"] = tickets["priority_code"].map(priority_labels)

print(tickets)`,
      },
      { type: 'h2', text: 'Use apply for custom row logic' },
      {
        type: 'code',
        language: 'python',
        title: 'Classify ticket risk',
        code: `def classify_ticket(row):
    if row["priority"] == "High" and row["hours_open"] > 6:
        return "Escalate"
    if row["hours_open"] > 24:
        return "Review"
    return "Normal"

tickets["action"] = tickets.apply(classify_ticket, axis=1)

print(tickets[["priority", "hours_open", "action"]])`,
      },
      { type: 'h2', text: 'Use transform for group-aligned values' },
      {
        type: 'code',
        language: 'python',
        title: 'Compare each row with its group average',
        code: `orders = pd.DataFrame({
    "region": ["East", "East", "West", "West"],
    "order_value": [100, 140, 80, 160],
})

orders["region_avg"] = orders.groupby("region")["order_value"].transform("mean")
orders["vs_region_avg"] = orders["order_value"] - orders["region_avg"]

print(orders)`,
      },
      {
        type: 'note',
        text: 'transform is different from aggregate because it returns one value per original row, which makes it ideal for percent-of-group and comparison-to-group calculations.',
      },
      {
        type: 'tip',
        text: 'If your apply function only does arithmetic between columns, rewrite it as a vectorized expression before shipping the analysis.',
      },
      {
        type: 'try',
        text: 'Use map to label customer plan codes, apply to flag risky accounts, and transform to calculate each customer spend as a percent of their region total.',
      },
      {
        type: 'keypoints',
        items: [
          'map is best for Series-level value replacement and lookup.',
          'apply handles custom functions but may be slower than vectorized code.',
          'groupby().transform() creates group calculations aligned to original rows.',
          'Prefer built-in pandas operations before custom row-wise apply.',
        ],
      },
    ],
  },
  {
    slug: 'da-datetime',
    title: 'Dates & Times in pandas',
    description:
      'Parse, clean, and extract date features from pandas datetime columns.',
    level: 'intermediate',
    section: 'Deeper pandas',
    order: 34,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Dates are often imported as strings. Converting them to datetime unlocks sorting, filtering, date math, time-based grouping, and calendar feature extraction.',
      },
      {
        type: 'p',
        text: 'pandas stores datetime values in a special dtype. Once a Series is datetime-like, the .dt accessor gives you year, month, weekday, hour, and many other pieces.',
      },
      { type: 'h2', text: 'Parse dates safely' },
      {
        type: 'code',
        language: 'python',
        title: 'Convert strings to datetime',
        code: `import pandas as pd

events = pd.DataFrame({
    "signup_date": ["2026-01-04", "2026-01-12", "bad date", "2026-02-01"],
    "customer_id": [101, 102, 103, 104],
})

events["signup_date"] = pd.to_datetime(events["signup_date"], errors="coerce")

print(events)
print(events["signup_date"].isna().sum())`,
      },
      {
        type: 'p',
        text: 'errors="coerce" turns unparseable values into NaT, which is the datetime version of missing data. This makes bad dates visible instead of crashing the script.',
      },
      { type: 'h2', text: 'Extract calendar features' },
      {
        type: 'code',
        language: 'python',
        title: 'Create date features',
        code: `events = events.dropna(subset=["signup_date"]).copy()
events["signup_month"] = events["signup_date"].dt.to_period("M")
events["weekday"] = events["signup_date"].dt.day_name()
events["is_weekend"] = events["signup_date"].dt.dayofweek >= 5

print(events)`,
      },
      { type: 'h2', text: 'Filter by date range' },
      {
        type: 'code',
        language: 'python',
        title: 'Date filtering',
        code: `start = pd.Timestamp("2026-01-01")
end = pd.Timestamp("2026-02-01")

january_signups = events[
    (events["signup_date"] >= start)
    & (events["signup_date"] < end)
]

print(january_signups)`,
      },
      {
        type: 'note',
        text: 'Use half-open date ranges like >= start and < end for monthly filters. They avoid off-by-one problems with timestamps later in the day.',
      },
      {
        type: 'tip',
        text: 'Keep original raw date strings until you trust the parsing rules, especially when working with international formats such as 03/04/2026.',
      },
      {
        type: 'try',
        text: 'Parse an orders DataFrame with order_date strings, create order_month and weekday columns, then filter orders from the most recent full month.',
      },
      {
        type: 'keypoints',
        items: [
          'Convert date strings with pd.to_datetime before date analysis.',
          'errors="coerce" makes invalid dates visible as NaT.',
          '.dt extracts calendar features from datetime columns.',
          'Half-open date ranges make time filters safer.',
        ],
      },
    ],
  },
  {
    slug: 'da-timeseries',
    title: 'Resampling & Time Series Basics',
    description:
      'Set a datetime index, resample events into periods, and calculate simple time series trends.',
    level: 'intermediate',
    section: 'Deeper pandas',
    order: 35,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Time series analysis starts when rows have timestamps and you want to summarize them into regular periods such as days, weeks, months, or quarters.',
      },
      {
        type: 'p',
        text: 'Use resampling when your raw data is event-level but your question is period-level: daily revenue, weekly tickets, monthly signups, or quarterly retention.',
      },
      { type: 'h2', text: 'Resample events into days' },
      {
        type: 'code',
        language: 'python',
        title: 'Daily revenue from order rows',
        code: `import pandas as pd

orders = pd.DataFrame({
    "created_at": pd.to_datetime([
        "2026-01-01 09:15", "2026-01-01 15:20", "2026-01-02 11:00",
        "2026-01-04 18:30", "2026-01-04 19:10"
    ]),
    "order_value": [120, 80, 95, 210, 75],
})

daily = (
    orders
    .set_index("created_at")
    .resample("D")["order_value"]
    .sum()
    .rename("daily_revenue")
)

print(daily)`,
      },
      {
        type: 'p',
        text: 'The "D" frequency means calendar day. Other common frequencies include "W" for week, "MS" for month start, and "QS" for quarter start.',
      },
      { type: 'h2', text: 'Rolling averages smooth noisy data' },
      {
        type: 'code',
        language: 'python',
        title: 'Rolling average',
        code: `daily_summary = daily.reset_index()
daily_summary["rolling_3_day"] = (
    daily_summary["daily_revenue"]
    .rolling(window=3, min_periods=1)
    .mean()
)

print(daily_summary)`,
      },
      { type: 'h2', text: 'Plot the result' },
      {
        type: 'code',
        language: 'python',
        title: 'Time series chart',
        code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(daily_summary["created_at"], daily_summary["daily_revenue"], label="Daily")
ax.plot(daily_summary["created_at"], daily_summary["rolling_3_day"], label="3-day average")
ax.set_title("Daily Revenue Trend")
ax.set_xlabel("Date")
ax.set_ylabel("Revenue")
ax.legend()
plt.tight_layout()
plt.show()`,
      },
      {
        type: 'note',
        text: 'Missing dates matter. Resample creates regular periods, so a day with no orders becomes zero after sum but may become NaN for other aggregations.',
      },
      {
        type: 'tip',
        text: 'Always confirm whether your business uses calendar weeks, ISO weeks, fiscal months, or custom reporting periods before presenting time series results.',
      },
      {
        type: 'try',
        text: 'Resample support tickets into weekly counts, add a 4-week rolling average, and plot both lines on the same chart.',
      },
      {
        type: 'keypoints',
        items: [
          'Resampling converts timestamped rows into regular time periods.',
          'A datetime index is the usual setup for pandas resample.',
          'Rolling averages help reveal trends in noisy time series.',
          'Reporting calendar rules should be confirmed before analysis is finalized.',
        ],
      },
    ],
  },
  {
    slug: 'da-outliers',
    title: 'Detecting & Handling Outliers',
    description:
      'Identify unusual values, investigate their causes, and choose transparent handling strategies.',
    level: 'intermediate',
    section: 'Deeper Cleaning',
    order: 36,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Outliers are values that are unusually far from the rest of the data. They can be valid rare events, data entry errors, duplicate records, measurement problems, or important business signals.',
      },
      {
        type: 'p',
        text: 'The goal is not to delete outliers automatically. The goal is to detect them, investigate them, and document how they were handled.',
      },
      { type: 'h2', text: 'Use the IQR rule as a first pass' },
      {
        type: 'code',
        language: 'python',
        title: 'Find potential outliers',
        code: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7],
    "order_value": [45, 52, 49, 60, 58, 62, 750],
})

q1 = orders["order_value"].quantile(0.25)
q3 = orders["order_value"].quantile(0.75)
iqr = q3 - q1

lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr

outliers = orders[
    (orders["order_value"] < lower)
    | (orders["order_value"] > upper)
]

print(outliers)`,
      },
      { type: 'h2', text: 'Compare before and after handling' },
      {
        type: 'code',
        language: 'python',
        title: 'Winsorize extreme values',
        code: `orders["order_value_capped"] = orders["order_value"].clip(lower=lower, upper=upper)

comparison = orders[["order_value", "order_value_capped"]].describe()
print(comparison)`,
      },
      {
        type: 'p',
        text: 'Capping, also called winsorizing, limits extreme values while keeping the rows. It can be useful for modeling features, but it may be inappropriate for financial totals where exact values matter.',
      },
      {
        type: 'note',
        text: 'Outlier rules are context-dependent. A large enterprise order may be real revenue, while a negative age or impossible timestamp is likely a data quality issue.',
      },
      {
        type: 'tip',
        text: 'Keep an outlier flag column even if you cap or filter values. It preserves the ability to compare original and adjusted results.',
      },
      {
        type: 'try',
        text: 'Detect outliers in delivery_time_minutes using the IQR rule. Create an is_outlier column, then compare average delivery time with and without those rows.',
      },
      {
        type: 'keypoints',
        items: [
          'Outliers can be valid signals or data quality problems.',
          'The IQR rule is a practical first-pass detection method.',
          'Capping, filtering, and flagging have different analytical consequences.',
          'Document every outlier handling decision.',
        ],
      },
    ],
  },
  {
    slug: 'da-feature-eng',
    title: 'Feature Engineering Basics',
    description:
      'Create useful analysis columns from dates, numeric values, text, and business rules.',
    level: 'intermediate',
    section: 'Deeper Cleaning',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Feature engineering means creating new columns that make patterns easier to analyze. In data analysis, features often become segments, flags, ratios, age calculations, and calendar fields.',
      },
      {
        type: 'p',
        text: 'Good features are interpretable. A stakeholder should understand what the feature means and why it helps answer the question.',
      },
      { type: 'h2', text: 'Create ratio and flag features' },
      {
        type: 'code',
        language: 'python',
        title: 'Customer features',
        code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [101, 102, 103],
    "revenue": [1200, 300, 2400],
    "orders": [12, 2, 18],
    "support_tickets": [1, 4, 2],
})

customers["avg_order_value"] = customers["revenue"] / customers["orders"]
customers["tickets_per_order"] = customers["support_tickets"] / customers["orders"]
customers["high_value"] = customers["revenue"] >= 1000

print(customers)`,
      },
      { type: 'h2', text: 'Create date-based features' },
      {
        type: 'code',
        language: 'python',
        title: 'Account age and signup month',
        code: `customers["signup_date"] = pd.to_datetime(["2025-11-15", "2026-01-02", "2025-08-20"])
analysis_date = pd.Timestamp("2026-02-01")

customers["account_age_days"] = (analysis_date - customers["signup_date"]).dt.days
customers["signup_month"] = customers["signup_date"].dt.to_period("M").astype(str)

print(customers[["customer_id", "account_age_days", "signup_month"]])`,
      },
      { type: 'h2', text: 'Create bins for segmentation' },
      {
        type: 'code',
        language: 'python',
        title: 'Revenue bands',
        code: `customers["revenue_band"] = pd.cut(
    customers["revenue"],
    bins=[0, 500, 1500, float("inf")],
    labels=["Small", "Medium", "Large"],
)

print(customers[["customer_id", "revenue", "revenue_band"]])`,
      },
      {
        type: 'note',
        text: 'Feature engineering can leak future information if you use data that would not have been known at the time of the decision. This matters for models and historical analysis.',
      },
      {
        type: 'tip',
        text: 'Name engineered columns plainly. avg_order_value is easier to trust than a vague name like score_1.',
      },
      {
        type: 'try',
        text: 'For an orders dataset, create discount_rate, is_large_order, order_month, and days_since_order features. Explain how each could be used in analysis.',
      },
      {
        type: 'keypoints',
        items: [
          'Feature engineering creates analysis-ready columns from raw data.',
          'Ratios, flags, bins, and date features are common analyst features.',
          'Features should be understandable and tied to the question.',
          'Avoid using future information when analyzing historical decisions.',
        ],
      },
    ],
  },
  {
    slug: 'da-categoricals',
    title: 'Categorical Data & Encoding Intro',
    description:
      'Work with categorical columns, clean category labels, and introduce simple encoding patterns.',
    level: 'intermediate',
    section: 'Deeper Cleaning',
    order: 38,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Categorical data represents labels such as plan, region, status, device type, or customer segment. Cleaning categories is essential because inconsistent labels split groups that should be combined.',
      },
      {
        type: 'p',
        text: 'Encoding turns categories into numeric columns for modeling or certain calculations. For analysis tables and charts, keep human-readable labels as long as possible.',
      },
      { type: 'h2', text: 'Normalize category labels' },
      {
        type: 'code',
        language: 'python',
        title: 'Clean plan names',
        code: `import pandas as pd

customers = pd.DataFrame({
    "plan": [" basic", "Basic", "PRO", "pro ", "Enterprise", "enterprise"],
    "revenue": [19, 25, 49, 60, 200, 240],
})

customers["plan_clean"] = customers["plan"].str.strip().str.title()

print(customers["plan_clean"].value_counts())`,
      },
      { type: 'h2', text: 'Use category dtype for known groups' },
      {
        type: 'code',
        language: 'python',
        title: 'Ordered categories',
        code: `plan_order = ["Basic", "Pro", "Enterprise"]
customers["plan_clean"] = pd.Categorical(
    customers["plan_clean"],
    categories=plan_order,
    ordered=True,
)

summary = customers.groupby("plan_clean", observed=True)["revenue"].mean()
print(summary)`,
      },
      { type: 'h2', text: 'One-hot encode for modeling inputs' },
      {
        type: 'code',
        language: 'python',
        title: 'Dummy variables',
        code: `encoded = pd.get_dummies(customers, columns=["plan_clean"], prefix="plan")

print(encoded)`,
      },
      {
        type: 'note',
        text: 'One-hot encoding can create many columns when a category has many unique values. Check cardinality before encoding fields like city, product_id, or email domain.',
      },
      {
        type: 'tip',
        text: 'Create a small mapping table for business-approved category cleanup instead of burying many replacements across a notebook.',
      },
      {
        type: 'try',
        text: 'Clean a device_type column with inconsistent casing and spaces, convert it to a category dtype, and create dummy columns for each device type.',
      },
      {
        type: 'keypoints',
        items: [
          'Categorical cleaning prevents accidental duplicate groups.',
          'The category dtype is useful for known labels and ordered groups.',
          'One-hot encoding creates numeric indicator columns.',
          'High-cardinality categories need extra care before encoding.',
        ],
      },
    ],
  },
  {
    slug: 'da-sql-analysts',
    title: 'SQL for Data Analysts',
    description:
      'Use SELECT, WHERE, GROUP BY, and JOIN to answer common analyst questions.',
    level: 'intermediate',
    section: 'Data Sources',
    order: 39,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'SQL is the main language analysts use to retrieve data from relational databases. The core pattern is simple: select columns, filter rows, group records, and join tables.',
      },
      {
        type: 'p',
        text: 'Analyst SQL should be readable and auditable. Favor clear aliases, explicit filters, and comments for business rules.',
      },
      { type: 'h2', text: 'Filter rows with WHERE' },
      {
        type: 'code',
        language: 'sql',
        title: 'Recent paid orders',
        code: `SELECT
  order_id,
  customer_id,
  order_date,
  total_amount
FROM orders
WHERE order_date >= DATE '2026-01-01'
  AND status = 'paid'
ORDER BY order_date DESC;`,
      },
      { type: 'h2', text: 'Summarize with GROUP BY' },
      {
        type: 'code',
        language: 'sql',
        title: 'Revenue by channel',
        code: `SELECT
  channel,
  COUNT(*) AS order_count,
  SUM(total_amount) AS revenue,
  AVG(total_amount) AS avg_order_value
FROM orders
WHERE status = 'paid'
GROUP BY channel
ORDER BY revenue DESC;`,
      },
      { type: 'h2', text: 'Join tables for context' },
      {
        type: 'code',
        language: 'sql',
        title: 'Orders with customer region',
        code: `SELECT
  c.region,
  o.channel,
  COUNT(*) AS order_count,
  SUM(o.total_amount) AS revenue
FROM orders AS o
JOIN customers AS c
  ON c.customer_id = o.customer_id
WHERE o.status = 'paid'
GROUP BY c.region, o.channel
ORDER BY c.region, revenue DESC;`,
      },
      {
        type: 'note',
        text: 'GROUP BY changes the grain of your result. After grouping by region and channel, each row represents one region-channel combination.',
      },
      {
        type: 'tip',
        text: 'Before joining, ask whether the relationship is one-to-one, one-to-many, or many-to-many. Unexpected row multiplication is a common reporting bug.',
      },
      {
        type: 'try',
        text: 'Write a SQL query that returns monthly paid revenue by product category using orders, order_items, and products tables.',
      },
      {
        type: 'keypoints',
        items: [
          'SELECT chooses columns; WHERE filters rows before aggregation.',
          'GROUP BY creates summary rows at a new grain.',
          'JOIN adds context from related tables.',
          'Analyst SQL should make business rules and row grain obvious.',
        ],
      },
    ],
  },
  {
    slug: 'da-sql-pandas',
    title: 'SQL + pandas (read_sql patterns)',
    description:
      'Bridge SQL databases and pandas DataFrames with safe, focused read_sql workflows.',
    level: 'intermediate',
    section: 'Data Sources',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'pandas can read SQL query results directly into a DataFrame. This is useful when the database handles filtering and aggregation, while Python handles deeper cleaning, visualization, and reporting.',
      },
      {
        type: 'p',
        text: 'A good pattern is to push large filters and joins into SQL, then bring only the analysis-ready result into pandas.',
      },
      { type: 'h2', text: 'Read a query into pandas' },
      {
        type: 'code',
        language: 'python',
        title: 'read_sql with SQLAlchemy',
        code: `import os
import pandas as pd
from sqlalchemy import create_engine, text

database_url = os.environ["DATABASE_URL"]
engine = create_engine(database_url)

query = text("""
SELECT
  DATE_TRUNC('month', order_date) AS order_month,
  channel,
  SUM(total_amount) AS revenue
FROM orders
WHERE status = :status
GROUP BY order_month, channel
ORDER BY order_month, channel
""")

monthly = pd.read_sql(query, engine, params={"status": "paid"})
print(monthly.head())`,
      },
      { type: 'h2', text: 'Continue the analysis in pandas' },
      {
        type: 'code',
        language: 'python',
        title: 'Pivot SQL results for plotting',
        code: `monthly["order_month"] = pd.to_datetime(monthly["order_month"])

chart_data = monthly.pivot_table(
    index="order_month",
    columns="channel",
    values="revenue",
    aggfunc="sum",
    fill_value=0,
)

print(chart_data.tail())`,
      },
      { type: 'h2', text: 'Keep SQL readable' },
      {
        type: 'code',
        language: 'sql',
        title: 'Analyst-friendly source query',
        code: `SELECT
  DATE_TRUNC('week', created_at) AS signup_week,
  acquisition_channel,
  COUNT(*) AS signups
FROM customers
WHERE created_at >= DATE '2026-01-01'
GROUP BY signup_week, acquisition_channel
ORDER BY signup_week;`,
      },
      {
        type: 'note',
        text: 'Use query parameters for values that change. Avoid building SQL by concatenating user input into strings.',
      },
      {
        type: 'tip',
        text: 'Limit columns early. Pulling SELECT * into pandas is convenient during exploration but risky for performance, privacy, and reproducibility.',
      },
      {
        type: 'try',
        text: 'Write a parameterized read_sql query that pulls paid orders between two dates, then use pandas to calculate average order value by channel.',
      },
      {
        type: 'keypoints',
        items: [
          'read_sql turns query results into pandas DataFrames.',
          'Use SQL for filtering, joining, and database-side aggregation.',
          'Use pandas for deeper cleaning, reshaping, plotting, and export.',
          'Parameterize values and avoid SELECT * in production analysis scripts.',
        ],
      },
    ],
  },
  {
    slug: 'da-postgres-analysis',
    title: 'Analyzing PostgreSQL Data',
    description:
      'Connect conceptually to PostgreSQL, use environment-based URLs, and query data safely from pandas.',
    level: 'intermediate',
    section: 'Data Sources',
    order: 41,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL is a common production database for application and analytics data. Analysts usually connect with read-only credentials, run scoped queries, and bring results into pandas for exploration.',
      },
      {
        type: 'p',
        text: 'Never hard-code real usernames, passwords, or hostnames in tutorial code, notebooks, or Git commits. Store connection strings in environment variables or a secrets manager.',
      },
      { type: 'h2', text: 'Configure a connection URL' },
      {
        type: 'code',
        language: 'bash',
        title: 'Example local environment variable',
        code: `export DATABASE_URL="postgresql+psycopg://readonly_user:password@localhost:5432/analytics"`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Create an engine from the environment',
        code: `import os
from sqlalchemy import create_engine

database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError("Set DATABASE_URL before running this analysis.")

engine = create_engine(database_url, pool_pre_ping=True)`,
      },
      { type: 'h2', text: 'Query PostgreSQL with pandas' },
      {
        type: 'code',
        language: 'python',
        title: 'Monthly revenue query',
        code: `import pandas as pd
from sqlalchemy import text

sql = text("""
SELECT
  DATE_TRUNC('month', o.order_date)::date AS order_month,
  c.region,
  COUNT(*) AS orders,
  SUM(o.total_amount) AS revenue
FROM orders AS o
JOIN customers AS c
  ON c.customer_id = o.customer_id
WHERE o.status = 'paid'
  AND o.order_date >= :start_date
GROUP BY order_month, c.region
ORDER BY order_month, c.region
""")

monthly = pd.read_sql(sql, engine, params={"start_date": "2026-01-01"})
print(monthly.head())`,
      },
      { type: 'h2', text: 'Use PostgreSQL features intentionally' },
      {
        type: 'code',
        language: 'sql',
        title: 'PostgreSQL date and filter patterns',
        code: `SELECT
  DATE_TRUNC('week', created_at)::date AS signup_week,
  COUNT(*) FILTER (WHERE plan = 'Pro') AS pro_signups,
  COUNT(*) AS total_signups
FROM customers
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY signup_week
ORDER BY signup_week;`,
      },
      {
        type: 'note',
        text: 'Ask for read-only database access for analysis. A tutorial or notebook should not need permission to update, delete, or insert production data.',
      },
      {
        type: 'tip',
        text: 'When a PostgreSQL query becomes part of recurring reporting, move it into a saved SQL file and load it from Python so it can be reviewed separately.',
      },
      {
        type: 'try',
        text: 'Write a PostgreSQL query that calculates weekly signups and paid conversions, then read it into pandas using DATABASE_URL from the environment.',
      },
      {
        type: 'keypoints',
        items: [
          'Use environment variables for PostgreSQL connection strings.',
          'pandas read_sql works well with SQLAlchemy engines and parameterized SQL.',
          'PostgreSQL features like DATE_TRUNC and FILTER are useful for analyst queries.',
          'Use read-only credentials and never commit real secrets.',
        ],
      },
    ],
  },
  {
    slug: 'da-api-data',
    title: 'Pulling Data from APIs',
    description:
      'Request JSON data from APIs, handle pagination basics, and normalize results into pandas.',
    level: 'intermediate',
    section: 'Data Sources',
    order: 42,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'APIs let analysts collect data from internal services, SaaS tools, public datasets, and operational systems. Most modern APIs return JSON, which can be normalized into tables.',
      },
      {
        type: 'p',
        text: 'A responsible API workflow handles status codes, timeouts, authentication, pagination, and rate limits instead of assuming every request succeeds.',
      },
      { type: 'h2', text: 'Request JSON data' },
      {
        type: 'code',
        language: 'python',
        title: 'GET request with timeout',
        code: `import requests
import pandas as pd

url = "https://api.example.com/orders"
headers = {"Accept": "application/json"}
params = {"status": "paid", "limit": 100}

response = requests.get(url, headers=headers, params=params, timeout=15)
response.raise_for_status()

payload = response.json()
orders = pd.json_normalize(payload["data"])

print(orders.head())`,
      },
      { type: 'h2', text: 'Handle simple pagination' },
      {
        type: 'code',
        language: 'python',
        title: 'Collect multiple pages',
        code: `all_rows = []
page = 1

while True:
    response = requests.get(
        "https://api.example.com/orders",
        params={"status": "paid", "page": page, "limit": 100},
        timeout=15,
    )
    response.raise_for_status()
    payload = response.json()

    rows = payload["data"]
    all_rows.extend(rows)

    if not payload.get("has_more"):
        break

    page += 1

orders = pd.json_normalize(all_rows)
print(len(orders))`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Typical paginated response shape',
        code: `{
  "data": [
    {"order_id": 1001, "total": 42.5, "status": "paid"}
  ],
  "page": 1,
  "has_more": true
}`,
      },
      {
        type: 'note',
        text: 'APIs can change. Save the request URL, parameters, extraction date, and response schema notes so future readers know exactly what was pulled.',
      },
      {
        type: 'tip',
        text: 'Cache raw API responses during development. It prevents repeated calls, respects rate limits, and makes debugging transformations easier.',
      },
      {
        type: 'try',
        text: 'Write a function named fetch_customers(page) that requests one page of customer JSON, checks for errors, and returns a normalized DataFrame.',
      },
      {
        type: 'keypoints',
        items: [
          'APIs commonly return JSON that pandas can normalize into tabular data.',
          'Use timeouts and raise_for_status() to avoid silent request failures.',
          'Pagination is required when APIs limit response size.',
          'Record request parameters and extraction dates for reproducibility.',
        ],
      },
    ],
  },
  {
    slug: 'da-ethics-scraping',
    title: 'Ethical Scraping & Data Sources',
    description:
      'Evaluate data source permissions, privacy, robots.txt, and respectful collection practices.',
    level: 'intermediate',
    section: 'Data Sources',
    order: 43,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Not every accessible dataset is appropriate to collect or use. Ethical analysis considers permission, privacy, terms of service, data minimization, and the impact of conclusions.',
      },
      {
        type: 'p',
        text: 'Scraping means extracting data from web pages. It can be legitimate, but it should be done slowly, transparently, and only when allowed by the source.',
      },
      { type: 'h2', text: 'Check before collecting' },
      {
        type: 'ul',
        items: [
          'Do the terms of service allow automated access?',
          'Does robots.txt disallow the paths you want to request?',
          'Is the data personal, sensitive, copyrighted, or confidential?',
          'Is there an official API or download that should be used instead?',
          'Can you answer the question with less data?',
        ],
      },
      { type: 'h2', text: 'Use a respectful request pattern' },
      {
        type: 'code',
        language: 'python',
        title: 'Slow requests with a clear user agent',
        code: `import time
import requests

headers = {
    "User-Agent": "LearningDataAnalysisBot/1.0 contact: analytics@example.com"
}

urls = [
    "https://example.com/public/page-1",
    "https://example.com/public/page-2",
]

for url in urls:
    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()
    print(url, len(response.text))
    time.sleep(2)`,
      },
      { type: 'h2', text: 'Keep provenance notes' },
      {
        type: 'code',
        language: 'text',
        title: 'Source log example',
        code: `source: https://example.com/public-download
accessed_at: 2026-02-01
license: Creative Commons Attribution 4.0
collection_method: official CSV download
privacy_notes: no direct personal identifiers included
limitations: data excludes archived records before 2024`,
      },
      {
        type: 'note',
        text: 'Privacy risk can remain even after obvious identifiers are removed. Small groups, location data, and rare combinations can re-identify people.',
      },
      {
        type: 'tip',
        text: 'Prefer official exports, public APIs, and clearly licensed datasets. Scraping should not be your first option when a structured source exists.',
      },
      {
        type: 'try',
        text: 'Choose a public dataset and write a short provenance note: source URL, license, access date, collection method, and one limitation.',
      },
      {
        type: 'keypoints',
        items: [
          'Accessible data is not automatically ethical or permitted to use.',
          'Check terms, robots.txt, licensing, and privacy implications.',
          'Collect only the data needed for the analysis question.',
          'Record source provenance so others can evaluate the dataset.',
        ],
      },
    ],
  },
  {
    slug: 'da-eda-playbook',
    title: 'Full EDA Playbook',
    description:
      'Follow a practical exploratory data analysis workflow from question to findings.',
    level: 'intermediate',
    section: 'Analysis Practice',
    order: 44,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Exploratory data analysis, or EDA, is the structured process of learning what is in a dataset before making claims. It combines data quality checks, summaries, visualizations, and focused follow-up questions.',
      },
      {
        type: 'p',
        text: 'A strong EDA playbook prevents random chart-making. It starts with the business question, checks the data, explores variables, compares segments, and ends with documented findings and limitations.',
      },
      { type: 'h2', text: 'Start with a repeatable checklist' },
      {
        type: 'ol',
        items: [
          'Define the question and the decision the analysis supports.',
          'Inspect row count, columns, dtypes, and dataset grain.',
          'Check missing values, duplicates, invalid values, and outliers.',
          'Summarize key numeric and categorical variables.',
          'Visualize distributions, trends, and relationships.',
          'Compare important segments and time periods.',
          'Write findings, caveats, and recommended next steps.',
        ],
      },
      { type: 'h2', text: 'Run core EDA checks' },
      {
        type: 'code',
        language: 'python',
        title: 'Reusable EDA starter',
        code: `import pandas as pd

def eda_overview(df):
    print("shape:", df.shape)
    print("\\ncolumns:")
    print(df.dtypes)
    print("\\nmissing values:")
    print(df.isna().sum().sort_values(ascending=False))
    print("\\nduplicate rows:", df.duplicated().sum())
    print("\\nnumeric summary:")
    print(df.describe(numeric_only=True).T)

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4],
    "channel": ["Organic", "Paid", "Organic", "Referral"],
    "order_value": [80, 120, 95, 60],
    "created_at": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-02", "2026-01-04"]),
})

eda_overview(orders)`,
      },
      { type: 'h2', text: 'Move from overview to question' },
      {
        type: 'code',
        language: 'python',
        title: 'Segment and trend checks',
        code: `channel_summary = (
    orders
    .groupby("channel")
    .agg(
        orders=("order_id", "count"),
        revenue=("order_value", "sum"),
        avg_order_value=("order_value", "mean"),
    )
    .sort_values("revenue", ascending=False)
)

daily_revenue = (
    orders
    .set_index("created_at")
    .resample("D")["order_value"]
    .sum()
)

print(channel_summary)
print(daily_revenue)`,
      },
      {
        type: 'note',
        text: 'EDA is not proof by itself. Treat it as disciplined discovery that produces better questions, hypotheses, and analysis direction.',
      },
      {
        type: 'tip',
        text: 'Keep an EDA notes section with bullets for findings, decisions, and caveats. Your future report will be much easier to write.',
      },
      {
        type: 'try',
        text: 'Use the EDA checklist on a sales dataset. Produce three findings: one data quality issue, one segment difference, and one follow-up question.',
      },
      {
        type: 'keypoints',
        items: [
          'EDA starts with a question and a clear dataset grain.',
          'Quality checks come before conclusions.',
          'Summaries and visuals should lead to focused follow-up questions.',
          'Document findings and limitations as you explore.',
        ],
      },
    ],
  },
  {
    slug: 'da-storytelling',
    title: 'Insight Storytelling',
    description:
      'Turn analysis results into a clear narrative with context, evidence, and action.',
    level: 'intermediate',
    section: 'Analysis Practice',
    order: 45,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Insight storytelling is the skill of turning analysis into understanding. A good story explains what changed, why it matters, what evidence supports it, and what should happen next.',
      },
      {
        type: 'p',
        text: 'Stakeholders do not need every query and chart. They need a truthful path from question to conclusion, with enough detail to trust the recommendation.',
      },
      { type: 'h2', text: 'Use a simple narrative structure' },
      {
        type: 'ol',
        items: [
          'Question: What decision or problem are we addressing?',
          'Context: What baseline, target, or constraint matters?',
          'Finding: What did the data show?',
          'Evidence: Which metric, comparison, or chart supports it?',
          'Action: What should the audience do next?',
          'Caveat: What limitation should they remember?',
        ],
      },
      { type: 'h2', text: 'Convert tables into insight bullets' },
      {
        type: 'code',
        language: 'text',
        title: 'Before and after',
        code: `Weak:
Revenue by channel changed in January.

Stronger:
Paid search revenue grew 18% in January, but average order value fell 9%.
The growth came from more orders, not larger purchases, so the next analysis
should compare campaign volume and discounting by week.`,
      },
      { type: 'h2', text: 'Prepare chart annotations' },
      {
        type: 'code',
        language: 'python',
        title: 'Annotated Matplotlib chart',
        code: `import matplotlib.pyplot as plt

weeks = ["W1", "W2", "W3", "W4"]
revenue = [42_000, 44_000, 57_000, 58_500]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(weeks, revenue, marker="o")
ax.set_title("Paid Search Revenue Increased After Campaign Launch")
ax.set_ylabel("Revenue")
ax.annotate(
    "Campaign launched",
    xy=("W3", 57_000),
    xytext=("W2", 61_000),
    arrowprops={"arrowstyle": "->"},
)
plt.tight_layout()
plt.show()`,
      },
      {
        type: 'note',
        text: 'A data story should not overstate certainty. If the analysis is observational, describe associations and evidence, not guaranteed causes.',
      },
      {
        type: 'tip',
        text: 'Lead with the answer, then show evidence. This respects busy readers and makes the rest of the analysis easier to follow.',
      },
      {
        type: 'try',
        text: 'Take one chart from a previous lesson and write a five-sentence insight story: question, finding, evidence, caveat, and recommendation.',
      },
      {
        type: 'keypoints',
        items: [
          'Insight storytelling connects data to decisions.',
          'Strong findings include context, evidence, and action.',
          'Annotations can guide attention to the important part of a chart.',
          'Be honest about uncertainty and limitations.',
        ],
      },
    ],
  },
  {
    slug: 'da-export',
    title: 'Exporting Results (CSV, Excel, charts)',
    description:
      'Export cleaned data, summary tables, and charts in practical formats for stakeholders.',
    level: 'intermediate',
    section: 'Delivery',
    order: 46,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Analysis becomes useful when results can be shared. Common deliverables include CSV files for data exchange, Excel workbooks for business users, and chart images for slides or reports.',
      },
      {
        type: 'p',
        text: 'Export only what the audience needs. A clean summary table with data definitions is often more useful than a giant raw data dump.',
      },
      { type: 'h2', text: 'Export CSV and Excel files' },
      {
        type: 'code',
        language: 'python',
        title: 'Write analysis outputs',
        code: `import pandas as pd

summary = pd.DataFrame({
    "channel": ["Organic", "Paid", "Referral"],
    "orders": [120, 85, 32],
    "revenue": [9600, 7800, 2100],
})

summary.to_csv("channel_summary.csv", index=False)

with pd.ExcelWriter("analysis_outputs.xlsx") as writer:
    summary.to_excel(writer, sheet_name="Channel Summary", index=False)
    summary.describe(numeric_only=True).to_excel(writer, sheet_name="Stats")`,
      },
      { type: 'h2', text: 'Export a chart image' },
      {
        type: 'code',
        language: 'python',
        title: 'Save a report-ready chart',
        code: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(7, 4))
ax.bar(summary["channel"], summary["revenue"], color="#2563eb")
ax.set_title("Revenue by Channel")
ax.set_xlabel("Channel")
ax.set_ylabel("Revenue")
plt.tight_layout()

fig.savefig("revenue_by_channel.png", dpi=180, bbox_inches="tight")`,
      },
      { type: 'h2', text: 'Include a data dictionary' },
      {
        type: 'code',
        language: 'csv',
        title: 'data_dictionary.csv',
        code: `column,definition
channel,Marketing or acquisition channel assigned to the order
orders,Number of paid orders in the analysis period
revenue,Sum of paid order amount before refunds`,
      },
      {
        type: 'note',
        text: 'CSV does not preserve formatting, formulas, charts, or multiple sheets. Excel is heavier but better for multi-tab stakeholder deliverables.',
      },
      {
        type: 'tip',
        text: 'Add dates or version numbers to output filenames when reports are rerun, such as channel_summary_2026_02_01.csv.',
      },
      {
        type: 'try',
        text: 'Export a cleaned orders table to CSV, a two-sheet Excel workbook with summary and data dictionary sheets, and a PNG chart.',
      },
      {
        type: 'keypoints',
        items: [
          'CSV is simple and portable for tabular data exchange.',
          'Excel workbooks are useful for multi-sheet business deliverables.',
          'Charts should be exported with clear size, resolution, and labels.',
          'A data dictionary helps stakeholders interpret exported columns correctly.',
        ],
      },
    ],
  },
  {
    slug: 'da-reproducible',
    title: 'Reproducible Analysis Projects',
    description:
      'Organize analysis projects so others can rerun, review, and trust your results.',
    level: 'intermediate',
    section: 'Delivery',
    order: 47,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'A reproducible analysis can be rerun and produce the same outputs from the same inputs. Reproducibility makes your work easier to review, debug, automate, and reuse.',
      },
      {
        type: 'p',
        text: 'The main ingredients are clear project structure, pinned dependencies, documented inputs, deterministic scripts, and outputs that can be regenerated.',
      },
      { type: 'h2', text: 'Use a simple project layout' },
      {
        type: 'code',
        language: 'text',
        title: 'Analysis project structure',
        code: `customer-churn-analysis/
  README.md
  requirements.txt
  data/
    raw/
    processed/
  notebooks/
  scripts/
    prepare_data.py
    analyze_churn.py
  outputs/
    tables/
    charts/`,
      },
      { type: 'h2', text: 'Document dependencies and commands' },
      {
        type: 'code',
        language: 'text',
        title: 'requirements.txt',
        code: `pandas
matplotlib
seaborn
sqlalchemy
requests`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Rebuild outputs',
        code: `python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/prepare_data.py
python scripts/analyze_churn.py`,
      },
      { type: 'h2', text: 'Make scripts path-safe' },
      {
        type: 'code',
        language: 'python',
        title: 'Use paths relative to the project',
        code: `from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA = PROJECT_ROOT / "data" / "raw" / "customers.csv"
OUTPUT_DIR = PROJECT_ROOT / "outputs" / "tables"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

customers = pd.read_csv(RAW_DATA)
summary = customers.groupby("plan")["customer_id"].count().reset_index(name="customers")
summary.to_csv(OUTPUT_DIR / "customers_by_plan.csv", index=False)`,
      },
      {
        type: 'note',
        text: 'Reproducibility does not mean committing private raw data. Store sensitive data securely and commit instructions, schemas, samples, or synthetic data when appropriate.',
      },
      {
        type: 'tip',
        text: 'Put the exact command to rerun the project in the README. If someone has to guess the command, the project is not reproducible yet.',
      },
      {
        type: 'try',
        text: 'Create a README outline for an analysis project with sections for goal, data sources, setup, how to rerun, outputs, and limitations.',
      },
      {
        type: 'keypoints',
        items: [
          'Reproducible analysis can be rerun from documented inputs to outputs.',
          'Project structure separates raw data, scripts, notebooks, and outputs.',
          'Dependencies and commands should be documented clearly.',
          'Sensitive data should not be committed just to make a project convenient.',
        ],
      },
    ],
  },
  {
    slug: 'da-notebook-to-script',
    title: 'From Notebook to Script',
    description:
      'Turn exploratory notebook work into a maintainable Python script that can be rerun.',
    level: 'intermediate',
    section: 'Delivery',
    order: 48,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Notebooks are excellent for exploration, but repeated analysis benefits from scripts. A script can be run by another person, scheduled, tested, and reviewed more easily.',
      },
      {
        type: 'p',
        text: 'The conversion process is not copy-paste only. It means removing dead experiments, naming inputs and outputs, creating functions, and adding a clear entry point.',
      },
      { type: 'h2', text: 'Start by identifying the pipeline' },
      {
        type: 'ol',
        items: [
          'Load configuration and input paths.',
          'Read raw data.',
          'Clean and validate columns.',
          'Create analysis summaries.',
          'Export tables and charts.',
          'Print a short completion message.',
        ],
      },
      { type: 'h2', text: 'Refactor notebook cells into functions' },
      {
        type: 'code',
        language: 'python',
        title: 'Script skeleton',
        code: `from pathlib import Path
import pandas as pd


def load_orders(path):
    return pd.read_csv(path, parse_dates=["order_date"])


def clean_orders(orders):
    cleaned = orders.copy()
    cleaned = cleaned.dropna(subset=["order_id", "order_date", "total_amount"])
    cleaned = cleaned[cleaned["total_amount"] >= 0]
    cleaned["channel"] = cleaned["channel"].str.strip().str.title()
    return cleaned


def summarize_revenue(orders):
    return (
        orders
        .groupby("channel", as_index=False)
        .agg(orders=("order_id", "count"), revenue=("total_amount", "sum"))
        .sort_values("revenue", ascending=False)
    )


def main():
    project_root = Path(__file__).resolve().parents[1]
    input_path = project_root / "data" / "raw" / "orders.csv"
    output_path = project_root / "outputs" / "channel_revenue.csv"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    orders = load_orders(input_path)
    clean = clean_orders(orders)
    summary = summarize_revenue(clean)
    summary.to_csv(output_path, index=False)
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()`,
      },
      { type: 'h2', text: 'Run the script from the command line' },
      {
        type: 'code',
        language: 'bash',
        title: 'Run analysis script',
        code: `python scripts/analyze_orders.py`,
      },
      {
        type: 'note',
        text: 'A notebook can remain as the exploration record, while the script becomes the reproducible source of truth for recurring outputs.',
      },
      {
        type: 'tip',
        text: 'If you cannot explain a notebook cell purpose in one sentence, do not move it into the script yet. Clarify or delete it first.',
      },
      {
        type: 'try',
        text: 'Choose one notebook analysis and outline the functions you would create: load, clean, summarize, visualize, and export.',
      },
      {
        type: 'keypoints',
        items: [
          'Notebooks are strong for exploration; scripts are stronger for repeatable delivery.',
          'Refactoring means keeping only the steps needed to reproduce the result.',
          'Functions make analysis code easier to test and review.',
          'A main() entry point makes scripts safe to import and simple to run.',
        ],
      },
    ],
  },
];
