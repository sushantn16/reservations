"use client"
import React, { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Rocket } from "lucide-react"
import { Calendar } from "~/@/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/@/components/popover"
import { cn } from "~/@/lib/utils"
import { Button } from "~/@/components/button"
import { Textarea } from "~/@/components/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/@/components/select"
import { Badge } from "~/@/components/badge"
import { Label } from "~/@/components/label"
import { api } from "~/trpc/react";
import { Input } from "~/@/components/input"
import { PhoneInput } from 'react-international-phone';
import { RadioGroup, RadioGroupItem } from "~/@/components/radio-group"
import 'react-international-phone/style.css';
import { toast } from "sonner"




const Reservation = () => {
    const [page, setPage] = useState(1);
    const [date, setDate] = useState<Date>();
    const [selectedTime, setTime] = useState('');
    const [people, setPeople] = useState('');
    const [request, setRequest] = useState('');
    const [mobile, setMobile] = useState('');
    // const phoneUtil = PhoneNumberUtil.getInstance();


    const allTimes = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00PM'];
    const handleNextButton = () => {
        const isValid = validateData()
        if (isValid) {
            setPage(2);
        }
    }
    const handleBackButton = () => {
        setPage(1);
    }

    const handleSubmitButton = () => {
        const isValid = validateData();
        if (isValid) {
            console.log({
                date: date?.toString() ?? '',
                time: selectedTime,
                people: Number(people),
                request: request,
                mobile: mobile
            });
            createReservation.mutate({
                date: date?.toString() ?? '',
                time: selectedTime,
                people: Number(people),
                request: request,
                mobile: mobile
            })
        }
    }

    const validateData = () => {
        if (!date) {
            toast("Please select a date for reservation");
            return false;
        }
        if (!people) {
            toast("Please select number of people you want to make a reservation for");
            return false;
        }
        if (page === 1) {
            return true;
        } else {
            if (!selectedTime) {
                toast("Please select a time for reservation");
                return false;
            }
            if (mobile.length < 12) {
                toast("Please enter a valid phone number");
                return false;
            }
            return true;
        }

    }

    const createReservation = api.reservation.makeReservation.useMutation({
        onSuccess: () => {
            console.log('success')
        },
    });

    return (
        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
            <div className="w-1/2 p-5 flex flex-col align-middle justify-between">
                {page === 1 ?
                    <div className="p-5">
                        <div className="my-10">
                            <Label htmlFor="calendar">Please choose a date</Label>
                            <div className="m-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] justify-start text-left font-normal rounded",
                                            !date && "text-muted-foreground"
                                        )} >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="bg-white"
                                        required
                                    />
                                </PopoverContent>
                            </Popover>
                            </div>
                        </div>
                        <div className="my-10">
                        <Label htmlFor="calendar">Please choose number of people</Label>
                            <Select onValueChange={setPeople}>
                                <SelectTrigger className="w-[240px] m-3">
                                    <SelectValue placeholder="Number of people" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(9)].map((x, i) =>
                                        <SelectItem key={i} value={(i + 1).toString()}>{i === 8 ? i + 1 + '+' : i + 1}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    :
                    <div className="p-5">
                        <div className="my-10">
                            <Label htmlFor="timeslot">Please select your time slot</Label>
                            <RadioGroup className="flex flex-wrap" value={selectedTime} onValueChange={setTime}>

                                {
                                    allTimes.map((time, i) => (
                                        <div key={i}>
                                            <Badge variant="outline" className={time === selectedTime ? 'border-black rounded p-2 m-3 flex-wrap' : 'rounded p-2 m-3 flex-wrap'}>
                                                <Label htmlFor={time}>
                                                    {time}<RadioGroupItem className="hidden" value={time} id={time} />
                                                </Label>
                                            </Badge>
                                        </div>

                                    ))}
                            </RadioGroup>
                        </div>

                        <div className="my-10">
                            <Label htmlFor="phone" >Phone Number</Label>
                            <PhoneInput className="m-3" value={mobile} onChange={e => setMobile(e)} />
                        </div>
                        <div className="my-10">
                            <Label htmlFor="textarea" >Have some special requests? add here.</Label>
                            <Textarea className="m-3 w-2/3" id="textarea" value={request} onChange={e => setRequest(e.target.value)} />
                        </div>
                    </div>}
                <div className="p-10 min-w-full">
                    {page === 1 ?
                        <div className="flex justify-end">
                            <Button variant={"outline"} className="" onClick={handleNextButton}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        :
                        <div className="flex justify-between">
                            <Button variant={"outline"} className="" onClick={handleBackButton}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            <Button className="" onClick={handleSubmitButton}>
                                Reserve
                            </Button>
                        </div>
                    }

                </div>

            </div>
            <div className="w-1/2 p-5 text-8xl items-center text-center">Make a Reservation today to enjoy the culinary retreat.</div>
        </div>
    )
}
export default Reservation;