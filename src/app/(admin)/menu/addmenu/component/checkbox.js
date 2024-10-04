'use client'
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
export function CheckboxIdsCom({ igd, checkedIds, setCheckedIds }) {

    const ingredients = Array.isArray(igd) ? igd : [];
    return (

        ingredients.length > 0 && ingredients.map((item) => (
            <div key={item.id} className=" space-y-2 my-1">
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        checked={checkedIds?.some(cid => cid.id === item.id)} // ตรวจสอบว่ามี id อยู่ใน checkedIds หรือไม่
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setCheckedIds([...checkedIds, { id: item.id, qty: null, unit: item.unit }]); // ถ้าถูกเลือก ให้เพิ่ม id ไปยัง checkedIds
                            } else {
                                setCheckedIds(checkedIds.filter((cid) => cid.id !== item.id)); // ถ้าไม่ถูกเลือก ให้ลบ id ออกจาก checkedIds
                            }
                        }}
                    />
                    <label
                        htmlFor={`checkbox-${item.id}`} // อาจจะใช้ id เดิมที่คุณตั้งไว้
                        className="text-sm font-medium leading-none"
                    >
                        {item.name} {/* แสดงชื่อส่วนผสม */}
                    </label>
                </div>

                {checkedIds.some(cid => cid.id === item.id) && ( // ตรวจสอบว่ามี id ใน checkedIds หรือไม่
                    <div className='flex'>
                        <Input
                            type='number' // แก้ typr เป็น type
                            step={0.01}
                            className="w-[80%]"
                            value={checkedIds.find(cid => cid.id === item.id)?.qty || ''} // ดึงค่าปริมาณจาก checkedIds
                            onChange={(e) => {
                                const qty = parseFloat(e.target.value); // แปลงค่าที่ป้อนเป็นจำนวน
                                setCheckedIds(checkedIds.map(cid =>
                                    cid.id === item.id ? { ...cid, qty } : cid // อัปเดตค่าปริมาณใน checkedIds
                                ));
                            }}
                            required
                        />
                        <Input
                            type='text'
                            className="w-[20%]"
                            value={item.unit}
                            disabled
                        />
                    </div>
                )}
            </div>
        ))

    )
}