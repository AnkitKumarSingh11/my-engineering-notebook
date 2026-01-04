# Complete Guide to Apache Spark RDD Transformations
Apache Spark transformations are operations that create a new RDD from an existing one. They are lazy operations, meaning they don't execute until an action is called. This guide covers all common transformations with detailed explanations and Java examples.

---
## Summary

Apache Spark provides a rich set of transformations for data processing:

| Category | Transformations |
|----------|-----------------|
| Element-wise | map, filter, flatMap |
| Partition-wise | mapPartitions, mapPartitionsWithIndex |
| Sampling | sample |
| Set operations | union, intersection, distinct |
| Pair RDD operations | groupByKey, reduceByKey, aggregateByKey, sortByKey, join, cogroup |
| Reshaping | cartesian, pipe, coalesce, repartition, repartitionAndSortWithinPartitions |

All transformations are lazy, meaning they don't execute until an action (like `collect()` or `count()`) is called. This lazy evaluation allows Spark to optimize the execution plan before running the actual computation.

---
## RDD Transformations and their Usage
## 1. Map Transformation

### Overview
The `map()` transformation returns a new distributed dataset by passing each element of the source RDD through a provided function. It's a one-to-one transformation.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;

public class MapExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("MapExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            java.util.Arrays.asList(1, 2, 3, 4, 5)
        );

        // Square each number
        JavaRDD<Integer> squared = numbers.map(x -> x * x);

        System.out.println(squared.collect());
        // Output: [1, 4, 9, 16, 25]
        jsc.close();
    }
}
```

---

## 2. Filter Transformation

### Overview
The `filter()` transformation returns a new dataset containing only those elements for which a given function returns true.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;

public class FilterExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("FilterExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            java.util.Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        );

        // Keep only even numbers
        JavaRDD<Integer> evens = numbers.filter(x -> x % 2 == 0);

        System.out.println(evens.collect());
        // Output: [2, 4, 6, 8, 10]
        jsc.close();
    }
}
```

---

## 3. FlatMap Transformation

### Overview
Similar to `map()`, but each input element can be mapped to zero or more output items. The results are flattened into a single RDD.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class FlatMapExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("FlatMapExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<String> sentences = jsc.parallelize(
            Arrays.asList("Hello World", "Spark is great", "FlatMap example")
        );

        // Split sentences into words
        JavaRDD<String> words = sentences.flatMap(
            sentence -> Arrays.asList(sentence.split(" ")).iterator()
        );

        System.out.println(words.collect());
        // Output: [Hello, World, Spark, is, great, FlatMap, example]
        jsc.close();
    }
}
```

---

## 4. MapPartitions Transformation

### Overview
Similar to `map()`, but runs separately on each partition of the RDD. The function receives an iterator over the partition and must return an iterator over the transformed elements. Useful for expensive setup/teardown operations.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MapPartitionsExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("MapPartitionsExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            java.util.Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8), 2
        );

        // Process entire partition at once
        JavaRDD<Integer> doubled = numbers.mapPartitions(iterator -> {
            List<Integer> result = new ArrayList<>();
            System.out.println("Processing partition...");
            while (iterator.hasNext()) {
                result.add(iterator.next() * 2);
            }
            return result.iterator();
        });

        System.out.println(doubled.collect());
        // Output: [2, 4, 6, 8, 10, 12, 14, 16]
        jsc.close();
    }
}
```

---

## 5. MapPartitionsWithIndex Transformation

### Overview
Similar to `mapPartitions()`, but also provides the function with an integer index representing the partition number. Useful for applying different logic based on partition.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MapPartitionsWithIndexExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("MapPartitionsWithIndexExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            java.util.Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8), 2
        );

        // Add partition index prefix
        JavaRDD<String> result = numbers.mapPartitionsWithIndex((partIdx, iterator) -> {
            List<String> list = new ArrayList<>();
            while (iterator.hasNext()) {
                list.add("P" + partIdx + ": " + iterator.next());
            }
            return list.iterator();
        }, true);

        System.out.println(result.collect());
        // Output: [P0: 1, P0: 2, P0: 3, P0: 4, P1: 5, P1: 6, P1: 7, P1: 8]
        jsc.close();
    }
}
```

---

## 6. Sample Transformation

### Overview
Returns a new RDD that is a random sample of the source dataset. You can specify whether sampling is done with or without replacement, the fraction to sample, and a random seed for reproducibility.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class SampleExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("SampleExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                         11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
        );

        // Sample 30% without replacement
        JavaRDD<Integer> sample = numbers.sample(false, 0.3, 42);

        System.out.println("Sample: " + sample.collect());
        System.out.println("Size: " + sample.count());
        jsc.close();
    }
}
```

---

## 7. Union Transformation

