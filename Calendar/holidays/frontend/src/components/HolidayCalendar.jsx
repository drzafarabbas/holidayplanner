import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, Typography, FormControl, InputLabel, Switch, FormControlLabel, Paper, Grid, Badge } from '@mui/material';

// Helper to get weeks of a month (returns array of weeks, each week is array of date strings)
function getWeeksOfMonth(year, month) {
  const weeks = [];
  const date = new Date(year, month, 1);
  let week = [];
  while (date.getMonth() === month) {
    week.push(date.toISOString().slice(0, 10));
    if (date.getDay() === 6) { // Saturday
      weeks.push(week);
      week = [];
    }
    date.setDate(date.getDate() + 1);
  }
  if (week.length) weeks.push(week);
  return weeks;
}

const REGIONS = ['APAC', 'EMEA'];

export default function HolidayCalendar() {
  // Generate weeks for all months in 2025
  const [weeks, setWeeks] = useState(() => {
    let allWeeks = [];
    for (let m = 0; m < 12; m++) {
      const monthWeeks = getWeeksOfMonth(2025, m);
      monthWeeks.forEach(week => allWeeks.push({ month: m, week }));
    }
    return allWeeks;
  });

  const [region, setRegion] = useState(REGIONS[0]);
  const [showOnlyHolidays, setShowOnlyHolidays] = useState(false);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    fetch('/api/holidays?region=' + region)
      .then(res => res.json())
      .then(data => setHolidays(data))
      .catch(err => {
        setHolidays([]);
        console.error('Failed to load holidays', err);
      });
  }, [region]);

  const filterWeeks = (weeks) => {
    if (!showOnlyHolidays) return weeks;
    return weeks.filter(({ week }) =>
      week.some(date =>
        holidays.some(h => h.date === date)
      )
    );
  };

  return (
    <Box>
      <FormControl sx={{ minWidth: 120, mr: 2 }}>
        <InputLabel>Region</InputLabel>
        <Select value={region} label="Region" onChange={e => setRegion(e.target.value)}>
          {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={showOnlyHolidays}
            onChange={e => setShowOnlyHolidays(e.target.checked)}
          />
        }
        label="Show only holidays"
      />
      <Box mt={3}>
        {filterWeeks(weeks).map(({ month, week }, i) => {
          const weekHolidays = week.filter(date =>
            holidays.some(h => h.date === date)
          );
          if (showOnlyHolidays && weekHolidays.length === 0) return null;
          const showMonthHeader = i === 0 || weeks[i - 1].month !== month;
          return (
            <React.Fragment key={i}>
              {showMonthHeader && (
                <Typography variant="h6" sx={{ mt: 3 }}>
                  {new Date(2025, month).toLocaleString('default', { month: 'long' })}
                </Typography>
              )}
              <Paper sx={{ mb: 2, p: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography variant="subtitle1">Week {i + 1}</Typography>
                  </Grid>
                  <Grid item>
                    <Badge badgeContent={weekHolidays.length} color="primary">
                      <Typography variant="body2">Holidays</Typography>
                    </Badge>
                  </Grid>
                  <Grid item xs>
                    <Grid container spacing={1}>
                      {week.map(date => {
                        const holiday = holidays.find(h => h.date === date);
                        return (
                          <Grid item key={date}>
                            <Box
                              sx={{
                                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                bgcolor: holiday
                                  ? (holiday.designated ? 'success.light' : 'error.main')
                                  : 'grey.100',
                                color: holiday && !holiday.designated ? 'white' : 'text.primary',
                                borderRadius: 1,
                                border: holiday ? '2px solid' : '1px solid',
                                borderColor: holiday
                                  ? (holiday.designated ? 'success.dark' : 'error.dark')
                                  : 'grey.300',
                              }}
                            >
                              <Typography variant="body2">{new Date(date).getDate()}</Typography>
                            </Box>
                            {holiday && (
                              <Typography variant="caption" color={holiday.designated ? 'success.main' : 'error.main'}>
                                {holiday.name}
                              </Typography>
                            )}
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}