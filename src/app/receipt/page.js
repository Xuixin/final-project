"use client"; // ใช้ client-side rendering

import { useRef } from "react";

export default function ReceiptPage() {
    const printRef = useRef();

    // ม็อกข้อมูลใบเสร็จ
    const order = {
        id: 1,
        date: "2024-10-06",
        manager: "Mary Jane",
        items: [
            { name: "Cucumber", price: 0.15 },
            { name: "Ice", price: 1.10 },
            { name: "Lemon", price: 2.25 },
            { name: "Mint", price: 0.50 },
            { name: "Strawberry", price: 1.50 },
            { name: "Sugar", price: 0.75 },
            { name: "Melon", price: 1.20 },
            { name: "Beef", price: 3.50 },
            { name: "Onion", price: 0.10 },
            { name: "Cheese", price: 0.95 },
            { name: "Cherry", price: 1.40 },
            { name: "Package", price: 0.35 },
        ],
        total: 15.25,
        price: 13.75,
        sale: 0,
        vat: 1.50,
    };

    // ฟังก์ชันสำหรับการพิมพ์ใบเสร็จ
    const handlePrint = (order) => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open("", "", "width=400");

        // เขียน HTML พร้อมสไตล์ลงในหน้าต่างปริ้น
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body {
                            font-family: 'Courier New', Courier, monospace;
                            padding: 20px;
                        }
                        h1 {
                            text-align: center;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .info {
                            display: flex;
                            justify-content: space-between;
                            margin : 0 auto;
                        }
                        hr {
                            border: none;
                            border-top: 1px dashed black;
                            margin: 20px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        td {
                            padding: 5px 0;
                        }
                        .total-section {
                            margin-top: 20px;
                        }
                        .thankyou {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 20px;
                        }
                        .barcode {
                            margin-top: 20px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();

    };

    return (
        <div>
            {/* เนื้อหาใบเสร็จ */}
            <div ref={printRef} style={{ width: "300px", margin: "0 auto", padding: "20px", border: "1px solid black" }}>
                <h1>RECEIPT</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td style={{ textAlign: "right" }}>{order.id}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td style={{ textAlign: "right" }}>{order.date}</td>
                        </tr>
                        <tr>
                            <td>Manager</td>
                            <td style={{ textAlign: "right" }}>{order.manager}</td>
                        </tr>
                    </tbody>
                </table>



                <hr />

                <table>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td style={{ textAlign: "right" }}>{item.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />

                <table>
                    <tfoot>
                        <tr>
                            <td >Subtotal</td>
                            <td style={{ textAlign: "right" }}>{order.price.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                    <tfoot>
                        <tr>
                            <td >Total</td>
                            <td style={{ textAlign: "right" }}>{order.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>


                <div className="thankyou">
                    <p>THANK YOU!</p>
                </div>

                <div className="barcode">
                    <img src="https://barcode.tec-it.com/barcode.ashx?data=123456789012" alt="barcode" />
                </div>
            </div>

            {/* ปุ่มสำหรับสั่งพิมพ์ */}
            <button onClick={handlePrint} style={{ marginTop: "20px", display: "block", margin: "0 auto" }}>
                Print Receipt
            </button>
        </div>
    );
}
