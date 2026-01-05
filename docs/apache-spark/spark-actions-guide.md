# Complete Guide to Apache Spark Actions

Apache Spark actions are operations that trigger the execution of transformations and return a value to the driver program or write data to external storage. Unlike transformations, actions are eager operations that execute immediately. This guide covers all common actions with detailed explanations and Java examples.

## Summary

Apache Spark provides various actions for different use cases:

| Category | Actions |
|----------|---------|
| Aggregation | reduce, count, countByKey |
| Retrieval | collect, first, take, takeSample, takeOrdered |
| Persistence | saveAsTextFile, saveAsSequenceFile, saveAsObjectFile |
| Side Effects | foreach |
| Asynchronous | collectAsync, foreachAsync, countAsync |

### Key Differences: Transformations vs Actions

- **Transformations**: Lazy, return new RDDs, not executed immediately
- **Actions**: Eager, return values or write data, trigger computation immediately

### Best Practices

1. **Use collect() carefully**: Only use on small datasets that fit in driver memory
2. **Prefer take() over collect()**: For inspecting data during development
3. **Use foreach() for side effects**: Writing to databases, updating accumulators
4. **Choose the right action**: Use count() instead of collect().size() for efficiency
5. **Consider async actions**: For parallel execution of multiple actions
6. **Be cautious with saveAs* actions**: They write to distributed storage, ensure proper paths

Actions trigger the actual execution of all lazy transformations in the computation graph, so choosing the right action is crucial for performance and correctness.

---

## 1. Reduce Action

### Overview
The `reduce()` action aggregates the elements of the dataset using a function that takes two arguments and returns one. The function should be commutative and associative for correct parallel computation.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class ReduceExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("ReduceExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5)
        );

        // Sum all elements using reduce
        Integer sum = numbers.reduce((a, b) -> a + b);
        System.out.println("Sum: " + sum);
        // Output: Sum: 15

        // Find maximum using reduce
        Integer max = numbers.reduce((a, b) -> Math.max(a, b));
        System.out.println("Max: " + max);
        // Output: Max: 5

        jsc.close();
    }
}
```

---

## 2. Collect Action

### Overview
The `collect()` action returns all elements of the dataset as an array to the driver program. Should be used only when the result is small enough to fit in memory.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;
import java.util.List;

public class CollectExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("CollectExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5)
        );

        // Apply transformation
        JavaRDD<Integer> squared = numbers.map(x -> x * x);

        // Collect results to driver
        List<Integer> result = squared.collect();
        System.out.println("Collected: " + result);
        // Output: Collected: [1, 4, 9, 16, 25]

        jsc.close();
    }
}
```

---

## 3. Count Action

### Overview
The `count()` action returns the number of elements in the dataset as a long value.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class CountExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("CountExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        );

        // Count total elements
        long totalCount = numbers.count();
        System.out.println("Total count: " + totalCount);
        // Output: Total count: 10

        // Count after filtering
        long evenCount = numbers.filter(x -> x % 2 == 0).count();
        System.out.println("Even count: " + evenCount);
        // Output: Even count: 5

        jsc.close();
    }
}
```

---

## 4. First Action

### Overview
The `first()` action returns the first element of the dataset. Similar to `take(1)` but returns a single element instead of an array.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class FirstExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("FirstExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(5, 2, 8, 1, 9)
        );

        // Get first element
        Integer first = numbers.first();
        System.out.println("First element: " + first);
        // Output: First element: 5

        // Get first even number
        Integer firstEven = numbers.filter(x -> x % 2 == 0).first();
        System.out.println("First even: " + firstEven);
        // Output: First even: 2

        jsc.close();
    }
}
```

---

## 5. Take Action

### Overview
The `take(n)` action returns an array with the first n elements of the dataset.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;
import java.util.List;

public class TakeExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("TakeExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        );

        // Take first 5 elements
        List<Integer> firstFive = numbers.take(5);
        System.out.println("First 5: " + firstFive);
        // Output: First 5: [1, 2, 3, 4, 5]

        // Take after transformation
        List<Integer> firstThreeSquared = numbers.map(x -> x * x).take(3);
        System.out.println("First 3 squared: " + firstThreeSquared);
        // Output: First 3 squared: [1, 4, 9]

        jsc.close();
    }
}
```

---

## 6. TakeSample Action

### Overview
The `takeSample()` action returns an array with a random sample of elements from the dataset. You can specify whether sampling is with or without replacement, the number of elements, and an optional random seed.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;
import java.util.List;

public class TakeSampleExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("TakeSampleExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        );

        // Take random sample without replacement
        List<Integer> sample1 = numbers.takeSample(false, 5, 42);
        System.out.println("Sample without replacement: " + sample1);

        // Take random sample with replacement
        List<Integer> sample2 = numbers.takeSample(true, 5, 42);
        System.out.println("Sample with replacement: " + sample2);

        jsc.close();
    }
}
```

---

## 7. TakeOrdered Action

