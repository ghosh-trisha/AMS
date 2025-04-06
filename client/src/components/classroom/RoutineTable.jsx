import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import HashLoader from "react-spinners/HashLoader";

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timelineWidth = 850;

const RoutineTimeline = ({ sessionId }) => {
  const [routineData, setRoutineData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/schedule/${sessionId}`);
        if (res.data.status === 'success') {
          setRoutineData(res.data.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setIsLoading(false)
    };
    fetchData();
  }, [sessionId]);

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
  }, [routineData,isDeleting]);

  const confirmDelete = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
        setIsDeleting(true);
      const res = await axios.delete(`http://localhost:8080/api/admin/schedule/${selectedScheduleId}`);
      if (res.data.status) {
        toast.success('Schedule deleted successfully');
        setRoutineData(prev =>
          prev.map(day => ({
            ...day,
            schedules: day.schedules.filter(s => s.id !== selectedScheduleId),
          }))
        );
        
      } else {
        toast.error("Error deleting schedule");
      }
      setIsDeleting(false)
    } catch (err) {
      toast.error("Error deleting schedule");
      console.error('Delete failed:', err);
    }
    setShowModal(false);
  };

  return (
    <div className="p-4 space-y-4 overflow-x-auto relative">
      {/* Timeline Header */}

      {isLoading?
      <div className='w-full items-center justify-center flex'>
      <HashLoader size={30} color='gray'/>
      </div>
      :
      <div>
      <div className="flex ml-[120px] border-b border-gray-400 relative" style={{ width: timelineWidth }}>
        {maxHour && [...Array(maxHour - minHour )].map((_, i) => {
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

      {/* Week Rows */}
      {weekdays.map(day => {
        const schedules = routineData.find(d => d._id === day)?.schedules || [];
        return (
          <div key={day} className="flex items-center h-[70px]">
            <div className="w-[120px] pr-2 text-right font-semibold">{day}</div>
            <div className="relative bg-gray-50 border border-gray-200 rounded-md w-full h-full" style={{ width: timelineWidth }}>
              {schedules.map((sch, idx) => {
                const startHour = parseTimeToDecimal(sch.start_time);
                const endHour = parseTimeToDecimal(sch.end_time);
                const left = (startHour - minHour) * pxPerHour;
                const width = (endHour - startHour) * pxPerHour;

                const tooltipContent = `
                  ${sch.subjectName} (${sch.subjectCategory})
                  Code: ${sch.subjectCode}
                  Time: ${formatTime(sch.start_time)} - ${formatTime(sch.end_time)}
                  Teachers: ${sch.teachers.map(t => t.name).join(', ')}
                `;

                return (
                  <div
                    key={idx}
                    className="absolute top-2 bottom-2 bg-blue-200 text-blue-900 rounded-md shadow px-2 py-1 text-sm cursor-pointer hover:bg-blue-300 transition-all group"
                    style={{ left, width }}
                    data-tooltip-id={`tooltip-${day}-${idx}`}
                    data-tooltip-content={tooltipContent}
                  >
                    <div className="font-bold">{sch.subjectName} ({sch.subjectCategory})</div>
                    <div className="text-xs">{sch.subjectCode}</div>

                    <button
                      onClick={() => confirmDelete(sch.id)}
                      className="absolute bottom-1 right-1 text-white rounded hover:opacity-70 cursor-pointer"
                    >
                      <FaTrash size={14} color='red' />
                    </button>

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
    }
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[1px] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-600">Are you sure you want to delete this schedule? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer gap-2 flex justify-between items-center"
                onClick={handleDelete}
              >
                Delete 
                {
                    isDeleting? <HashLoader size={15} color='white'/>:""
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helpers
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

export default RoutineTimeline;
