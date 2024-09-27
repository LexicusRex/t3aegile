import React from "react";

import { ClockIcon } from "lucide-react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TimeFieldProps<T extends FieldValues> = Omit<
  ControllerRenderProps<T>,
  "value"
> & {
  value: string | null; // Time as a string in "HH:mm:ss" format
};

interface TimeFormPickerProps<T extends FieldValues> {
  field: TimeFieldProps<T>;
}

export function TimeFormPicker<T extends FieldValues>({
  field,
}: TimeFormPickerProps<T>) {
  const getTimeParts = (timeString: string | null) => {
    if (!timeString) return { hour: "12", minute: "00", ampm: "AM" };
    const [hourString, minuteString] = timeString.split(":");

    const hour = hourString ? parseInt(hourString, 10) : 12;
    const minute = minuteString ? parseInt(minuteString, 10) : 0;

    const isPM = hour >= 12;
    return {
      hour: (hour % 12 || 12).toString(),
      minute: minute.toString().padStart(2, "0"),
      ampm: isPM ? "PM" : "AM",
    };
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string,
  ) => {
    const { hour, minute, ampm } = getTimeParts(field.value);

    let newHour = parseInt(hour, 10);
    if (type === "hour") {
      newHour = parseInt(value, 10);
    }

    let newMinute = minute;
    if (type === "minute") {
      newMinute = value.padStart(2, "0");
    }

    let newAmpm = ampm;
    if (type === "ampm") {
      newAmpm = value;
    }

    const finalHour = newAmpm === "PM" ? (newHour % 12) + 12 : newHour % 12;
    const formattedTime = `${finalHour.toString().padStart(2, "0")}:${newMinute}:00`;

    field.onChange(formattedTime); // Update field with new time in "HH:mm:ss" format
  };

  const {
    hour: fieldHour,
    minute: fieldMinute,
    ampm: fieldAmpm,
  } = getTimeParts(field.value);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "h-9 w-full pl-3 text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value ? (
              new Date(`1970-01-01T${field.value}`).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              )
            ) : (
              <span>hh:mm:ss</span>
            )}
            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex p-2 sm:flex-col">
              {Array.from({ length: 12 }, (_, i) => i + 1)
                .reverse()
                .map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      parseInt(fieldHour, 10) === hour ? "default" : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
            </div>
            <ScrollBar />
          </ScrollArea>

          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex p-2 sm:flex-col">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={
                    parseInt(fieldMinute, 10) === minute ? "default" : "ghost"
                  }
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTimeChange("minute", minute.toString())}
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>

          <ScrollArea className="">
            <div className="flex p-2 sm:flex-col">
              {["AM", "PM"].map((ampm) => (
                <Button
                  key={ampm}
                  size="icon"
                  variant={fieldAmpm === ampm ? "default" : "ghost"}
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTimeChange("ampm", ampm)}
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
