# Installing Apache Spark on a Local Machine

This guide installs Apache Spark on your local machine so you can run `spark-shell`, `pyspark`, and submit jobs with `spark-submit`.

## Prerequisites

- **Java**: Spark needs a Java runtime (JDK 8+). Most modern Spark releases work well with JDK 11 or 17.
- **Python (optional)**: If you plan to use PySpark.

### Verify Java

```bash
java -version
```

If Java is not installed, install a JDK using your OS package manager (for example, OpenJDK).

## Install Spark (Linux/macOS)

### 1) Download a Spark binary

Pick a Spark release from the official downloads page and choose a **pre-built** package (for example, “Pre-built for Apache Hadoop 3 and later”).

### 2) Extract it

If you downloaded a `.tgz`:

```bash
cd ~/Downloads
# Example filename: spark-<version>-bin-hadoop3.tgz

tar -xzf spark-*-bin-*.tgz
```

### 3) Move to a stable location

```bash
sudo mv spark-*-bin-* /opt/spark
```

(If you don’t want to use `sudo`, you can place it under your home directory, e.g. `~/spark`.)

### 4) Set environment variables

Add these to your shell profile (e.g. `~/.bashrc`, `~/.zshrc`):

```bash
export SPARK_HOME=/opt/spark
export PATH="$SPARK_HOME/bin:$SPARK_HOME/sbin:$PATH"
```

Reload your shell:

```bash
source ~/.zshrc  # or: source ~/.bashrc
```

### 5) Validate installation

Run Spark shell:

```bash
spark-shell
```

You should see Spark start and a Scala prompt.

## Install Spark (Windows)

On Windows, the simplest local setup is often via **WSL2** (Windows Subsystem for Linux). If you’re using WSL2, follow the Linux steps above.

If you want to run Spark directly on Windows without WSL, you typically need:

- A Spark binary distribution
- Java installed and configured
- (For some setups) `winutils.exe` / Hadoop native bits depending on Spark/Hadoop combination

Because Windows-native setup has multiple variants, prefer WSL2 unless you specifically need native Windows.

## Optional: Run PySpark

If you have Python installed, you can run:

```bash
pyspark
```

You can also test a quick Spark job:

```bash
python -c "from pyspark.sql import SparkSession; print(SparkSession.builder.getOrCreate().range(5).count())"
```

## Common issues

### `JAVA_HOME` not set / Java not found

Some environments require `JAVA_HOME`.

- Find your Java path and set:

```bash
export JAVA_HOME=/path/to/jdk
export PATH="$JAVA_HOME/bin:$PATH"
```

### `spark-shell` not found

- Confirm `SPARK_HOME` and `PATH` are set and your shell has been reloaded.
- Check:

```bash
echo "$SPARK_HOME"
which spark-shell
```

---

Next: add your first local job and run it with `spark-submit`.
