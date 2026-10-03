CXX = g++
AR = ar
ARFLAGS = rcs
RM = rm -f

# 默认构建debug
MODE ?= debug

# 根据模式选择输出目录 + 编译标志
ifeq ($(MODE),debug)
OUT_DIR := ../debug
CXXFLAGS := -Wall -g -O0 -std=c++17
else ifeq ($(MODE),release)
OUT_DIR := ../release
CXXFLAGS := -Wall -O3 -std=c++17 -DNDEBUG
else
$(error MODE must be debug or release)
endif

LIBNAME := LeetCodeLib.a
LIB_TARGET := $(OUT_DIR)/$(LIBNAME)

LIB_SRCS = Graph.cpp Greedy.cpp TwoPointers.cpp
LIB_OBJS := $(addprefix $(OUT_DIR)/, $(LIB_SRCS:.cpp=.o))
DEPS := $(LIB_OBJS:.o=.d)

all: $(LIB_TARGET)

$(LIB_TARGET): $(LIB_OBJS)
	@mkdir -p $(OUT_DIR)
	$(AR) $(ARFLAGS) $@ $^

$(OUT_DIR)/%.o: %.cpp
	@mkdir -p $(OUT_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@ -MMD

-include $(DEPS)

# 清理当前模式产物
clean:
	$(RM) $(LIB_OBJS) $(DEPS) $(LIB_TARGET)

# 一键删除debug和release所有产物
clean-all:
	$(RM) -r ../debug/* ../release/*

.PHONY: all clean clean-all

