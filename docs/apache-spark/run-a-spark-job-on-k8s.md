# Running a Spark Job on Kubernetes (Rancher Desktop)

This blog provides a step-by-step guide to run a Spark application packaged as a JAR on a Kubernetes cluster using Rancher Desktop.

---

## Prerequisites

- **Rancher Desktop** installed and running (with Kubernetes enabled)
- **Docker** CLI configured via Rancher Desktop
- **kubectl** installed and configured to use Rancher Desktop cluster
- Apache Spark job compiled into a JAR (e.g., `ecommerce-analysis-1.0-SNAPSHOT.jar`)
- Optional: Maven or Gradle project for building your Spark application

---

## Step 1: Prepare Your Project Directory

Assuming the project directory structure:

```
ecommerce-analysis/
├── Dockerfile
├── spark-jars/
│   └── ecommerce-analysis-1.0-SNAPSHOT.jar
└── src/...
```

- Place your compiled JAR inside `spark-jars/`.

---

## Step 2: Create a Docker Image for Spark Job

Create a `Dockerfile` in the project root:

```dockerfile
FROM apache/spark:3.5.3

USER root

# Create a directory for the application JAR
RUN mkdir -p /opt/app

# Copy the application JAR into the image
COPY spark-jars/ecommerce-analysis-1.0-SNAPSHOT.jar /opt/app/

# Fix permissions
RUN chown -R spark:spark /opt/app

USER spark
```

---

### Step 2.1: Build the Docker Image

```bash
docker build -t sample-spark:latest .
```

Verify that the JAR exists inside the image:

```bash
docker run --rm sample-spark:latest ls -l /opt/app
```

You should see:

```
ecommerce-analysis-1.0-SNAPSHOT.jar
```

---

## Step 3: Create a Service Account (if not already)

Spark-on-Kubernetes requires a service account. Example:

```bash
kubectl create serviceaccount spark
kubectl create clusterrolebinding spark-role \
  --clusterrole=edit \
  --serviceaccount=default:spark
```

---

## Step 4: Submit the Spark Job

```bash
spark-submit \
  --master k8s://https://127.0.0.1:6443 \
  --deploy-mode cluster \
  --name ecommerce-analysis \
  --class org.example.App \
  --conf spark.kubernetes.container.image=sample-spark:latest \
  --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
  --conf spark.executor.instances=2 \
  local:///opt/app/ecommerce-analysis-1.0-SNAPSHOT.jar
```

### Notes:

- **local://** refers to the path **inside the container**, not your host machine.
- `/opt/app` is chosen because `/opt/spark/work-dir` is **overwritten by Spark at runtime**.

---

## Step 5: Monitor the Job

Get the list of pods:

```bash
kubectl get pods
```

Check driver logs:

```bash
kubectl logs -f <driver-pod-name>
```

Check executor logs:

```bash
kubectl logs -f <executor-pod-name>
```

---

## Step 6: Common Gotchas

1. **JAR missing at runtime**

   - Cause: `/opt/spark/work-dir` is mounted as an empty volume
   - Fix: Place the JAR in a directory like `/opt/app` that Spark does **not mount over**.

2. **ClassNotFoundException**

   - Cause: Your JAR is not a **fat JAR** (missing dependencies)
   - Fix: Use Maven Shade Plugin or Gradle Shadow Plugin to build an **uber JAR**.

3. **EC Key / BouncyCastle error**

   - Cause: Missing runtime dependency for Kubernetes client
   - Fix: Include BouncyCastle JARs in the image or Spark classpath.
   Download the following jars and move them to your Spark Jars. 
   ```bash
        mkdir ~/spark-jars/ 
        cd ~/spark-jars

        wget https://repo1.maven.org/maven2/org/bouncycastle/bcprov-jdk18on/1.78.1/bcprov-jdk18on-1.78.1.jar
        wget https://repo1.maven.org/maven2/org/bouncycastle/bcpkix-jdk18on/1.78.1/bcpkix-jdk18on-1.78.1.jar

        cp ~/spark-jars/*.jar $SPARK_HOME/jars/
   ```

---

## Step 7: Optional Improvements

- Build a **fat JAR** to avoid dependency issues
- Externalize configs using **ConfigMaps**
- Mount input data using **PersistentVolumes**
- Expose Spark UI via NodePort or Ingress for debugging

---

## References

- [Apache Spark Kubernetes Documentation](https://spark.apache.org/docs/latest/running-on-kubernetes.html)
- [Rancher Desktop](https://rancherdesktop.io/)
- [Spark Submit Options](https://spark.apache.org/docs/latest/submitting-applications.html)
