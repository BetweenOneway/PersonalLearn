"""
DevContainer Demo - 工具函数测试
"""

import pytest
from app.utils import add, multiply


class TestAdd:
    """测试 add 函数"""

    def test_add_positive(self):
        assert add(1, 2) == 3

    def test_add_negative(self):
        assert add(-1, -2) == -3

    def test_add_zero(self):
        assert add(5, 0) == 5

    def test_add_large_numbers(self):
        assert add(1_000_000, 2_000_000) == 3_000_000


class TestMultiply:
    """测试 multiply 函数"""

    def test_multiply_positive(self):
        assert multiply(3, 4) == 12

    def test_multiply_negative(self):
        assert multiply(-3, 4) == -12

    def test_multiply_by_zero(self):
        assert multiply(5, 0) == 0

    def test_multiply_by_one(self):
        assert multiply(7, 1) == 7


# 参数化测试示例
@pytest.mark.parametrize(
    "a, b, expected",
    [
        (1, 1, 2),
        (10, 20, 30),
        (-5, 5, 0),
        (100, 200, 300),
    ],
)
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
