import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import HashLoader from "react-spinners/HashLoader";
import Cookies from 'js-cookie';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timelineWidth = 800;

const RoutineTableteacher = () => {
  const [routineData, setRoutineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get(`http://localhost:8080/api/teacher/schedule`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.status === 'success') {
          setRoutineData(res.data.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const { minHour, maxHour, pxPerHour } = useMemo(() => {
    let min = 24, max = 0;
    routineData.forEach(day =>
      day.schedules.forEach(sch => {
        const start = parseTimeToHour(sch.start_time);
        const end = parseTimeToHour(sch.end_time);
        if (start < min) min = start;
        if (end > max) max = end;
      })
    );
    return {
      minHour: min,
      maxHour: max,
      pxPerHour: timelineWidth / (max - min),
    };
  }, [routineData]);

  return (
    <div className="p-4 space-y-4 overflow-x-auto relative">
      {isLoading ? (
        <div className="p-6 grid gap-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>
      ) : (
        <div>
          <div className="flex ml-[120px] border-b border-gray-400 relative" style={{ width: timelineWidth }}>
            {maxHour && [...Array(maxHour - minHour)].map((_, i) => {
              const hour = minHour + i;
              return (
                <div
                  key={hour}
                  className="text-xs text-gray-700 border-l border-gray-300 h-6 flex items-center justify-center"
                  style={{ width: pxPerHour }}
                >
                  {`${hour}:00`}
                </div>
              );
            })}
          </div>

          {weekdays.map(day => {
            const schedules = routineData.find(d => d._id === day)?.schedules || [];
            return (
              <div key={day} className="flex items-center h-[80px]">
                <div className="w-[120px] pr-2 text-right font-semibold">{day}</div>
                <div className="relative bg-gray-50 border border-gray-200 rounded-md w-full h-full" style={{ width: timelineWidth }}>
                  {schedules.map((sch, idx) => {
                    const startHour = parseTimeToDecimal(sch.start_time);
                    const endHour = parseTimeToDecimal(sch.end_time);
                    const left = (startHour - minHour) * pxPerHour;
                    const width = (endHour - startHour) * pxPerHour;

                    const tooltipContent = `
                      Code: ${sch.subjectCode}
                      Time: ${formatTime(sch.start_time)} - ${formatTime(sch.end_time)}\n
                      Dept: ${sch.departmentName}
                      Level: ${sch.levelName}
                      Program: ${sch.programName}
                      Course: ${sch.courseName}
                      Semester: ${sch.semesterName}
                      Session: ${sch.session}
                      Syllabus: ${sch.syllabusName}
                    `;

                    return (
                      <div
                        key={idx}
                        className="absolute top-1 bottom-1 bg-green-200 text-green-900 rounded-md shadow px-2 py-1 text-sm cursor-pointer hover:bg-green-300 transition-all"
                        style={{ left, width }}
                        data-tooltip-id={`tooltip-${day}-${idx}`}
                        data-tooltip-content={tooltipContent}
                      >
                        <div className="font-bold truncate">{sch.subjectName} ({sch.subjectCategory})</div>
                        <div className="text-xs truncate">{sch.roomName} ({sch.buildingName})</div>

                        <Tooltip
                          id={`tooltip-${day}-${idx}`}
                          place="top"
                          effect="solid"
                          style={{ whiteSpace: 'pre-line', zIndex: 9999 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const parseTimeToHour = (time) => {
  if (typeof time === 'string' && time.includes('T')) return new Date(time).getHours();
  return parseInt(time.split(':')[0]);
};

const parseTimeToDecimal = (time) => {
  if (typeof time === 'string' && time.includes('T')) {
    const d = new Date(time);
    return d.getHours() + d.getMinutes() / 60;
  }
  const [h, m] = time.split(':').map(Number);
  return h + (m || 0) / 60;
};

const formatTime = (time) => {
  if (typeof time === 'string' && time.includes('T')) {
    const d = new Date(time);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  return time;
};

export default RoutineTableteacher;
