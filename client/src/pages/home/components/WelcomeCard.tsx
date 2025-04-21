import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

const WelcomeCard = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="mb-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white overflow-hidden shadow-lg">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center">
        <div className="mb-6 sm:mb-0 sm:mr-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, Alex!
          </h2>
          <p className="text-primary-50 max-w-xl mb-4">
            Continue exploring our educational resources or check out the latest
            uploads. Your last login was yesterday at 3:45 PM.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate("/library")}
              className="inline-flex items-center px-4 py-2 bg-white text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors duration-200"
            >
              <i className="ri-book-open-line mr-2"></i>
              Browse Library
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-primary-700 bg-opacity-40 text-white text-sm font-medium rounded-lg hover:bg-opacity-60 transition-colors duration-200">
              <i className="ri-fire-line mr-2"></i>
              New Uploads
            </button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg"
            alt="Education"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
