"use client"
import React, { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react"
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

const Reservation = () => {
    const [page, setPage] = useState(1)
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState('')
    const [people, setPeople] = useState('');
    const [request, setRequest] = useState('')


    const allTimes = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00PM'];
    const handleNextButton = () => {
        setPage(2);
    }

    const handleSubmitButton = () => {
        console.log({
            date: date?.toString()??'',
            time: time,
            people: Number(people),
            request: request
        });
        createReservation.mutate({
            date: date?.toString()??'',
            time: time,
            people: Number(people),
            request: request
        })
    }

    const createReservation = api.reservation.makeReservation.useMutation({
        onSuccess: () => {
            console.log('success')
        },
    });

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 p-5 flex flex-col items-center align-middle justify-between">
                {page === 1 ? <div>
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
                            />
                        </PopoverContent>
                    </Popover>
                    <Select onValueChange={setPeople}>
                        <SelectTrigger className="w-[240px] mt-5">
                            <SelectValue placeholder="Number of people" />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(9)].map((x, i) =>
                                <SelectItem key={i} value={(i + 1).toString()}>{i === 8 ? i + 1 + '+' : i + 1}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                    :
                    <div>
                        <Label htmlFor="timeslot">Please select your time slot</Label>
                        <div>
                            {allTimes.map((time, i) => (
                                <Badge variant="outline" key={i} onClick={() => setTime(time)}>
                                    {time}
                                </Badge>
                            ))}
                        </div>
                        <div className="mt-10">
                            <Label htmlFor="textarea" >Have some special requests? add here.</Label>
                            <Textarea value={request} onChange={e => setRequest(e.target.value)} />
                        </div>
                    </div>}
                <div className="">
                    {page === 1 ?
                        <Button variant={"outline"} className="" onClick={handleNextButton}>
                            <ChevronRight className="mr-2 h-4 w-4" /> Next
                        </Button>
                        :
                        <Button variant={"outline"} className="" onClick={handleSubmitButton}>
                            <ChevronRight className="mr-2 h-4 w-4" /> Next
                        </Button>
                    }

                </div>

            </div>
            <div className="w-1/2 p-5 text-center">Make a Reservation today to enjoy the culinary retreat.</div>
        </div>
    )
}
export default Reservation;