# Arrays: Logic Building & Problem Solving

This section focuses on essential array manipulation problems designed to build algorithmic logic, specifically focusing on in-place partition and two-pointer techniques.

---

## 1. Move Zeroes to End or Beginning of Array (In-Place)

### Problem Description
Given an array of integers `nums`, reorder its elements in-place such that:
1. **Move Zeroes to End:** All `0`s are shifted to the end of the array while preserving the relative order of non-zero elements.
2. **Move Zeroes to Beginning:** All `0`s are shifted to the beginning of the array while preserving the relative order of non-zero elements.

---

### Part 1: Move Zeroes to the End

#### Intuition & Two-Pointer Approach
We maintain a `left` pointer pointing to the next available index for a non-zero element.
1. Iterate through the array with index `i` from `0` to `len(nums) - 1`.
2. When `nums[i] != 0` is encountered, swap `nums[i]` with `nums[left]`.
3. Increment `left` by `1`.
4. This partitions the array into non-zero elements on the left (`0` to `left - 1`) and zeroes or unvisited elements on the right.

#### Example Walkthrough
**Input:** `arr = [1, 4, 9, 0, 7, 7, 5, 0, 23, 44]`

- `i = 0` (`nums[0] = 1`): Swap `nums[0]` with `nums[0]`, `left = 1` $\rightarrow$ `[1, 4, 9, 0, 7, 7, 5, 0, 23, 44]`
- `i = 1` (`nums[1] = 4`): Swap `nums[1]` with `nums[1]`, `left = 2` $\rightarrow$ `[1, 4, 9, 0, 7, 7, 5, 0, 23, 44]`
- `i = 2` (`nums[2] = 9`): Swap `nums[2]` with `nums[2]`, `left = 3` $\rightarrow$ `[1, 4, 9, 0, 7, 7, 5, 0, 23, 44]`
- `i = 3` (`nums[3] = 0`): Skip swap, `left = 3`
- `i = 4` (`nums[4] = 7`): Swap `nums[4]` with `nums[3]`, `left = 4` $\rightarrow$ `[1, 4, 9, 7, 0, 7, 5, 0, 23, 44]`
- `i = 5` (`nums[5] = 7`): Swap `nums[5]` with `nums[4]`, `left = 5` $\rightarrow$ `[1, 4, 9, 7, 7, 0, 5, 0, 23, 44]`
- ... continuing scan ...

**Result after moving zeroes to end:** `[1, 4, 9, 7, 7, 5, 23, 44, 0, 0]`

---

### Part 2: Move Zeroes to the Beginning

#### Intuition & Two-Pointer Approach
To shift zeroes to the beginning, iterate from right to left (from index `len(nums) - 1` down to `0`):
1. Maintain a `right` pointer initialized to `len(nums) - 1` representing the target position for non-zero elements.
2. Iterate `i` backwards from `len(nums) - 1` down to `0`.
3. Whenever `nums[i] != 0` is found, swap `nums[i]` with `nums[right]`.
4. Decrement `right` by `1`.
5. Non-zero elements shift to the right end of the array, placing all zeroes at indices `0` to `right`.

#### Example Walkthrough
**Input (from Part 1 result):** `arr = [1, 4, 9, 7, 7, 5, 23, 44, 0, 0]`

- Scanning backwards from `i = 9` down to `0`:
- `i = 9` (`nums[9] = 0`): Skip
- `i = 8` (`nums[8] = 0`): Skip
- `i = 7` (`nums[7] = 44`): Swap with `nums[9]` $\rightarrow$ `right = 8`
- `i = 6` (`nums[6] = 23`): Swap with `nums[8]` $\rightarrow$ `right = 7`
- ... continuing backward scan ...

**Result after moving zeroes to beginning:** `[0, 0, 1, 4, 9, 7, 7, 5, 23, 44]`

---

### Python Solution
```python
class Solution:
    def move_zeroes_to_end(self, nums: list) -> list:
        """Moves all zeroes in the array to the end in-place using two pointers."""
        left = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[i], nums[left] = nums[left], nums[i]
                left += 1

        return nums

    def move_zeroes_to_beginning(self, nums: list) -> list:
        """Moves all zeroes in the array to the beginning in-place using right-to-left scan."""
        right = len(nums) - 1

        for i in range(len(nums) - 1, -1, -1):
            if nums[i] != 0:
                nums[right], nums[i] = nums[i], nums[right]
                right -= 1

        return nums

# Main function demonstrating the in-place operations
def main():
    sol = Solution()
    arr = [1, 4, 9, 0, 7, 7, 5, 0, 23, 44]

    print("Original array:", arr)
    sol.move_zeroes_to_end(arr)
    print("After move_zeroes_to_end:", arr)

    sol.move_zeroes_to_beginning(arr)
    print("After move_zeroes_to_beginning:", arr)

if __name__ == '__main__':
    main()
```

### Complexity Analysis
- **Time Complexity:** $\mathcal{O}(N)$ — Both functions process the array of $N$ elements in a single linear pass.
- **Space Complexity:** $\mathcal{O}(1)$ — In-place element swaps require constant extra space.