### Overview
The `takeOrdered()` action returns the first n elements of the RDD using either their natural order or a custom comparator.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class TakeOrderedExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("TakeOrderedExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(5, 2, 9, 1, 7, 3, 8, 4, 6)
        );

        // Take 5 smallest elements (natural order)
        List<Integer> smallest = numbers.takeOrdered(5);
        System.out.println("5 smallest: " + smallest);
        // Output: 5 smallest: [1, 2, 3, 4, 5]

        // Take 5 largest elements (reverse order)
        List<Integer> largest = numbers.takeOrdered(5, 
            Comparator.reverseOrder());
        System.out.println("5 largest: " + largest);
        // Output: 5 largest: [9, 8, 7, 6, 5]

        jsc.close();
    }
}
```

---

## 8. SaveAsTextFile Action

### Overview
The `saveAsTextFile()` action writes the elements of the dataset as a text file (or set of text files) to a specified directory. Spark calls `toString()` on each element to convert it to text.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class SaveAsTextFileExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("SaveAsTextFileExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5)
        );

        // Transform data
        JavaRDD<String> output = numbers.map(x -> "Number: " + (x * x));

        // Save to text file
        output.saveAsTextFile("/tmp/spark-output");
        System.out.println("Data saved to /tmp/spark-output");

        // Can also save to HDFS
        // output.saveAsTextFile("hdfs://namenode:9000/output");

        jsc.close();
    }
}
```

---

## 9. SaveAsSequenceFile Action

### Overview
The `saveAsSequenceFile()` action writes elements as a Hadoop SequenceFile. Available on RDDs of key-value pairs that implement Hadoop's Writable interface. (Java and Scala only)

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import scala.Tuple2;
import java.util.Arrays;

public class SaveAsSequenceFileExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("SaveAsSequenceFileExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<String, Integer> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>("apple", 5),
                new Tuple2<>("banana", 3),
                new Tuple2<>("orange", 7)
            )
        );

        // Convert to Writable types
        JavaPairRDD<Text, IntWritable> writablePairs = pairs.mapToPair(
            tuple -> new Tuple2<>(
                new Text(tuple._1()),
                new IntWritable(tuple._2())
            )
        );

        // Save as SequenceFile
        writablePairs.saveAsSequenceFile("/tmp/sequence-output");
        System.out.println("Saved as SequenceFile");

        jsc.close();
    }
}
```

---

## 10. SaveAsObjectFile Action

### Overview
The `saveAsObjectFile()` action writes the elements of the dataset using Java serialization, which can be loaded later using `SparkContext.objectFile()`. (Java and Scala only)

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class SaveAsObjectFileExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("SaveAsObjectFileExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5)
        );

        JavaRDD<Integer> squared = numbers.map(x -> x * x);

        // Save as object file
        squared.saveAsObjectFile("/tmp/object-output");
        System.out.println("Saved as ObjectFile");

        // Load it back
        JavaRDD<Integer> loaded = jsc.objectFile("/tmp/object-output");
        System.out.println("Loaded: " + loaded.collect());

        jsc.close();
    }
}
```

---

## 11. CountByKey Action

### Overview
The `countByKey()` action is available only on RDDs of type (K, V). Returns a hashmap of (K, Int) pairs with the count of each key.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;
import java.util.Map;

public class CountByKeyExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("CountByKeyExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<String, Integer> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>("apple", 1),
                new Tuple2<>("banana", 2),
                new Tuple2<>("apple", 3),
                new Tuple2<>("banana", 4),
                new Tuple2<>("apple", 5)
            )
        );

        // Count occurrences of each key
        Map<String, Long> counts = pairs.countByKey();
        
        System.out.println("Count by key:");
        for (Map.Entry<String, Long> entry : counts.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        // Output: apple: 3
        //         banana: 2

        jsc.close();
    }
}
```

---

## 12. Foreach Action

### Overview
The `foreach()` action runs a function on each element of the dataset. Usually done for side effects such as updating an Accumulator or interacting with external storage systems.

**Important:** Modifying variables other than Accumulators outside of `foreach()` may result in undefined behavior.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.util.LongAccumulator;
import java.util.Arrays;

public class ForeachExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("ForeachExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5)
        );

        // Using accumulator for side effects
        LongAccumulator accumulator = jsc.sc().longAccumulator("My Accumulator");

        numbers.foreach(x -> {
            accumulator.add(x);
            System.out.println("Processing: " + x);
        });

        System.out.println("Accumulator value: " + accumulator.value());
        // Output: Accumulator value: 15

        // Example with external storage (writing to database, etc.)
        numbers.foreach(x -> {
            // Insert into database
            // saveToDatabase(x);
            System.out.println("Would save to DB: " + x);
        });

        jsc.close();
    }
}
```

---

## Asynchronous Actions

### Overview
Spark RDD API provides asynchronous versions of some actions that immediately return a `FutureAction` instead of blocking on completion. This allows managing or waiting for asynchronous execution.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaFutureAction;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class AsyncActionExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("AsyncActionExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5)
        );

        // Start async collect
        JavaFutureAction<List<Integer>> futureResult = numbers.collectAsync();

        System.out.println("Action started asynchronously...");
        
        // Do other work here...
        System.out.println("Doing other work...");

        try {
            // Wait for result
            List<Integer> result = futureResult.get();
            System.out.println("Result: " + result);
            // Output: Result: [1, 2, 3, 4, 5]
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        // Can also use foreachAsync
        JavaFutureAction<Void> foreachFuture = numbers.foreachAsync(
            x -> System.out.println("Async processing: " + x)
        );

        // Check if done
        System.out.println("Is done? " + foreachFuture.isDone());

        jsc.close();
    }
}
```

---