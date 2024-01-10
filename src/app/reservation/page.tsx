"use client";
import React, { useState } from "react";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Card } from "~/@/components/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/@/components/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/@/components/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/@/components/popover";
import { RadioGroup, RadioGroupItem } from "~/@/components/radio-group";
import { Calendar } from "~/@/components/calendar";
import { cn } from "~/@/lib/utils";
import { Button } from "~/@/components/button";
import { Textarea } from "~/@/components/textarea";
import { Badge } from "~/@/components/badge";
import { Label } from "~/@/components/label";
import { api } from "~/trpc/react";
import SigninDrawer from "../Signin";

interface ReservationData {
    id: number;
    date: Date;
    time: string;
    people: string;
    request: string;
    mobile: string;
}

const Reservation = () => {
    const [page, setPage] = useState(1);
    const [date, setDate] = useState<Date>();
    const [selectedTime, setTime] = useState('');
    const [people, setPeople] = useState('');
    const [request, setRequest] = useState('');
    const [mobile, setMobile] = useState('');
    const { data: session } = useSession();

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
        if (!session) {
            toast.error("Please login to make reservation");
            return;
        }
        if (isValid) {
            createReservation.mutate({
                date: date?.toString() ?? '',
                time: selectedTime,
                people: Number(people),
                request: request,
                mobile: mobile
            })
        }
    }

    const todayReservations: ReservationData[] = [];
    const upcomingReservations: ReservationData[] = [];
    const expiredReservations: ReservationData[] = [];

    const fetchPreviousReservations = api.reservation.getReservationsByUserId.useQuery()
    const reservations = fetchPreviousReservations.data || [];

    const fetchAllReservations = api.reservation.getAllReservations.useQuery();
    const allReservations = fetchAllReservations.data || [];

    const reservationsForSelectedDate = allReservations.filter((data: ReservationData) => {
        const reservationDate = new Date(data.date).setHours(0, 0, 0, 0);
        const selectedDate = date ? new Date(date).setHours(0, 0, 0, 0) : undefined;

        return selectedDate === reservationDate;
    });

    const totalPeopleMap = new Map<string, number>(allTimes.reduce((acc, time) => { acc.set(time, 0); return acc; }, new Map<string, number>()));

    reservationsForSelectedDate.forEach((data: ReservationData) => {
        const time = data.time;
        const totalPeople = totalPeopleMap.get(time) || 0;
        totalPeopleMap.set(time, totalPeople + Number(data.people));
    });

    reservations.forEach((data: ReservationData) => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const reservationDate = new Date(data.date).setHours(0, 0, 0, 0);
        if (reservationDate === currentDate) {
            todayReservations.push(data);
        } else if (reservationDate > currentDate) {
            upcomingReservations.push(data);
        } else {
            expiredReservations.push(data);
        }
    });

    const cancelReservation = api.reservation.cancelReservation.useMutation({
        onSuccess: () => {
            toast.success("Reservation has been cancelled")
            fetchPreviousReservations.refetch()
        },
        onError: () => {
            toast.error("Some problem with reservation")
        }
    })

    const handleReservationCancellation = (id: number) => {
        cancelReservation.mutate({ id: id })
    }

    const validateData = () => {
        if (!date) {
            toast.error("Please select a date for reservation");
            return false;
        }
        if (!people) {
            toast.error("Please select the number of people you want to make a reservation for");
            return false;
        }
        if (page === 1) {
            return true;
        } else {
            if (!selectedTime) {
                toast.error("Please select a time for reservation");
                return false;
            }
            if (mobile.length < 12) {
                toast.error("Please enter a valid phone number");
                return false;
            }
            return true;
        }
    }

    const createReservation = api.reservation.makeReservation.useMutation({
        onSuccess: () => {
            toast.success("Reservation is made")
            fetchPreviousReservations.refetch()
        },
        onError: () => {
            toast.error("Some problem with reservation")
        }
    });

    const reservationsCard = (data: ReservationData) => {
        return (
            <Card className="w-full p-2 m-4 flex items-center justify-between">
                <Badge variant="default" className='rounded p-2 m-3'>
                    {isToday(new Date(data.date)) ? "Today" : new Date(data.date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ? "Upcoming" : "Expired"}
                </Badge>
                <Badge variant="outline" className='rounded p-2 m-3'>
                    <Label htmlFor={data.time}>
                        {data.time}
                    </Label>
                </Badge>
                <Badge variant="outline" className='rounded p-2 m-3'>
                    {data.date.toDateString()}
                </Badge>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant="outline" className='rounded p-2 m-3'>
                                {data.people}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            Number of people
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button variant="secondary" className="m-3 hover:bg-primary hover:text-primary-foreground" disabled={new Date(data.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)} onClick={() => handleReservationCancellation(data.id)} >Cancel Reservation</Button>
            </Card>
        )
    }

    return (
        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
            <SigninDrawer />
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
                            <Label htmlFor="calendar">Please choose the number of people</Label>
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
                                {allTimes.map((time, i) => (
                                    <div key={i}>
                                        <Badge
                                            variant="outline"
                                            className={`rounded p-2 m-3 flex-wrap ${(totalPeopleMap.get(time) ?? 0) > 10 ? 'text-gray-300 cursor-not-allowed' :
                                                (totalPeopleMap.get(time) ?? 0) > 8 ? 'text-red-500' :
                                                    (totalPeopleMap.get(time) ?? 0) > 5 ? 'text-yellow-500' :
                                                        ''} ${time === selectedTime ? 'border-black' : ''
                                                }`}
                                        >
                                            {/* {time === selectedTime ? 'border-black rounded p-2 m-3 flex-wrap' : 'rounded p-2 m-3 flex-wrap'}> */}
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
                            <Label htmlFor="textarea" >Have some special requests? Add here.</Label>
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
            {
                reservations.length === 0 &&
                <div className="w-1/2 p-5 text-8xl items-center text-center">Make a Reservation today to enjoy the culinary retreat.</div>
            }
            {reservations.length > 0 &&
                <div>
                    {
                        todayReservations.length > 0 &&
                        <div>
                            <h2>Today's Reservations</h2>
                            {todayReservations.map(data => (
                                reservationsCard(data)
                            ))}
                        </div>
                    }
                    {
                        upcomingReservations.length > 0 &&
                        <div>
                            <h2>Upcoming Reservations</h2>
                            {upcomingReservations.map(data => (
                                reservationsCard(data)
                            ))}
                        </div>
                    }
                    {
                        expiredReservations.length > 0 &&
                        <div>
                            <h2>Expired Reservations</h2>
                            {expiredReservations.map(data => (
                                reservationsCard(data)
                            ))}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Reservation;
