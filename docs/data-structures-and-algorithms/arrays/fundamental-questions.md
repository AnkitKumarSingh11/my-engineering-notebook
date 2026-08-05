# Arrays: Fundamental Questions & Solutions

This guide covers fundamental array problems commonly asked in technical interviews. Each problem includes detailed explanations, step-by-step example walkthroughs, Python solutions, and time/space complexity analysis.

---

## 1. Linear Search

### Problem Description
Given an array `nums` and a target element `target`, find the 0-based index of the target in the array. If the target is not present, return `-1`.

### Intuition & Approach
Linear search is the simplest searching algorithm. We iterate through the array element by element from left to right:
1. Compare each element `el` at `index` with `target`.
2. If `el == target`, immediately return `index`.
3. If the loop completes without finding `target`, return `-1`.

### Example Walkthrough
**Input:** `nums = [4, 2, 7, 1, 9]`, `target = 7`

- **Step 1 (`index = 0`):** `nums[0]` is `4` ($\neq 7$). Move to next element.
- **Step 2 (`index = 1`):** `nums[1]` is `2` ($\neq 7$). Move to next element.
- **Step 3 (`index = 2`):** `nums[2]` is `7` ($== 7$). Target found! Return `2`.

**Output:** `2`

### Python Solution
```python
class Solution:
    def linearSearch(self, nums: list[int], target: int) -> int:
        for index, el in enumerate(nums): 
            if el == target: 
                return index

        return -1
```

### Complexity Analysis
- **Time Complexity:** $\mathcal{O}(N)$ — In the worst-case scenario, target is at the last position or not present, requiring $N$ comparisons.
- **Space Complexity:** $\mathcal{O}(1)$ — Constant auxiliary space is used.

---

## 2. Largest Element in an Array

### Problem Description
Given an array `nums`, find and return the largest element present in the array.

### Intuition & Approach
To find the maximum element in an unsorted array:
1. Assume the first element `nums[0]` is the largest and initialize a tracker variable `largest = nums[0]`.
2. Traverse through all elements in `nums`.
3. For each element `el`, compare it with `largest` and update `largest = max(largest, el)`.
4. Return `largest` after scanning all elements.

### Example Walkthrough
**Input:** `nums = [3, 8, 2, 10, 5]`

- **Initial state:** `largest = nums[0] = 3`
- **Compare `8`:** $\max(3, 8) \rightarrow \text{largest} = 8$
- **Compare `2`:** $\max(8, 2) \rightarrow \text{largest} = 8$
- **Compare `10`:** $\max(8, 10) \rightarrow \text{largest} = 10$
- **Compare `5`:** $\max(10, 5) \rightarrow \text{largest} = 10$

**Output:** `10`

### Python Solution
```python
class Solution:
    def largestElement(self, nums: list[int]) -> int:
        largest = nums[0]
        for el in nums: 
            largest = max(largest, el)
        
        return largest
```

### Complexity Analysis
- **Time Complexity:** $\mathcal{O}(N)$ — We inspect each of the $N$ elements exactly once.
- **Space Complexity:** $\mathcal{O}(1)$ — Uses a single variable to track the maximum value.

---

## 3. Second Largest Element

### Problem Description
Given an array `nums`, find the second largest distinct element. If no second largest element exists (e.g., array size is less than 2 or all elements are identical), return `-1`.

### Intuition & Approach
Instead of sorting the array (which takes $\mathcal{O}(N \log N)$ time), we can find the second largest element in a single pass $\mathcal{O}(N)$:
1. Keep track of two variables, `first` and `second`, both initialized to $-\infty$ (`float('-inf')`).
2. Iterate through each element `el` in `nums`:
   - If `el > first`: The current element becomes the new largest element (`first = el`), and the previous `first` shifts down to `second = first`.
   - Else if `el > second` and `el != first`: `el` is strictly between `first` and `second`, so update `second = el`.
