'use client';
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CheckboxIdsCom({ igd, checkedIds, setCheckedIds }) {
    const ingredients = Array.isArray(igd) ? igd : [];
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(ingredients);
    }, [ingredients]);

    const onSearch = (e) => {
        const text = e.target.value;
        setSearchText(text);
        const filtered = ingredients.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    }

    const handleQuantityChange = (id, value) => {
        const numValue = parseFloat(value);
        setCheckedIds(checkedIds.map(cid =>
            cid.id === id ? { ...cid, qty: isNaN(numValue) ? null : numValue } : cid
        ));
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        type="text"
                        value={searchText}
                        onChange={onSearch}
                        placeholder="Search ingredients..."
                        className="pl-9"
                    />
                </div>
                <Badge variant="secondary" className="ml-2">
                    {checkedIds.length} selected
                </Badge>
            </div>

            <ScrollArea className="h-[400px]">
                <div className="space-y-3 pr-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <Card key={item.id} className="border border-gray-200">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`checkbox-${item.id}`}
                                                    checked={checkedIds?.some(cid => cid.id === item.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setCheckedIds([...checkedIds, { id: item.id, qty: null, unit: item.unit }]);
                                                        } else {
                                                            setCheckedIds(checkedIds.filter((cid) => cid.id !== item.id));
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={`checkbox-${item.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {item.name}
                                                </Label>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {item.unit}
                                            </Badge>
                                        </div>

                                        {checkedIds.some(cid => cid.id === item.id) && (
                                            <div className="flex items-center space-x-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        type="number"
                                                        step="0.001"
                                                        min="0"
                                                        placeholder={`Quantity in ${item.unit}`}
                                                        value={checkedIds.find(cid => cid.id === item.id)?.qty || ''}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                        className="pr-16"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none bg-gray-50 rounded-r-md border-l">
                                                        <span className="text-sm text-gray-500">
                                                            {item.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-500">No ingredients found</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Try adjusting your search terms
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}