### Overview
Returns a new RDD containing the union of elements in the source dataset and another dataset. Duplicates are preserved.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class UnionExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("UnionExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> rdd1 = jsc.parallelize(Arrays.asList(1, 2, 3, 4));
        JavaRDD<Integer> rdd2 = jsc.parallelize(Arrays.asList(5, 6, 7, 8));

        // Union two RDDs
        JavaRDD<Integer> unionRDD = rdd1.union(rdd2);

        System.out.println(unionRDD.collect());
        // Output: [1, 2, 3, 4, 5, 6, 7, 8]
        jsc.close();
    }
}
```

---

## 8. Intersection Transformation

### Overview
Returns a new RDD containing the intersection of elements in the source dataset and another dataset. Only elements present in both RDDs are returned.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class IntersectionExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("IntersectionExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> rdd1 = jsc.parallelize(Arrays.asList(1, 2, 3, 4, 5));
        JavaRDD<Integer> rdd2 = jsc.parallelize(Arrays.asList(3, 4, 5, 6, 7));

        // Find common elements
        JavaRDD<Integer> intersection = rdd1.intersection(rdd2);

        System.out.println(intersection.collect());
        // Output: [3, 4, 5]
        jsc.close();
    }
}
```

---

## 9. Distinct Transformation

### Overview
Returns a new RDD containing the distinct elements of the source dataset. You can optionally specify the number of partitions.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class DistinctExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("DistinctExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5)
        );

        // Get distinct elements
        JavaRDD<Integer> distinct = numbers.distinct();

        System.out.println(distinct.collect());
        // Output: [1, 2, 3, 4, 5]
        jsc.close();
    }
}
```

---

## 10. GroupByKey Transformation

### Overview
When called on a dataset of (K, V) pairs, returns a dataset of (K, Iterable<V>) pairs. Note: For aggregation operations, `reduceByKey` or `aggregateByKey` are preferred for better performance.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class GroupByKeyExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("GroupByKeyExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<String, Integer> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>("apple", 5),
                new Tuple2<>("banana", 3),
                new Tuple2<>("apple", 2),
                new Tuple2<>("banana", 4)
            )
        );

        // Group by key
        JavaPairRDD<String, Iterable<Integer>> grouped = pairs.groupByKey();

        System.out.println(grouped.collect());
        // Output: [(apple,[5,2]), (banana,[3,4])]
        jsc.close();
    }
}
```

---

## 11. ReduceByKey Transformation

### Overview
When called on a dataset of (K, V) pairs, returns a dataset of (K, V) pairs where values for each key are aggregated using the given reduce function. More efficient than `groupByKey` for aggregations.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class ReduceByKeyExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("ReduceByKeyExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<String, Integer> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>("apple", 5),
                new Tuple2<>("banana", 3),
                new Tuple2<>("apple", 2),
                new Tuple2<>("banana", 4)
            )
        );

        // Sum values by key
        JavaPairRDD<String, Integer> summed = pairs.reduceByKey((a, b) -> a + b);

        System.out.println(summed.collect());
        // Output: [(apple,7), (banana,7)]
        jsc.close();
    }
}
```

---

## 12. AggregateByKey Transformation

### Overview
When called on a dataset of (K, V) pairs, aggregates values using a zero value, combine functions, and a merge function. Allows aggregation into a different type than the input.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class AggregateByKeyExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("AggregateByKeyExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<String, Integer> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>("a", 1),
                new Tuple2<>("b", 1),
                new Tuple2<>("a", 1)
            )
        );

        // Aggregate by key: count and sum
        JavaPairRDD<String, Tuple2<Integer, Integer>> result = pairs.aggregateByKey(
            new Tuple2<>(0, 0),
            (acc, value) -> new Tuple2<>(acc._1() + 1, acc._2() + value),
            (acc1, acc2) -> new Tuple2<>(acc1._1() + acc2._1(), acc1._2() + acc2._2())
        );

        System.out.println(result.collect());
        // Output: [(a,(2,2)), (b,(1,1))]
        jsc.close();
    }
}
```

---

## 13. SortByKey Transformation

### Overview
When called on a dataset of (K, V) pairs where K implements `Ordered`, returns a dataset sorted by keys in ascending or descending order.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class SortByKeyExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("SortByKeyExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<Integer, String> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>(3, "three"),
                new Tuple2<>(1, "one"),
                new Tuple2<>(4, "four"),
                new Tuple2<>(2, "two")
            )
        );

        // Sort by key (ascending)
        JavaPairRDD<Integer, String> sorted = pairs.sortByKey();

        System.out.println(sorted.collect());
        // Output: [(1,one), (2,two), (3,three), (4,four)]
        jsc.close();
    }
}
```

---

## 14. Join Transformation

### Overview
When called on datasets of type (K, V) and (K, W), returns a dataset of (K, (V, W)) pairs with all pairs of elements for each key. Supports inner, left, right, and full outer joins.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class JoinExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("JoinExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<Integer, String> rdd1 = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>(1, "Alice"),
                new Tuple2<>(2, "Bob"),
                new Tuple2<>(3, "Charlie")
            )
        );

        JavaPairRDD<Integer, String> rdd2 = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>(1, "Engineer"),
                new Tuple2<>(2, "Designer"),
                new Tuple2<>(4, "Manager")
            )
        );

        // Inner join
        JavaPairRDD<Integer, Tuple2<String, String>> joined = rdd1.join(rdd2);

        System.out.println(joined.collect());
        // Output: [(1,(Alice,Engineer)), (2,(Bob,Designer))]
        jsc.close();
    }
}
```

