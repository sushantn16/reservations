'use client'
import React from "react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/@/components/button";
import { Input } from "~/@/components/input";
import { Label } from "~/@/components/label";
import { Switch } from "~/@/components/switch";
import { Textarea } from "~/@/components/textarea";
import { Card, CardContent, CardFooter, CardTitle } from "~/@/components/card";
import { Badge } from "~/@/components/badge";
import { api } from "~/trpc/react";
import Image from 'next/image'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/@/components/select"


const ManageMenu = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        available: true,
        category: "",
        price: 0
    });
    const inputFileRef = useRef<any>();

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handlePriceChange = (e: any) => {
        setFormData({ ...formData, price: parseFloat(e.target.value) });
    }

    const handleSwitchChange = (value:boolean, id:number ) => {
        updateAvailability.mutate({itemId:id,
            available:value
        })
    };

    const updateAvailability = api.menu.updateMenuItemAvailability.useMutation({
        onSuccess: () => {
            toast.success("Availability has been updated");
            menuItems.refetch()
        },
    })

    const submitMenuItem = api.menu.addMenuItem.useMutation({
        onSuccess: () => {
            setFormData({
                name: "",
                description: "",
                available: true,
                category: "",
                price: 0
            })
            toast.success("Menu item has been added");
            menuItems.refetch(); // Refetch data after adding a menu item
        },
        onError: () => {
            toast.error("Some problem with adding a menu item");
        }
    });

    const handleFormSubmit = async (e: React.SyntheticEvent) => {
        const fileInput = inputFileRef.current;
        e.preventDefault();
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const uploadedFile = await uploadFile.mutateAsync({
                filename: file.name,
                data: file
            });
            submitMenuItem.mutate({ ...formData, image: uploadedFile.blobUrl });
        }
    };

    const menuItems = api.menu.getAllMenuItems.useQuery()
    const menuItemData = menuItems.data || [];

    const deleteMenuItem = api.menu.deleteMenuItem.useMutation({
        onSuccess: () => {
            toast.success("Menu item has been deleted");
            menuItems.refetch(); // Refetch data after deleting a menu item
        },
        onError: () => {
            toast.error("Some problem with deleting a menu item");
        }
    });
    const uploadFile = api.file.uploadFile.useMutation({
        onSuccess: () => {
            toast.success("File is uploaded")
        },
    })

    const handleDeleteMenuItem = (id: number) => {
        deleteMenuItem.mutate({ itemId: id });
    };



    return (
        <div className="flex">
            <div className="m-5 flex w-1/2">

                <form onSubmit={handleFormSubmit}>
                    <div className="m-5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            placeholder="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            id="name"
                        />
                    </div>
                    <div className="m-5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            placeholder="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            id="description"
                        />
                    </div>
                    <div className="m-5 flex items-center">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            placeholder="price"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handlePriceChange}
                        />
                    </div>
                    <div className="m-5 flex items-center">
                        <Label htmlFor="file">Image</Label>
                        <Input
                            type="file"
                            placeholder="Upload File"
                            name="file"
                            id="file"
                            ref={inputFileRef}
                            accept="image/png, image/jpeg"
                        />
                    </div>
                    <div className="m-5 flex items-center">
                        <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="appetizer">Appetizer</SelectItem>
                                <SelectItem value="main course">Main Course</SelectItem>
                                <SelectItem value="breads">Breads</SelectItem>
                                <SelectItem value="drinks">Drinks</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="m-5">
                        <Button type="submit">Add to Menu</Button>
                    </div>
                </form>

            </div>
            <div className="flex flex-col w-1/2">
                {menuItemData && menuItemData.map((data: any) =>
                    <Card className="p-2 m-4 w-2/3">
                        <CardTitle className="flex justify-between items-center">
                            {data.name}
                            <Badge variant="outline" className='rounded p-2'>
                                {data.available ? "available" : "Not available"}
                            </Badge>
                        </CardTitle>
                        <CardContent className="flex justify-between">
                            <p>{data.description}</p>
                            <img src={data.image} alt={data.name} />
                        </CardContent>
                        <div className="m-5 flex items-center">
                            <Label htmlFor="availability">Availability</Label>
                            <Switch
                                className="ml-5"
                                id="availability"
                                checked={data.available}
                                onCheckedChange={(value)=>handleSwitchChange(value, data.id)}
                            />
                        </div>

                        <CardFooter>
                            <Button onClick={() => handleDeleteMenuItem(data.id)}>Delete</Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ManageMenu;
