# Arrays
## 1. Move zeroes to end or the beginning of the array (in-place)
```python
class Solution:
    def move_zeroes_to_end(self, nums: list):
        left = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[i], nums[left] = nums[left], nums[i]
                left += 1

        return nums

    def move_zeroes_to_beginning(self, nums: list) -> list:
        right = len(nums) - 1

        for i in range(len(nums) - 1, -1, -1):
            if nums[i] != 0:
                nums[right], nums[i] = nums[i], nums[right]
                right -= 1

        return nums

#   main function for the program
def main():
    sol = Solution()
    arr = [1,4,9,0,7,7,5,0,23,44]

    sol.move_zeroes_to_end(arr)
    print(arr)

    sol.move_zeroes_to_beginning(arr)
    print(arr)

#   driver code for the program
if __name__ == '__main__':
    main()

```
