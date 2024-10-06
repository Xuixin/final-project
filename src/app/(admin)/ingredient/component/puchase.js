import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import axios from "axios";

export const Receipt = () => {
    const printRef = useRef();
    const [purchase, setPurchase] = useState([]);
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });


    useEffect(() => {
        const fetchPuchase = async () => {
            await axios.get('/api/igd/puchase')
                .then((response) => {
                    setPurchase(response.data);
                })
                .catch((error) => {
                    console.error(error)
                })
        }
        fetchPuchase();
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
                <h1>ingredient to puchase</h1>

                <table>
                    <tbody>

                        <tr>
                            <td>Date</td>
                            <td style={{ textAlign: "right" }}>{formattedDate}</td>
                        </tr>

                    </tbody>
                </table>

                <hr />

                <table>
                    <tbody>
                        {purchase && purchase.length > 0 &&
                            purchase.map((p) => {
                                return (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td style={{ textAlign: "right" }}>{p.puchase}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <hr />


            </div>

            <Button variant='outline' className='flex-1' onClick={receipt}>
                show ingredient to puchase
            </Button>
        </div>
    );
};
