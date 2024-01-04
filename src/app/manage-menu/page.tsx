'use client'
import React from "react";
import { useState } from "react";
import { Button } from "~/@/components/button";
import { Input } from "~/@/components/input";
import { Label } from "~/@/components/label";
import { Switch } from "~/@/components/switch";
import { Textarea } from "~/@/components/textarea";

const ManageMenu = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        available: true,
        image: "",
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSwitchChange = () => {
        setFormData({ ...formData, available: !formData.available });
    };

    const handleFormSubmit = () => {
        console.log(formData);
    }

    return (
        <div className="p-5 w-1/3">
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
                <div className="m-5">
                <Label htmlFor="image">Image URL</Label>
                <Input
                    placeholder="image url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    id="image"
                />
                </div>
                <div className="m-5 flex items-center">
                <Label htmlFor="availability">Availability</Label>
                <Switch
                    className="ml-5"
                    id="availability"
                    checked={formData.available}
                    onChange={handleSwitchChange}
                />
                </div>
                <div className="m-5">
                <Button type="submit">Add to Menu</Button>
                </div>
            </form>
        </div>
    );
};

export default ManageMenu;
