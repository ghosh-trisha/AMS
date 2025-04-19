import RoutineTableteacher from '../../components/classroom/RoutineTableTeacher'
import { motion } from 'framer-motion';

function StudentRoutinePage() {

  return (
    <div className='p-6 min-h-screen bg-gradient-to-tr from-blue-50 to-white'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-xl max-w-6xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          📅 Weekly Routine
        </h1>

          <div className="border border-blue-100 rounded-lg overflow-hidden">
            <RoutineTableteacher />
          </div>
      </motion.div>
    </div>
  );
}

export default StudentRoutinePage;
