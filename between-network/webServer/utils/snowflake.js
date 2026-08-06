'use strict'

/**
 * 雪花算法 ID 生成器（Snowflake）—— 使用 BigInt 保证精度
 *
 * 目标：生成不连续、不可被遍历猜测的唯一 ID，用于对外暴露的资源（user/note），
 * 替代数据库自增主键，避免通过 URL 直接枚举资源。
 *
 * 位分配（共 63 位）：
 *   1 位符号位（恒为 0）
 *  41 位时间戳（毫秒，可用约 69 年）
 *   5 位数据中心 ID（0~31）
 *   5 位机器 ID（0~31）
 *  12 位序列号（每毫秒内 0~4095）
 *
 * 为什么用 BigInt：
 *   63 位整数超过 JavaScript 的 Number 安全范围（2^53），若用 << 移位会溢出丢精度，
 *   导致生成的 ID 重复。因此全程使用 BigInt 运算，最终以字符串返回，
 *   调用方以字符串形式存储/传递，避免 JSON 序列化与前端 parseInt 时的精度丢失。
 */

const EPOCH = 1700000000000n // 自定义起始时间戳（2023-11-14），单位毫秒（BigInt）

class Snowflake {
    constructor({ datacenterId = 1, workerId = 1 } = {}) {
        this.datacenterId = BigInt(datacenterId & 0x1f) // 5 位
        this.workerId = BigInt(workerId & 0x1f)         // 5 位
        this.sequence = 0n
        this.lastTimestamp = -1n
    }

    _now() {
        return BigInt(Date.now())
    }

    _waitNextMillis(lastTimestamp) {
        let timestamp = this._now()
        while (timestamp <= lastTimestamp) {
            timestamp = this._now()
        }
        return timestamp
    }

    nextId() {
        let timestamp = this._now()

        if (timestamp < this.lastTimestamp) {
            // 时钟回拨：直接抛错由调用方处理
            throw new Error('Snowflake clock moved backwards.')
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1n) & 0xfffn // 12 位
            if (this.sequence === 0n) {
                // 当前毫秒序列耗尽，等到下一毫秒
                timestamp = this._waitNextMillis(this.lastTimestamp)
            }
        } else {
            this.sequence = 0n
        }

        this.lastTimestamp = timestamp

        const id =
            ((timestamp - EPOCH) << 22n) |
            (this.datacenterId << 17n) |
            (this.workerId << 12n) |
            this.sequence

        // 以字符串返回，防止前端/JSON 序列化时精度丢失
        return id.toString()
    }
}

// 单例：进程内统一生成，保证序列号递增
const instance = new Snowflake({ datacenterId: 1, workerId: 1 })

module.exports = {
    Snowflake,
    nextId: () => instance.nextId()
}
