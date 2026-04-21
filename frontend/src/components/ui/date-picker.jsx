import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from "dayjs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ value, onChange, placeholder = "Chọn ngày", disabled = false }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  
  // Parse value - handle both DD/MM/YYYY and YYYY-MM-DD formats
  const parseDate = (dateValue) => {
    if (!dateValue) return dayjs()
    
    // Try parsing as YYYY-MM-DD first
    let parsed = dayjs(dateValue)
    if (parsed.isValid()) return parsed
    
    // Try parsing as DD/MM/YYYY
    parsed = dayjs(dateValue, "DD/MM/YYYY")
    if (parsed.isValid()) return parsed
    
    // Default to today
    return dayjs()
  }
  
  const [currentMonth, setCurrentMonth] = React.useState(parseDate(value))

  React.useEffect(() => {
    setCurrentMonth(parseDate(value))
  }, [value])

  React.useEffect(() => {
    if (value) {
      setInputValue(parseDate(value).format("DD/MM/YYYY"))
    } else {
      setInputValue("")
    }
  }, [value, isOpen])

  const handleDateSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD")
    onChange(formattedDate)
    setInputValue(date.format("DD/MM/YYYY"))
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    if (disabled) {
      return
    }

    const input = e.target.value
    setInputValue(input)
    // Chỉ parse khi đúng định dạng DD/MM/YYYY (8 số, 2 dấu /)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
      const parsed = dayjs(input, "DD/MM/YYYY")
      if (parsed.isValid()) {
        onChange(parsed.format("YYYY-MM-DD"))
        setCurrentMonth(parsed)
      }
    }
    // Nếu không đúng định dạng, không gọi onChange
  }

  const getDaysInMonth = (date) => {
    const firstDay = date.startOf("month").day()
    const daysInMonth = date.daysInMonth()
    const previousMonthDays = dayjs(date).subtract(1, "month").daysInMonth()

    const days = []

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: dayjs(date).subtract(1, "month").date(previousMonthDays - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: date.date(i),
        isCurrentMonth: true,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: dayjs(date).add(1, "month").date(i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pr-10"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(true)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-semibold">
              {currentMonth.format("MMMM YYYY")}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="space-y-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => {
                  const isSelected = value && dayjs(value).isSame(day.date, "day")
                  const isToday = day.date.isSame(dayjs(), "day")

                  return (
                    <Button
                      key={dayIndex}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      disabled={disabled}
                      className={`h-8 w-8 p-0 text-xs ${
                        !day.isCurrentMonth ? "text-muted-foreground/50" : ""
                      } ${isToday && !isSelected ? "border border-primary" : ""}`}
                      onClick={() => handleDateSelect(day.date)}
                    >
                      {day.date.date()}
                    </Button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Today Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={disabled}
            onClick={() => {
              handleDateSelect(dayjs())
            }}
          >
            Hôm nay
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
