import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import axios from "axios";
import { Printer } from "lucide-react";

export const PrintIgd = () => {
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
                    console.error(error);
                });
        };
        fetchPuchase();
    }, []);



    const receipt = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open("", "", "width=400");

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
                        span{
                            color: red;
                        }
                        .tooltip {
                            list-style-type: none;
                            margin: 0 auto;
                        }
                        .red{
                        color: red;
                        }
                        .black{
                            color: black;
                            font-size: 10px;
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
            <div ref={printRef} style={{ width: "300px", margin: "0 auto", padding: "20px", border: "1px solid black" }} className='hidden'>
                <h1>Ingredient to Purchase</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>Date</td>
                            <td style={{ textAlign: "right" }}>{formattedDate}</td>
                        </tr>
                    </tbody>
                </table>

                <hr />
                <ul className={'tooltip'}>
                    <li className={'red'}>{`(0)`} <span className="black">{`<--- mean In-stock materials`}</span></li>
                    <li className={'red'}>{`** 0`} <span className="black">{`<--- mean To be purchased`}</span></li>
                </ul>
                <hr />

                <table>
                    <tbody>
                        {purchase && purchase.length > 0 &&
                            purchase.map((p) => (
                                <tr key={p.id}>
                                    <td>{`${p.name}`} <span className=""> {`(${p.quantity})`}</span></td>
                                    <td>**</td>
                                    <td style={{ textAlign: "left" }}>{p.puchase}</td>
                                    <td style={{ textAlign: "right" }}>{p.unit}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <hr />




            </div>
            <div >
                <Button variant="outline" size="sm" onClick={receipt}>
                    <Printer className="mr-2 h-4 w-4" />
                    พิมพ์รายการ
                </Button>
            </div>

        </div>
    );
};
