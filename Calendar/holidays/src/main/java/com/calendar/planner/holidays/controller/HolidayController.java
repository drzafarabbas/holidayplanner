package com.calendar.planner.holidays.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    @GetMapping
    public List<Map<String, Object>> getHolidays(@RequestParam String region) {
        // Dummy data for demonstration
        List<Map<String, Object>> holidays = new ArrayList<>();
        if ("APAC".equalsIgnoreCase(region)) {
            holidays.add(Map.of(
                "date", "2025-05-26",
                "name", "Memorial Day",
                "region", "APAC",
                "designated", false
            ));
            holidays.add(Map.of(
                "date", "2025-05-30",
                "name", "APAC Holiday",
                "region", "APAC",
                "designated", true
            ));
            holidays.add(Map.of(
                "date", "2025-06-21",
                "name", "Easter Day",
                "region", "APAC",
                "designated", false
            ));
            holidays.add(Map.of(
                "date", "2025-06-28",
                "name", "APAC Holiday",
                "region", "APAC",
                "designated", true
            ));
        } else if ("EMEA".equalsIgnoreCase(region)) {
            holidays.add(Map.of(
                "date", "2025-05-27",
                "name", "EMEA Holiday",
                "region", "EMEA",
                "designated", true
            ));
        }
        return holidays;
    }
}