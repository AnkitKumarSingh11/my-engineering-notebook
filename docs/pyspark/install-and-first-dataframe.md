# PySpark: Install and Run Your First DataFrame

This guide sets up PySpark locally and runs a small DataFrame job to confirm everything works.

## Option A (recommended): Install PySpark via Python

This is the quickest setup for local learning and small experiments.

### 1) Create a virtual environment

If you use `uv`:

```bash
uv venv
source .venv/bin/activate
```

(You can also use `python -m venv .venv`.)

### 2) Install PySpark

```bash
uv pip install pyspark
```

### 3) Validate by launching the PySpark shell

```bash
pyspark
```

You should see a Spark session start.

### 4) Run a tiny DataFrame job

Create a file `quick_check.py` and run it:

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("pyspark-quick-check").getOrCreate()

df = spark.createDataFrame(
    [("Ankit", 1), ("Spark", 2), ("PySpark", 3)],
    ["name", "value"],
)

df.show()
print("count:", df.count())

spark.stop()
```

```bash
python quick_check.py
```

## Option B: Use PySpark with a separate Spark installation

If you already installed Apache Spark (for example under `/opt/spark`), you can reuse that distribution.

### 1) Ensure Spark is on your PATH

```bash
export SPARK_HOME=/opt/spark
export PATH="$SPARK_HOME/bin:$PATH"
```

### 2) Install PySpark

```bash
uv pip install pyspark
```

### 3) Point PySpark to your Spark (optional)

In many setups PySpark will work without this, but if you need to force a specific Spark distribution:

```bash
export PYSPARK_PYTHON=python
```

Then run:

```bash
pyspark
```

## Common issues

### Java not found

PySpark still needs Java.

```bash
java -version
```

If missing, install a JDK (commonly JDK 11 or 17).

### `pyspark` command not found

- Confirm you installed `pyspark` into the currently active environment.
- If you’re in a venv, ensure it’s activated:

```bash
which python
which pyspark
```

---

Next: write a small ETL and run it with `spark-submit`.
