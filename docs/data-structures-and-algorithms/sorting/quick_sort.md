# Quick Sort Algorithm

Quick sort also uses divide and conquer. It chooses a pivot, partitions the list so smaller elements go to the left and larger elements go to the right, and then sorts both sides recursively.

It has $O(n \log n)$ average time complexity, $O(n^2)$ worst-case time complexity, and $O(\log n)$ average recursion space.

Example:

- Input: [10, 7, 8, 9, 1, 5]
- Output: [1, 5, 7, 8, 9, 10]

```mermaid
flowchart TD
    A[Start] --> B[Choose pivot]
    B --> C[Partition around pivot]
    C --> D[Sort left side]
    C --> E[Sort right side]
    D --> F[Combine result]
    E --> F
```

Python Code:
```python
class Solution:
    def quickSort(self, nums, low, high):
        if low < high:
            pivot_index = self.partition(nums, low, high)
            self.quickSort(nums, low, pivot_index - 1)
            self.quickSort(nums, pivot_index + 1, high)

    def partition(self, nums, low, high):
        pivot = nums[high]
        i = low - 1

        for j in range(low, high):
            if nums[j] <= pivot:
                i += 1
                nums[i], nums[j] = nums[j], nums[i]

        nums[i + 1], nums[high] = nums[high], nums[i + 1]
        return i + 1
```