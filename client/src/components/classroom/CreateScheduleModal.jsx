import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../basic/Loader';
import toast from 'react-hot-toast';
import axios from 'axios';
import formatTime from '../../utils/formatDate';
import DropdownComponent from '../../utils/Dropdown';


const CreateScheduleModal = ({ currSessionId, onClose, onScheduleCreated }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjectLoader, setSubjectLoader] = useState(false)
  const [teacherLoader, setTeacherLoader] = useState(false)
  const [error, setError] = useState(null);
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [isEndEnabled, setIsEndEnabled] = useState(false);
  const [isTeacherEnabled, setIsTeacherEnabled] = useState(false);
  const [isBuildingEnabled, setIsBuildingEnabled] = useState(false);
  const [isRoomEnabled, setIsRoomEnabled] = useState(false);


  const [building, setBuilding] = useState();
  const [room, setRoom] = useState();
  const [buildingLoader, setBuildingLoader] = useState(false)
  const [roomLoader, setRoomLoader] = useState(false)


  const baseURL = 'http://localhost:8080/api/admin';


  const weekdays = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];

  const addScheduleEntry = () => {
    setScheduleEntries([...scheduleEntries, {
      weekday: null,
      startTime: null,
      endTime: null,
      selectedTeachers: [],
      buildingId: '',
      roomId: ''
    }]);
  };

  const updateScheduleEntry = async (index, field, value, entry, caller) => {
    if (caller === "weekday") {
      setIsStartEnabled(true)
    }
    else if (caller === "startTime") {
      setIsEndEnabled(true)
    }
    else if (caller === "endTime") {
      setIsTeacherEnabled(true)
    }
    else if (caller === "teacher") {
      setIsBuildingEnabled(true)
    }
    else if (caller === "building") {
      setIsRoomEnabled(true)
    }

    const newEntries = [...scheduleEntries];
    newEntries[index][field] = value;
    setScheduleEntries(newEntries);

    const { weekday, startTime, endTime } = newEntries[index];
    const updatedEntry = { ...newEntries[index], [field]: value };
    if (updatedEntry.weekday && updatedEntry.startTime && updatedEntry.endTime) {
      await fetchAvailableTeachers(updatedEntry.weekday.value, updatedEntry.startTime, updatedEntry.endTime);
      await fetchAvailableBuildings();
    }
    if (updatedEntry.weekday && updatedEntry.startTime && updatedEntry.endTime && updatedEntry.buildingId) {
      
      await fetchAvailableRooms(updatedEntry.weekday.value, updatedEntry.startTime, updatedEntry.endTime, updatedEntry.buildingId);
    }
    if (entry && (caller === "weekday" || caller === "startTime" || caller === "endTime")) {
      entry.selectedTeachers = [];
      entry.buildingId = '';
      entry.roomId = '';
    }
    if(entry && (caller=="building")){
      entry.roomId = ''
    }
  };


  const fetchAvailableTeachers = async (weekday, startTime, endTime) => {
    try {
      setTeacherLoader(true);
      const res = await axios.post(`http://localhost:8080/api/admin/teachers/all/available`, {
        day: weekday,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime)
      });
      const data = res.data.data.map((teacher) => {
        return {
          value: teacher._id,
          label: `${teacher.name} (${teacher.phone})`
        };
      });
      setTeachers(data);
    } catch (err) {
      toast.error(err.response.data.message || "Failed to fetch available teachers");
    } finally {
      setTeacherLoader(false);
    }
  };

  const fetchAvailableBuildings = async () => {
    try {
      setBuildingLoader(true);
      const res = await axios.get(`http://localhost:8080/api/admin/building`);
      const data = res.data.data.map((building) => {
        return {
          value: building._id,
          label: `${building.name}`
        };
      });
      setBuilding(data);
    } catch (err) {
      toast.error(err.response.data.message || "Failed to fetch available buildings");
    } finally {
      setBuildingLoader(false);
    }
  };

  const fetchAvailableRooms = async (weekday, startTime, endTime, buildingId) => {
    try {
      setRoomLoader(true);

      const res = await axios.post(`http://localhost:8080/api/admin/room/available`, {
        buildingId: buildingId.value,
        day: weekday,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime)
      });

      if (res.data.data.length === 0) {
        toast.error("No rooms available in this building");
      }

      const data = res.data.data.map((room) => {
        return {
          value: room._id,
          label: `${room.name}`
        };
      });
      setRoom(data);
    } catch (err) {
      toast.error(err.response.data.message || "Failed to fetch available rooms");
    } finally {
      setRoomLoader(false);
    }
  };


  const fetchSubjects = async () => {
    setSubjectLoader(true)

    const res = await axios.get(`http://localhost:8080/api/admin/syllabus/subjects/${currSessionId}`);

    const data = res.data.data.map((subject) => {
      return {
        value: subject._id,
        label: `${subject.name} (${subject.code}) [${subject.category}]`
      }
    });
    setSubjects(data);

    setSubjectLoader(false)
  }


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!selectedSubject || scheduleEntries.length === 0) return;

      const isValid = scheduleEntries.every((entry) => {
        return entry.weekday.value && entry.startTime && entry.endTime && entry.selectedTeachers.length > 0 && entry.buildingId.value && entry.roomId.value
      }
      );

      if (!isValid) {
        toast.error('Please fill all fields in each schedule entry');
        return;
      }

      setLoading(true);

      const data = {
        sessionId: currSessionId,
        subjectId: selectedSubject.value,
        schedule: [
          ...scheduleEntries.map((entry) => {
            return {
              day: entry.weekday.value,
              start_time: formatTime(entry.startTime),
              end_time: formatTime(entry.endTime),
              teacherIds: entry.selectedTeachers.map((teacher) => teacher.value),
              buildingId: entry.buildingId.value,
              roomId: entry.roomId.value
            }
          }
          )

        ]
      }
      // console.log(data)
      const res = await axios.post(`http://localhost:8080/api/admin/schedule`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res) {
        onClose();
        toast.success(' schedules created successfully');
      }
    }
    catch (error) {
      toast.error(error.response.data.message || 'Failed to create schedules.');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubjects();
  }, [currSessionId])
  return (
    <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-4xl shadow-lg  max-h-[80vh] overflow-y-scroll overflow-x-auto">
        <h2 className="text-xl text-black font-bold mb-4">Create New Schedule</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Subject
              </label>
              <Select
                options={subjects}
                value={selectedSubject}
                loading={subjectLoader}
                loadingMessage={"loading subjects"}
                onChange={setSelectedSubject}
                placeholder="Search subjects..."
                isSearchable
                isDisabled={!!selectedSubject}
                styles={customSelectStyles}
              />
            </div>

            {selectedSubject && (
              <button
                type="button"
                onClick={addScheduleEntry}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Schedule
              </button>
            )}
            <div className='grid grid-cols-2 gap-4'>
              {scheduleEntries.map((entry, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4 border-gray-200 min-w-[25rem]">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Weekday
                    </label>
                    <Select
                      options={weekdays}
                      value={entry.weekday}
                      onChange={(selected) => updateScheduleEntry(index, 'weekday', selected, entry, "weekday")}
                      placeholder="Select weekday..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Start Time
                      </label>
                      <DatePicker
                        disabled={!isStartEnabled}
                        selected={entry.startTime}
                        onChange={(date) => updateScheduleEntry(index, 'startTime', date, entry, "startTime")}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        dateFormat="h:mm aa"
                        className={`${!isStartEnabled ? 'bg-[#f1f5f9]' : 'bg-[#ffffff]'} w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none`}
                        placeholderText="Select start time"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        End Time
                      </label>
                      <DatePicker
                        disabled={!isEndEnabled}
                        selected={entry.endTime}
                        onChange={(date) => updateScheduleEntry(index, 'endTime', date, entry, "endTime")}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        dateFormat="h:mm aa"
                        className={`${!isEndEnabled ? 'bg-[#f1f5f9]' : 'bg-[#ffffff]'} w-full p-2 border-2 text-[#1e293b] border-gray-200 rounded-md focus:ring-2 focus:ring-transparent focus:border-blue-400 transition-colors placeholder-gray-400 focus:outline-none`}
                        placeholderText="Select end time"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Teachers
                    </label>
                    <Select
                      isDisabled={!isTeacherEnabled}
                      style={{ backgroundColor: !isTeacherEnabled ? '#f1f5f9' : '#ffffff' }}
                      isMulti
                      options={teachers}
                      value={entry.selectedTeachers}
                      loading={teacherLoader}
                      loadingMessage={"loading teachers"}
                      onChange={(selected) => updateScheduleEntry(index, 'selectedTeachers', selected, entry, "teacher")}
                      placeholder="Select teachers..."
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Building Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Building
                      </label>
                      <Select
                        isDisabled={!isBuildingEnabled}
                        style={{ backgroundColor: !isTeacherEnabled ? '#f1f5f9' : '#ffffff' }}
                        options={building}
                        value={entry.buildingId}
                        loading={buildingLoader}
                        loadingMessage={"loading buildings"}
                        onChange={(selected) => updateScheduleEntry(index, 'buildingId', selected, entry, "building")}
                        placeholder="Select building..."
                        styles={customSelectStyles}
                      />
                    </div>
                    {/* Room Dropdown */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Room
                      </label>
                      <Select
                        isDisabled={!isRoomEnabled}
                        style={{ backgroundColor: !isTeacherEnabled ? '#f1f5f9' : '#ffffff' }}
                        options={room}
                        value={entry.roomId}
                        loading={roomLoader}
                        loadingMessage={"loading rooms"}
                        onChange={(selected) => updateScheduleEntry(index, 'roomId', selected, entry, "room")}
                        placeholder="Select room..."
                        styles={customSelectStyles}
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Room</label>
                      <DropdownComponent
                        onOffState={isRoomEnabled}
                        getOnChangeValue={(val) => {
                          setRoomId(val);
                        }}
                        apiUrl={`${baseURL}/room/${buildingId}`}
                        isAddOther={false}
                      />
                    </div> */}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              disabled={loading || scheduleEntries.length === 0}
            >
              {loading && <Loader loading={true} size={10} />}
              Create Schedules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderColor: '#e2e8f0',
    borderRadius: '0.375rem',
    minHeight: '40px',
    '&:hover': {
      borderColor: '#cbd5e1'
    }
  }),
  input: (base) => ({
    ...base,
    color: '#1e293b'
  }),
  placeholder: (base) => ({
    ...base,
    color: '#94a3b8'
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  }),
  option: (base, { isFocused }) => ({
    ...base,
    backgroundColor: isFocused ? '#f8fafc' : '#ffffff',
    color: '#1e293b',
    '&:active': {
      backgroundColor: '#f1f5f9'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#f1f5f9',
    borderRadius: '0.25rem'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e293b'
  })
};

export default CreateScheduleModal;