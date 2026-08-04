# Bubble Sort Algorithm

Bubble sort repeatedly compares adjacent elements and swaps them when they are in the wrong order. After each pass, the largest unsorted element moves to the end of the list.

It is an in-place algorithm with $O(n^2)$ time complexity and $O(1)$ extra space.

Example:

- Input: [5, 1, 4, 2, 8]
- Output: [1, 2, 4, 5, 8]

```mermaid
flowchart LR
    A[Start] --> B[Compare adjacent items]
    B --> C{In correct order?}
    C -- No --> D[Swap them]
    C -- Yes --> E[Move to next pair]
    D --> E
    E --> F[End of pass]
    F --> G[Repeat until sorted]
```

Python Code:
```python
class Solution:
    def bubbleSort(self, nums):
        n = len(nums)

        for i in range(n):
            for j in range(n - i - 1):
                if nums[j] >= nums[j + 1]:
                    nums[j], nums[j + 1] = nums[j + 1], nums[j]

        return nums
```