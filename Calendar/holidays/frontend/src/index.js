import React from 'react';
import ReactDOM from 'react-dom/client';
import HolidayCalendar from './components/HolidayCalendar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HolidayCalendar />
  </React.StrictMode>
);