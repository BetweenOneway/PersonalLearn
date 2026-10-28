#include <windows.h>
#include <stdio.h>
#include <tlhelp32.h>

namespace MemoryTest {
    int TestMaxMemoryAlloc()
    {
        SIZE_T total = 0;
        const SIZE_T allocSize = 1024 * 1024; // 每次1MB
        LPVOID p;

        printf("Start allocating memory, 1MB per step...\n");
        fflush(stdout);

        for (;;)
        {
            // MEM_COMMIT | MEM_RESERVE 直接提交；不使用TOP_DOWN
            p = VirtualAlloc(NULL, allocSize, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
            if (p == NULL)
            {
                printf("VirtualAlloc failed. LastError: %lu\n", GetLastError());
                break;
            }
            total += allocSize;
            // 写一下内存，避免惰性提交假象
            *(char*)p = 1;

            if (total % (1024 * 1024 * 256) == 0)
            {
                printf("Allocated: %llu MB\n", (unsigned long long)total / (1024 * 1024));
                fflush(stdout);
            }
        }

        //32位情况下最大分配2G左右内存，实际到不了2G，1.9G左右
        printf("\nTotal allocated: %llu MB (%.2f GB)\n",
            (unsigned long long)total / (1024 * 1024),
            (double)total / (1024 * 1024 * 1024));

        return 0;
    }

    void PrintModules(DWORD pid)
    {
        HANDLE hSnap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, pid);
        if (hSnap == INVALID_HANDLE_VALUE)
        {
            printf("CreateToolhelp32Snapshot fail, err=%lu\n", GetLastError());
            return;
        }
        MODULEENTRY32 me32;
        me32.dwSize = sizeof(MODULEENTRY32);

        if (!Module32First(hSnap, &me32))
        {
            CloseHandle(hSnap);
            return;
        }
        printf("\n==== Loaded Modules ====\n");
        do
        {
            wprintf(L"0x%08X - 0x%08X | %s\n",
                (DWORD)me32.modBaseAddr,
                (DWORD)me32.modBaseAddr + me32.modBaseSize,
                me32.szModule);
        } while (Module32Next(hSnap, &me32));
        CloseHandle(hSnap);
    }

    //同时枚举已加载模块 + 持续 VirtualAlloc 压内存
    int TestMaxMemoryAlloc2()
    {
        DWORD pid = GetCurrentProcessId();
        PrintModules(pid);

        SIZE_T total = 0;
        const SIZE_T allocSize = 1024 * 1024;
        LPVOID p;

        printf("\nStart allocating 1MB per step...\n");
        fflush(stdout);

        for (;;)
        {
            // 可选：加上 MEM_TOP_DOWN 从高地址向下分配
            // p = VirtualAlloc(NULL, allocSize, MEM_COMMIT | MEM_RESERVE | MEM_TOP_DOWN, PAGE_READWRITE);
            p = VirtualAlloc(NULL, allocSize, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
            if (p == NULL)
            {
                printf("\nVirtualAlloc failed. LastError: %lu\n", GetLastError());
                break;
            }
            total += allocSize;
            *(char*)p = 1;

            if (total % (1024ULL * 1024ULL * 256ULL) == 0)
            {
                printf("Allocated: %llu MB\n", (unsigned long long)total / (1024 * 1024));
                fflush(stdout);
            }
        }

        printf("\nTotal allocated: %llu MB (%.2f GB)\n",
            (unsigned long long)total / (1024 * 1024),
            (double)total / (1024 * 1024 * 1024));

        return 0;
    }

    void TestMemory()
    {
        TestMaxMemoryAlloc2();
    }
}
