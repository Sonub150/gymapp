import React, { useState, useEffect } from 'react';
import { 
  FaDumbbell, 
  FaRunning, 
  FaWalking, 
  FaSpinner, 
  FaSearch, 
  FaHome, 
  FaInfoCircle, 
  FaUsers, 
  FaCog, 
  FaClipboardList,
  FaHeart,
  FaRegHeart,
  FaFire,
  FaChartLine
} from 'react-icons/fa';
import { GiMuscleUp, GiWeightLiftingUp, GiBodyBalance } from 'react-icons/gi';
import { MdClose, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { IoMdFitness } from 'react-icons/io';

const HealthWebsite = () => {
  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeSection, setActiveSection] = useState('exercises');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Fetch exercises from ExerciseDB API
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      const url = 'https://exercisedb.p.rapidapi.com/exercises';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '3f89ba1ebfmsh41d5204eba0b0cbp15b916jsneca7c610bce6',
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setExercises(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on search term and favorites
  useEffect(() => {
    let result = exercises;
    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (showFavorites) {
      result = result.filter(item => favorites.includes(item.id));
    }
    setFiltered(result);
  }, [searchTerm, exercises, favorites, showFavorites]);

  const handleExerciseClick = (exercise) => {
    setSelected(exercise);
    setModalOpen(true);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const getIcon = (item) => {
    if (!item || !item.equipment || !item.bodyPart) return <MdClose className="text-gray-400" />;
    if (item.equipment.toLowerCase().includes('dumbbell')) return <FaDumbbell className="text-blue-500" />;
    if (item.equipment.toLowerCase().includes('barbell')) return <GiWeightLiftingUp className="text-green-500" />;
    if (item.bodyPart === 'Legs') return <FaRunning className="text-red-500" />;
    if (item.bodyPart === 'Arms') return <GiMuscleUp className="text-yellow-500" />;
    if (item.bodyPart === 'Chest') return <FaWalking className="text-purple-500" />;
    if (item.bodyPart === 'Back') return <GiBodyBalance className="text-teal-500" />;
    if (item.bodyPart === 'Shoulders') return <GiMuscleUp className="text-pink-500" />;
    return <IoMdFitness className="text-orange-500" />;
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setSearchTerm('');
    setShowFavorites(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ExerciseDetailModal = ({ exercise, onClose, onToggleFavorite, isFavorite }) => {
    const getMuscleGroupIcon = (target) => {
      switch(target.toLowerCase()) {
        case 'chest': return <IoMdBody className="text-pink-500" />;
        case 'back': return <GiBodyBalance className="text-teal-500" />;
        case 'shoulders': return <GiMuscleUp className="text-blue-500" />;
        case 'arms': return <GiMuscleUp className="text-yellow-500" />;
        case 'legs': return <MdDirectionsRun className="text-red-500" />;
        case 'abs': return <GiMuscleFat className="text-green-500" />;
        default: return <BiTarget className="text-gray-500" />;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{exercise.name}</h2>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty || 'N/A'}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {exercise.equipment ? exercise.equipment : 'Bodyweight'}
                </span>
              </div>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Exercise Visuals */}
              <div className="lg:w-1/2">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-full h-64 object-contain rounded-lg bg-gray-100"
                />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                    <FaWeightHanging className="text-gray-600 mb-1" />
                    <span className="text-xs text-gray-500">Equipment</span>
                    <span className="font-medium text-sm capitalize">{exercise.equipment || 'None'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                    <FaClock className="text-gray-600 mb-1" />
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="font-medium text-sm">{exercise.duration || 'Varies'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                    <FaRepeat className="text-gray-600 mb-1" />
                    <span className="text-xs text-gray-500">Reps</span>
                    <span className="font-medium text-sm">{exercise.reps || '8-12'}</span>
                  </div>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <BiTarget className="mr-2 text-green-600" />
                    Target Muscles
                  </h3>
                  <div className="flex items-center mb-2">
                    {getMuscleGroupIcon(exercise.target)}
                    <span className="ml-2 capitalize">{exercise.target}</span>
                  </div>
                  <div className="flex items-center">
                    <IoMdBody className="text-gray-400 mr-2" />
                    <span className="capitalize">{exercise.bodyPart}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Exercise Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {[
                      `Strengthens ${exercise.target} muscles`,
                      `Improves ${exercise.bodyPart} mobility`,
                      exercise.equipment.toLowerCase().includes('dumbbell') ? 'Builds unilateral strength' : null,
                      exercise.bodyPart.toLowerCase().includes('legs') ? 'Enhances lower body power' : null,
                      exercise.bodyPart.toLowerCase().includes('arms') ? 'Increases arm endurance' : null,
                      'Boosts overall fitness level'
                    ].filter(Boolean).map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => onToggleFavorite(exercise.id)}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg ${
                      isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-gray-200 transition-colors`}
                  >
                    {isFavorite ? 
                      <MdFavorite className="mr-2" /> : 
                      <MdFavoriteBorder className="mr-2" />
                    }
                    {isFavorite ? 'Saved' : 'Save Exercise'}
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors">
                    Add to Workout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Exercise Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Proper Execution</h3>
              {exercise.instructions ? (
                <ol className="list-decimal pl-5 space-y-3">
                  {exercise.instructions.split('\n').filter(step => step.trim()).map((step, i) => (
                    <li key={i} className="text-gray-700">
                      <span className="font-medium text-gray-900">Step {i + 1}:</span> {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-gray-700">
                  <p className="mb-2">1. Start in the proper position for this exercise</p>
                  <p className="mb-2">2. Engage your core and maintain proper form throughout</p>
                  <p className="mb-2">3. Perform the movement slowly and with control</p>
                  <p>4. Complete the recommended number of repetitions</p>
                </div>
              )}
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="font-semibold text-lg mb-3 text-red-700 flex items-center">
                <FaInfoCircle className="mr-2" />
                Common Mistakes to Avoid
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-red-700">
                {[
                  'Using momentum instead of muscle control',
                  'Not maintaining proper posture',
                  exercise.bodyPart === 'back' ? 'Rounding the back during movement' : null,
                  exercise.bodyPart === 'legs' ? 'Letting knees cave inward' : null,
                  exercise.target === 'shoulders' ? 'Shrugging shoulders upward' : null,
                  'Holding your breath instead of breathing properly'
                ].filter(Boolean).map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Variations */}
            {['dumbbell', 'barbell', 'cable', 'machine'].some(term => 
              exercise.equipment.toLowerCase().includes(term)) && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Exercise Variations</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {name: 'Alternative Equipment', value: `Try with ${exercise.equipment.includes('dumbbell') ? 'barbell' : 'dumbbells'}`},
                    {name: 'Tempo Change', value: 'Slow eccentric phase'},
                    {name: 'Stance/Grip', value: 'Wide vs narrow'},
                    {name: 'Intensity', value: 'Drop sets or supersets'}
                  ].map((variation, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-900">{variation.name}</h4>
                      <p className="text-xs text-gray-600">{variation.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Sidebar */}
      <div className="fixed inset-y-0 left-0 w-20 bg-white shadow-lg flex flex-col items-center py-6 z-10">
        <div className="mb-8">
          <IoMdFitness className="text-3xl text-green-600" />
        </div>
        
        <nav className="flex-1 space-y-8">
          <button 
            onClick={() => handleNavClick('home')}
            className={`p-3 rounded-xl ${activeSection === 'home' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Home"
          >
            <FaHome className="text-xl" />
          </button>
          
          <button 
            onClick={() => handleNavClick('exercises')}
            className={`p-3 rounded-xl ${activeSection === 'exercises' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Exercises"
          >
            <FaDumbbell className="text-xl" />
          </button>
          
          <button 
            onClick={() => handleNavClick('workouts')}
            className={`p-3 rounded-xl ${activeSection === 'workouts' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Workouts"
          >
            <FaClipboardList className="text-xl" />
          </button>
          
          <button 
            onClick={() => handleNavClick('nutrition')}
            className={`p-3 rounded-xl ${activeSection === 'nutrition' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Nutrition"
          >
            <FaRunning className="text-xl" />
          </button>
        </nav>
        
        <div className="mt-auto space-y-4">
          <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl" title="Settings">
            <FaCog className="text-xl" />
          </button>
          <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl" title="Profile">
            <FaUsers className="text-xl" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20 p-6">
        {/* Header with Search */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {activeSection === 'home' && 'Fitness Dashboard'}
              {activeSection === 'exercises' && 'Exercise Library'}
              {activeSection === 'workouts' && 'Workout Plans'}
              {activeSection === 'nutrition' && 'Nutrition Guide'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'home' && 'Track your fitness journey'}
              {activeSection === 'exercises' && 'Find the perfect exercises for your goals'}
              {activeSection === 'workouts' && 'Custom workout routines'}
              {activeSection === 'nutrition' && 'Healthy eating for better results'}
            </p>
          </div>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Dashboard Content */}
        {activeSection === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <FaFire className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Workouts Completed</h3>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <GiMuscleUp className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Strength Progress</h3>
                  <p className="text-2xl font-bold text-gray-900">+15%</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Calories Burned</h3>
                  <p className="text-2xl font-bold text-gray-900">3,450</p>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Exercises Section */}
        {activeSection === 'exercises' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">All Exercises</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center px-4 py-2 rounded-lg ${showFavorites ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
                >
                  {showFavorites ? <MdFavorite className="mr-2" /> : <MdFavoriteBorder className="mr-2" />}
                  Favorites
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-green-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                  filtered.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="relative">
                        <img
                          src={item.gifUrl}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        >
                          {favorites.includes(item.id) ? 
                            <MdFavorite className="text-red-500 text-xl" /> : 
                            <MdFavoriteBorder className="text-gray-400 text-xl" />
                          }
                        </button>
                        <span className={`absolute bottom-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty || 'N/A'}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-center mb-3">
                          {getIcon(item)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 text-center capitalize mb-2">{item.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span className="capitalize">{item.bodyPart}</span>
                          <span className="capitalize">{item.equipment}</span>
                        </div>
                        <button
                          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                          onClick={() => handleExerciseClick(item)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FaDumbbell className="text-5xl mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      {showFavorites ? 'No favorite exercises yet' : 'No exercises found'}
                    </h3>
                    <p className="text-gray-500">
                      {showFavorites ? 'Start adding favorites by clicking the heart icon' : 'Try a different search term'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Workouts Section */}
        {activeSection === 'workouts' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Workout Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                <div key={level} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white">
                    <h3 className="text-xl font-bold">{level} Full Body</h3>
                    <p className="text-sm opacity-90">4-week program</p>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>Duration: 30-45 mins</span>
                      <span>{level === 'Beginner' ? '3 days/week' : level === 'Intermediate' ? '4 days/week' : '5 days/week'}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {['Warm-up', 'Strength', 'Cardio', 'Cool down'].map(item => (
                        <li key={item} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                      Start Workout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Section */}
        {activeSection === 'nutrition' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Nutrition Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Macronutrients</h3>
                <div className="space-y-4">
                  {[
                    {name: 'Protein', value: 40, color: 'bg-blue-500'},
                    {name: 'Carbs', value: 35, color: 'bg-green-500'},
                    {name: 'Fats', value: 25, color: 'bg-yellow-500'}
                  ].map(item => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${item.color}`} style={{width: `${item.value}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Meal Plan</h3>
                <div className="space-y-4">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(meal => (
                    <div key={meal} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-green-600">{meal.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{meal}</h4>
                        <p className="text-sm text-gray-600">
                          {meal === 'Breakfast' ? 'Oatmeal with fruits' : 
                           meal === 'Lunch' ? 'Grilled chicken with quinoa' : 
                           meal === 'Dinner' ? 'Salmon with vegetables' : 
                           'Nuts and yogurt'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Modal */}
        {modalOpen && selected && (
          <ExerciseDetailModal
            exercise={selected}
            onClose={() => setModalOpen(false)}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(selected.id)}
          />
        )}
      </div>
    </div>
  );
};

export default HealthWebsite;

