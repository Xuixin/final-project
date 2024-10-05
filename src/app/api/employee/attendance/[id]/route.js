import { PrismaClient } from "@prisma/client";
import { format, startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();



export async function POST(request, { params }) {
    const { id } = params;
    const status = true;
    const today = new Date();
    const timeZone = 'Asia/Bangkok';

    const startOfToday = startOfDay(today, { timeZone });
    const endOfToday = endOfDay(today, { timeZone });

    try {
        // ตรวจสอบว่ามีการบันทึกการเข้าในวันนี้หรือยัง
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                createdAt: {
                    gte: startOfToday, // เริ่มต้นวัน
                    lte: endOfToday, // สิ้นสุดวัน
                },
                employee: {
                    id: parseInt(id),
                },
            },
        });

        if (existingAttendance) {
            return new Response(
                JSON.stringify({
                    message: 'Attendance already marked for today',
                    time: today,
                    start: startOfToday,
                    end: endOfToday,
                    existingAttendance,
                }),
                {
                    status: 409, // Conflict
                }
            );
        }

        // ถ้ายังไม่มีการบันทึกการเข้า จะสร้างการบันทึกใหม่
        await prisma.attendance.create({
            data: {
                status,
                employee: {
                    connect: {
                        id: parseInt(id),
                    },
                },
            },
        });

        return new Response(
            JSON.stringify({
                message: 'Attendance marked successfully',
                start: startOfToday,
                end: endOfToday,
            }),
            {
                status: 201, // Created
            }
        );

    } catch (error) {
        console.error('Error marking attendance:', error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while marking attendance' }),
            {
                status: 500,
            }
        );
    }
}

export async function GET(request, { params }) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { id } = params;

    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                attendance: {
                    where: {
                        createdAt: {
                            gte: new Date(`${today}T00:00:00`), // เริ่มต้นวัน
                            lte: new Date(`${today}T23:59:59`), // สิ้นสุดวัน
                        }
                    }
                }
            }
        });

        // ถ้าไม่พบข้อมูลพนักงาน
        if (!employee) {
            return new Response(JSON.stringify({ error: 'Employee not found' }), {
                status: 404,
            });
        }

        // ถ้าพบพนักงานแต่ไม่พบข้อมูลการเข้างานในวันนี้
        if (employee.attendance.length <= 0) {
            return new Response(JSON.stringify({ ...employee, status: false }), {
                status: 200,
            });
        }

        // ถ้าพบข้อมูลการเข้างาน
        return new Response(JSON.stringify({ ...employee, status: true }), {
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        });
    }
}

export async function PUT(request, { params }) {
    const { id } = params
}