---

## 15. Cogroup Transformation

### Overview
When called on datasets of type (K, V) and (K, W), returns a dataset of (K, (Iterable<V>, Iterable<W>)) tuples. Also called `groupWith`.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class CogroupExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("CogroupExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<Integer, String> rdd1 = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>(1, "Alice"),
                new Tuple2<>(2, "Bob")
            )
        );

        JavaPairRDD<Integer, String> rdd2 = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>(1, "Engineer"),
                new Tuple2<>(1, "Experienced"),
                new Tuple2<>(2, "Designer")
            )
        );

        // Cogroup
        JavaPairRDD<Integer, Tuple2<Iterable<String>, Iterable<String>>> grouped = 
            rdd1.cogroup(rdd2);

        System.out.println(grouped.collect());
        jsc.close();
    }
}
```

---

## 16. Cartesian Transformation

### Overview
When called on datasets of types T and U, returns a dataset of (T, U) pairs containing all pairs of elements.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import java.util.Arrays;

public class CartesianExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("CartesianExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> rdd1 = jsc.parallelize(Arrays.asList(1, 2));
        JavaRDD<String> rdd2 = jsc.parallelize(Arrays.asList("a", "b", "c"));

        // Cartesian product
        JavaPairRDD<Integer, String> cartesian = rdd1.cartesian(rdd2);

        System.out.println(cartesian.collect());
        // Output: [(1,a), (1,b), (1,c), (2,a), (2,b), (2,c)]
        jsc.close();
    }
}
```

---

## 17. Pipe Transformation

### Overview
Pipes each partition of the RDD through a shell command (e.g., Perl or bash script). RDD elements are written to the process's stdin and lines output to stdout are returned as an RDD of strings.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class PipeExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("PipeExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<String> data = jsc.parallelize(
            Arrays.asList("1", "2", "3", "4", "5")
        );

        // Pipe through a shell command (cat will echo the input)
        JavaRDD<String> result = data.pipe("cat");

        System.out.println(result.collect());
        // Output: [1, 2, 3, 4, 5]
        jsc.close();
    }
}
```

---

## 18. Coalesce Transformation

### Overview
Decreases the number of partitions in the RDD to a specified number. Useful for running operations more efficiently after filtering down a large dataset.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class CoalesceExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("CoalesceExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8), 4
        );

        System.out.println("Original partitions: " + numbers.getNumPartitions());
        
        // Reduce to 2 partitions
        JavaRDD<Integer> coalesced = numbers.coalesce(2);

        System.out.println("Coalesced partitions: " + coalesced.getNumPartitions());
        jsc.close();
    }
}
```

---

## 19. Repartition Transformation

### Overview
Reshuffles the data in the RDD randomly to create either more or fewer partitions and balance data across them. This always shuffles all data over the network.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;

public class RepartitionExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("RepartitionExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaRDD<Integer> numbers = jsc.parallelize(
            Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8), 2
        );

        System.out.println("Original partitions: " + numbers.getNumPartitions());
        
        // Increase to 4 partitions
        JavaRDD<Integer> repartitioned = numbers.repartition(4);

        System.out.println("Repartitioned to: " + repartitioned.getNumPartitions());
        jsc.close();
    }
}
```

---

## 20. RepartitionAndSortWithinPartitions Transformation

### Overview
Repartitions the RDD according to a given partitioner and sorts records by their keys within each resulting partition. More efficient than separate repartition and sort operations.

### Java Example
```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.HashPartitioner;
import scala.Tuple2;
import java.util.Arrays;

public class RepartitionAndSortWithinPartitionsExample {
    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("RepartitionAndSortExample");
        JavaSparkContext jsc = new JavaSparkContext(conf);

        JavaPairRDD<Integer, String> pairs = jsc.parallelizePairs(
            Arrays.asList(
                new Tuple2<>(3, "three"),
                new Tuple2<>(1, "one"),
                new Tuple2<>(4, "four"),
                new Tuple2<>(2, "two"),
                new Tuple2<>(5, "five")
            )
        );

        // Repartition and sort
        JavaPairRDD<Integer, String> result = 
            pairs.repartitionAndSortWithinPartitions(
                new HashPartitioner(2)
            );

        System.out.println(result.collect());
        jsc.close();
    }
}
```

---
