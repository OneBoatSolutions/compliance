"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DashboardCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function DashboardCalendar({
  selectedDate,
  setSelectedDate,
}: DashboardCalendarProps) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const month = currentMonth.toLocaleString("default", {
    month: "long",
  });

  const year = currentMonth.getFullYear();

  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();

  const firstDay = new Date(year, currentMonth.getMonth(), 1).getDay();

  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const emptyDays = Array.from({
    length: adjustedFirstDay,
  });

  const days = Array.from({ length: daysInMonth }, (unusedItem, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, currentMonth.getMonth() + 1, 1));
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-violet-100
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-violet-200
        hover:shadow-2xl
        hover:shadow-violet-100/50
      "
      aria-labelledby="calendar-title"
    >
      {/* TOP LIGHT */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-20
          bg-gradient-to-b
          from-violet-50/80
          to-transparent
        "
      />

      {/* PURPLE GLOW */}
      <div
        className="
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-violet-100/30
          blur-3xl
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-violet-200
              bg-violet-50
              p-2
              text-violet-700
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:border-violet-300
              hover:bg-violet-100
              hover:shadow-md
              hover:shadow-violet-100/50
            "
          >
            {/* GLOSS */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-5
                bg-gradient-to-b
                from-white/50
                to-transparent
              "
            />

            <ChevronLeft size={16} className="relative z-10" />
          </button>

          {/* MONTH + TODAY */}
          <div className="text-center">
            <h2 className="text-base font-semibold text-slate-900" id="calendar-title">
              {month} {year}
            </h2>

            <p className="mt-1 text-xs font-medium text-violet-700">
              Today: {today.toDateString()}
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            aria-label="Next month"
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-violet-200
              bg-violet-50
              p-2
              text-violet-700
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:border-violet-300
              hover:bg-violet-100
              hover:shadow-md
              hover:shadow-violet-100/50
            "
          >
            {/* GLOSS */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-5
                bg-gradient-to-b
                from-white/50
                to-transparent
              "
            />

            <ChevronRight size={16} className="relative z-10" />
          </button>
        </div>

        {/* WEEK LABELS */}
        <div
          className="
            mb-3
            grid
            grid-cols-7
            text-center
            text-xs
            font-semibold
            text-violet-500
          "
          role="row"
          aria-label="Days of the week"
        >
          <span aria-label="Monday">Mo</span>
          <span aria-label="Tuesday">Tu</span>
          <span aria-label="Wednesday">We</span>
          <span aria-label="Thursday">Th</span>
          <span aria-label="Friday">Fr</span>
          <span aria-label="Saturday">Sa</span>
          <span aria-label="Sunday">Su</span>
        </div>

        {/* DATE GRID */}
        <div
          className="grid grid-cols-7 gap-1.5"
          role="grid"
          aria-label={`Calendar for ${month} ${year}`}
        >
          {emptyDays.map((emptyDay, index) => (
            <div key={index} role="presentation" aria-hidden="true" className="h-9 w-9" />
          ))}

          {days.map((day) => {
            const isToday =
              today.getDate() === day &&
              today.getMonth() === currentMonth.getMonth() &&
              today.getFullYear() === year;

            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentMonth.getMonth() &&
              selectedDate.getFullYear() === year;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(year, currentMonth.getMonth(), day))}
                className={`
                  relative
                  overflow-hidden
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-2xl
                  text-xs
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    isSelected
                      ? `
                        border
                        border-violet-300
                        bg-violet-500
                        text-white
                        shadow-lg
                        shadow-violet-200/60
                      `
                      : isToday
                        ? `
                        border
                        border-violet-200
                        bg-violet-50
                        text-violet-700
                        shadow-sm
                      `
                        : `
                        text-slate-600
                        hover:bg-violet-50
                        hover:text-violet-700
                      `
                  }
                `}
                aria-label={`${new Date(year, currentMonth.getMonth(), day).toDateString()}${isToday ? ", Today" : ""}${
                  isSelected ? ", Selected" : ""
                }`}
                aria-current={isToday ? "date" : undefined}
                aria-pressed={isSelected}
              >
                {/* GLOSS */}
                {isSelected && (
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      top-0
                      h-4
                      bg-gradient-to-b
                      from-white/40
                      to-transparent
                    "
                  />
                )}

                <span className="relative z-10">{day}</span>
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-violet-100
            bg-violet-50/60
            p-4
          "
        >
          <p className="text-xs font-medium text-violet-700">Selected Date</p>

          <span className="mt-1 block text-sm font-semibold text-slate-800" aria-live="polite">
            {selectedDate.toDateString()}
          </span>
        </div>
      </div>
    </section>
  );
}