3. After completing the loop, if `second` is still `float('-inf')`, return `-1`. Otherwise, return `second`.

### Example Walkthrough
**Input:** `nums = [12, 35, 1, 10, 34, 1]`

- **Initial state:** `first = -inf`, `second = -inf`
- **Element `12`:** `12 > -inf` $\rightarrow$ `second = -inf`, `first = 12`
- **Element `35`:** `35 > 12` $\rightarrow$ `second = 12`, `first = 35`
- **Element `1`:** `1 < 12` $\rightarrow$ No change
- **Element `10`:** `10 < 12` $\rightarrow$ No change
- **Element `34`:** `34 > 12` and `34 != 35` $\rightarrow$ `second = 34`

**Output:** `34`

### Python Solution
```python
class Solution:
    def secondLargestElement(self, nums: list[int]) -> int:
        if len(nums) < 2: 
            return -1

        first, second = float('-inf'), float('-inf')

        for index, el in enumerate(nums): 
            if el > first: 
                second = first
                first = el
            elif el > second and el != first: 
                second = el
        
        return -1 if second == float('-inf') else second
```

### Complexity Analysis
- **Time Complexity:** $\mathcal{O}(N)$ — Single pass scan of the input array.
- **Space Complexity:** $\mathcal{O}(1)$ — Constant memory allocation.

---

## 4. Maximum Consecutive Ones

### Problem Description
Given a binary array `nums` containing only `0`s and `1`s, return the maximum number of consecutive `1`s in the array.

### Intuition & Approach
We can process contiguous segments of `1`s:
1. Maintain `index` to iterate through the array and `max_count` to track the longest sequence of `1`s seen so far.
2. If `nums[index] != 1`, skip to the next element.
3. If `nums[index] == 1`, use an inner pointer `pos` starting from `index` to count how many consecutive `1`s exist in this segment.
4. Update `max_count = max(max_count, count)` and advance `index` directly to `pos` to skip the segment already counted.

### Example Walkthrough
**Input:** `nums = [1, 1, 0, 1, 1, 1]`

- **`index = 0` (`nums[0] == 1`):** Inner loop scans `nums[0]` and `nums[1]`. Segment count = `2`. `max_count = 2`. Advance `index` to `2`.
- **`index = 2` (`nums[2] == 0`):** Skip, increment `index` to `3`.
- **`index = 3` (`nums[3] == 1`):** Inner loop scans `nums[3]`, `nums[4]`, and `nums[5]`. Segment count = `3`. `max_count = max(2, 3) = 3`. Advance `index` to `6`.
- **`index = 6`:** Loop terminates since `index >= len(nums)`.

**Output:** `3`

### Python Solution
```python
class Solution:
    def findMaxConsecutiveOnes(self, nums: list[int]) -> int:
        index = 0
        max_count = 0

        while index < len(nums): 
            pos = index
            count = 0

            if nums[index] != 1: 
                index += 1
                continue

            while pos < len(nums) and nums[pos] == 1: 
                pos += 1
                count += 1
            
            max_count = max(max_count, count)
            index = pos
        
        return max_count
```

### Complexity Analysis
- **Time Complexity:** $\mathcal{O}(N)$ — Each index in the array is visited at most twice (once by the main loop and once by the pointer `pos`), maintaining linear time complexity.
- **Space Complexity:** $\mathcal{O}(1)$ — Operates strictly in-place with integer counters.

## 5. Left Rotate Array by K places
```python
class Solution:
    def rotate(self, nums: list, low: int, high: int) -> None:
        while low <= high:
            nums[low], nums[high] = nums[high], nums[low]
            low += 1
            high -= 1

    def rotate_array_by_k(self, nums: list, k: int) -> None:
        n = len(nums)
        k = k % n

        self.rotate(nums, 0, k - 1)
        self.rotate(nums, k, n - 1)
        self.rotate(nums, 0, n - 1)

    def rotateArray(self, nums, k: int) -> None:
        self.rotate_array_by_k(nums, k)

```