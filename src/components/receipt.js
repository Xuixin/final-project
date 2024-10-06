import { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { ReceiptText } from "lucide-react";

export const Receipt = ({ od }) => {
    const printRef = useRef();

    useEffect(() => {
        console.log('object', od);
    }, [])



    const order = {
        id: 1,
        date: new Date().getDate().toLocaleString(),
        manager: "test",
        customer: 'test',
        items: [
            { menuId: 1, name: "Test", quantity: 2, price: 100 },
            { menuId: 2, name: "Test2", quantity: 1, price: 50 }
        ],
        total: 100,
        shipping: 'test',
        price: 100
    }


    const receipt = () => {
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
                        .child{
                            margin-right: 2px;
                            margin-left: 5px;
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
        <div >
            <div ref={printRef} style={{ width: "300px", margin: "0 auto", padding: "20px", border: "1px solid black" }} className='hidden'>
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
                        {od.normalMenu.length > 0 && od.normalMenu.map((m) => (
                            <tr key={m.id}>
                                <td>{m.name} X{m.quantity}</td>
                                <td style={{ textAlign: "right" }}>RM {(m.price * m.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                        {od.setMenu.length > 0 && od.setMenu.map((s, index) => (
                            <>
                                <tr key={s.setId}>
                                    <td>{s.setName}{`(set)`}</td>
                                    <td style={{ textAlign: "right" }}>RM {s.setPrice.toFixed(2)}</td>
                                </tr>
                                {
                                    s.details.map((m) => (
                                        <tr key={m.id} className='child'>
                                            <td style={{ textAlign: "center" }}>{m.name} X{m.quantity}</td>

                                        </tr>
                                    ))
                                }
                            </>
                        ))}

                    </tbody>
                </table>

                <hr />

                <table>
                    <tfoot>
                        <tr>
                            <td>Subtotal</td>
                            <td style={{ textAlign: "right" }}>{od.totalPrice.toFixed(2)}</td>
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

            <Button variant='outline' className='flex-1' onClick={receipt}>
                <span className='mx-1'><ReceiptText className="mr-2 h-4 w-4 " /></span>
            </Button>
        </div>
    );
};
