import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Shield,
  BarChart3,
  BookOpen,
  Users,
  GraduationCap,
  Video,
  Lock,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Mail,
  Phone,
  Github,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";
import Button from "../components/common/Button";
import { APP_NAME } from "../utils/constants";
import { publicAPI } from "../services/api";

const Landing = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await publicAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/(), "") + "K+";
    }
    return num + "+";
  };

  const features = [
    {
      icon: Clock,
      title: "Timed Exams",
      description:
        "Automatic timers with auto-submit functionality ensure fair assessment for every student",
    },
    {
      icon: Shield,
      title: "Anti-Cheating",
      description:
        "Tab switch detection and real-time monitoring prevent unfair attempts",
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
      description:
        "Automatic evaluation and grade calculation saves valuable time",
    },
  ];

  const statCards = loading
    ? [
        { value: "-", label: "Students" },
        { value: "-", label: "Exams" },
        { value: "-", label: "Attempts" },
        { value: "-", label: "Questions" },
      ]
    : [
        { value: formatNumber(stats?.total_students || 0), label: "Students" },
        { value: formatNumber(stats?.total_exams || 0), label: "Exams" },
        { value: formatNumber(stats?.total_attempts || 0), label: "Attempts" },
        { value: formatNumber(stats?.total_questions || 0),label: "Questions",},
      ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Professor, MIT",
      content:
        "This platform has transformed how we conduct online assessments. The anti-cheating features give us confidence in exam integrity.",
      rating: 5,
    },
    {
      name: "Mark Thompson",
      role: "CTO, EduTech Solutions",
      content:
        "The analytics dashboard provides invaluable insights. Our pass rates improved by 25% after implementing this system.",
      rating: 5,
    },
    {
      name: "Emily Chen",
      role: "Director, Global University",
      content:
        "Scalable, secure, and incredibly easy to use. The best online examination system we've ever used.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <GraduationCap className="text-white" size={22} />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                {APP_NAME}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-6 animate-fade-in-up">
                <Zap size={14} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  {loading
                    ? "Loading..."
                    : `Trusted by ${formatNumber(stats?.total_students || 0)} Students`}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                The Future of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  Online Examination
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                A secure, efficient, and user-friendly platform for conducting
                online exams with real-time monitoring, anti-cheating measures,
                and instant analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-primary-700">
                    {loading
                      ? "Loading..."
                      : `Trusted by ${formatNumber(stats?.total_students || 0)} Students`}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 animate-fade-in scale-in">
                {/* Mock Exam Interface */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                    <Clock size={14} />
                    14:59
                  </div>
                </div>

                {/* Question Mock */}
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-2">
                    Question 5 of 20
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-primary-500 rounded-full w-1/4" />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-3">
                      What is the time complexity of binary search?
                    </p>
                    <div className="space-y-2">
                      {["A) O(n)", "B) O(log n)", "C) O(n²)", "D) O(1)"].map(
                        (opt, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border ${
                              opt === "B) O(log n)"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <span className="text-gray-700">{opt}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Video size={14} />
                    Monitoring Active
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield size={14} />
                    Secure
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-bounce-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Auto-Graded</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <BarChart3 size={16} className="text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    98% Accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statCards.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive examination platform packed with powerful features
              to ensure fair and efficient assessments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-primary-600" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Exams?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-xl mx-auto">
                Join thousands of educators who trust our platform for secure,
                efficient online examinations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-white" size={22} />
                </div>
                <span className="text-xl font-bold">{APP_NAME}</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                A secure, efficient, and user-friendly platform for conducting
                online examinations with real-time monitoring.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <Github size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div id="contact">
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail size={16} />
                  <span>support@exampro.io</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Globe size={16} />
                  <span>www.exampro.io</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
