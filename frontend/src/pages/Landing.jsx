import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Shield,
  BarChart3,
  BookOpen,
  Users,
} from "lucide-react";
import Button from "../components/common/Button";
import { APP_NAME } from "../utils/constants";

const Landing = () => {
  const features = [
    {
      icon: Clock,
      title: "Timed Exams",
      description:
        "Automatic timers with auto-submit functionality ensure fair assessment",
    },
    {
      icon: Shield,
      title: "Secure Testing",
      description:
        "Tab switch detection and monitoring prevent cheating attempts",
    },
    {
      icon: BarChart3,
      title: "Instant Results",
      description: "Get immediate feedback with detailed performance analytics",
    },
    {
      icon: BookOpen,
      title: "Question Bank",
      description:
        "Create and manage unlimited questions with multiple choice format",
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Easy administration of students and their exam attempts",
    },
    {
      icon: CheckCircle,
      title: "Auto Grading",
      description: "Automatic evaluation and grade calculation saves time",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                {APP_NAME}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Online
            <span className="block text-primary-600">Examination System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            A secure, efficient, and user-friendly platform for conducting
            online exams with real-time monitoring and instant results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for online examinations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of educators using our platform
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
