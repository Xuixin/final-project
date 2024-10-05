import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        // ดึงข้อมูลการเข้าร่วมทั้งหมดจากฐานข้อมูล
        const response = await prisma.attendance.findMany({
            include: {
                employee: {
                    include: {
                        role: true
                    }
                },
                wages: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // จัดกลุ่มข้อมูลตามวันที่
        const groupedByDate = response.reduce((acc, att) => {
            // สร้างคีย์ของวันที่ (YYYY-MM-DD)
            const dateKey = att.createdAt.toISOString().split('T')[0];

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            // กรองข้อมูล wages ให้อยู่ในรูปแบบที่ต้องการ
            const wages = att.wages.map(wage => ({
                id: wage.id,
                amount: wage.amount,
                createdAt: wage.createdAt
            }));

            // เพิ่มข้อมูลพนักงานรวมถึง wages
            acc[dateKey].push({
                id: att.id,
                employeeId: att.employeeId,
                status: att.status,
                createdAt: att.createdAt,
                employee: {
                    id: att.employee.id,
                    name: att.employee.name,
                    lastname: att.employee.lastname,
                    address: att.employee.address,
                    email: att.employee.email,
                    roleId: att.employee.roleId,
                    createdAt: att.employee.createdAt,
                    roles: {
                        id: att.employee.roles.id,
                        name: att.employee.roles.name,
                        wagepermonth: att.employee.roles.wagepermonth,
                        wageperday: att.employee.roles.wageperday
                    }
                },
                wages: wages // รวม wages ที่เกี่ยวข้อง
            });

            return acc;
        }, {});

        // ส่งกลับเป็น JSON response
        return new Response(JSON.stringify(groupedByDate), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred' }), {
            status: 500,
        });
    }
}
