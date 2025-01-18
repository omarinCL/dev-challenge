import { Router } from 'express';
import os from 'os';
import { readFileSync } from 'fs';
import path from 'path';
import logger from '../utils/logger';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API Health monitoring
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get system health metrics
 *     description: Returns detailed information about the system's health, including memory usage, CPU status, and uptime
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   example: "2025-01-18T12:17:39.891Z"
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 uptime:
 *                   type: object
 *                   properties:
 *                     system:
 *                       type: number
 *                       example: 123456
 *                     process:
 *                       type: number
 *                       example: 1234
 *                     formatted:
 *                       type: string
 *                       example: "1d 5h 23m 45s"
 *                 memory:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: string
 *                       example: "16.00 GB"
 *                     free:
 *                       type: string
 *                       example: "8.00 GB"
 *                     used:
 *                       type: string
 *                       example: "8.00 GB"
 *                     usedPercentage:
 *                       type: string
 *                       example: "50.00%"
 *                 cpu:
 *                   type: object
 *                   properties:
 *                     cores:
 *                       type: number
 *                       example: 8
 *                     loadAvg:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [2.45, 2.25, 2.15]
 *                     utilization:
 *                       type: string
 *                       example: "35.50%"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Health check failed
 */

interface CPUInfo {
    model: string;
    speed: number;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
}

function formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function formatUptime(uptime: number): string {
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function calculateCPUUtilization(cpus: os.CpuInfo[]): string {
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
        for (const type in cpu.times) {
            totalTick += cpu.times[type as keyof typeof cpu.times];
        }
        totalIdle += cpu.times.idle;
    });

    const utilization = ((1 - totalIdle / totalTick) * 100).toFixed(2);
    return `${utilization}%`;
}

router.get('/health', async (req, res) => {
    try {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        let databaseStatus = 'healthy';
        try {
            readFileSync(path.join(__dirname, '../resources/database/products.json'), 'utf-8');
            readFileSync(path.join(__dirname, '../resources/database/schedules.json'), 'utf-8');
            readFileSync(path.join(__dirname, '../resources/database/schedule-routes.json'), 'utf-8');
        } catch (error) {
            databaseStatus = 'error';
            logger.error('Database health check failed:', error);
        }

        const processMetrics = process.memoryUsage();

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            uptime: {
                system: os.uptime(),
                process: process.uptime(),
                formatted: formatUptime(process.uptime())
            },
            memory: {
                total: formatBytes(totalMemory),
                free: formatBytes(freeMemory),
                used: formatBytes(usedMemory),
                usedPercentage: ((usedMemory / totalMemory) * 100).toFixed(2) + '%',
                processUsage: {
                    heapUsed: formatBytes(processMetrics.heapUsed),
                    heapTotal: formatBytes(processMetrics.heapTotal),
                    rss: formatBytes(processMetrics.rss)
                }
            },
            cpu: {
                cores: os.cpus().length,
                loadAvg: os.loadavg(),
                utilization: calculateCPUUtilization(os.cpus())
            },
            database: {
                status: databaseStatus,
                lastCheck: new Date().toISOString()
            },
            os: {
                platform: process.platform,
                version: os.version(),
                arch: process.arch
            }
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
});

export default router;