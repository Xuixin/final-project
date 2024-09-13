// import ui
import { Tabs } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function EmpLayout({ children }) {
    return (
        <Tabs defaultValue="all">
            <div className="bg-none">

                <h1 className="text-2xl font-semibold">Employees</h1>

            </div>
            <div className='w-full'>
                {children}
            </div>
        </Tabs>
    )
}