CXX = g++
CXXFLAGS = -Wall -O2
AR = ar
ARFLAGS = rcs
RM = rm -f

LIBNAME = LeetCodeLib.a

LIB_SRCS = Graph.cpp Greedy.cpp TwoPointers.cpp
LIB_OBJS = $(LIB_SRCS:.cpp=.o)

all: $(LIBNAME)

$(LIBNAME): $(LIB_OBJS)
	$(AR) $(ARFLAGS) $@ $^

%.o:%.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	$(RM) $(LIB_OBJS) $(LIBNAME)

.PHONY: clean
