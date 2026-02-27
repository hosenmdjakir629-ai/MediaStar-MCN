import React, { useState } from 'react';
import { Rocket, LayoutDashboard, BrainCircuit, Wallet, ChevronRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MediaStar MCN",
      description: "Your all-in-one command center for next-gen creator management. Scale your network with powerful tools and AI insights.",
      icon: Rocket,
      color: "bg-orbit-500",
      image: "https://images.unsplash.com/photo-1614726365723-49faaa56461f?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Real-time Analytics",
      description: "Get a bird's-eye view of your entire network's performance. Track revenue, views, and engagement in real-time across all creators.",
      icon: LayoutDashboard,
      color: "bg-indigo-500",
       image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "AI Strategy with Gemini",
      description: "Leverage advanced AI to uncover viral content gaps, optimize SEO, and generate winning video ideas instantly.",
      icon: BrainCircuit,
      color: "bg-pink-500",
       image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Localized for Bangladesh",
      description: "Seamless payouts to bKash, Nagad, Rocket, Upay, Tap, and direct transfers to over 50+ local banks. Managing finance has never been easier.",
      icon: Wallet,
      color: "bg-green-500",
       image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-orbit-900 border border-orbit-700 rounded-3xl w-full max-w-4xl h-[550px] flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-orbit-500/20 relative">
        
        {/* Left Side - Image/Visual */}
        <div className="w-full md:w-1/2 relative h-48 md:h-auto">
           <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-orbit-900 via-transparent to-transparent z-10" />
           <img 
            src={steps[currentStep].image} 
            alt="Onboarding Visual" 
            className="w-full h-full object-cover transition-all duration-700"
           />
           <div className="absolute bottom-6 left-6 z-20 hidden md:block">
              <div className={`w-12 h-12 rounded-2xl ${steps[currentStep].color} flex items-center justify-center shadow-lg mb-4 transition-colors duration-300`}>
                <StepIcon className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{steps[currentStep].title}</h2>
           </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between bg-orbit-800 h-full">
           
           <div className="flex justify-end">
             <button onClick={onComplete} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Skip Intro</button>
           </div>

           <div className="space-y-6 mt-4 md:mt-0">
             <div className="md:hidden flex items-center space-x-3 mb-2"> 
                <div className={`w-10 h-10 rounded-xl ${steps[currentStep].color} flex items-center justify-center shadow-lg`}>
                    <StepIcon className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
             </div>
             
             <p className="text-gray-300 text-base md:text-lg leading-relaxed">
               {steps[currentStep].description}
             </p>

             {/* Progress Indicators */}
             <div className="flex space-x-2 pt-4">
               {steps.map((_, idx) => (
                 <button 
                    key={idx} 
                    onClick={() => setCurrentStep(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-orbit-500' : 'w-2 bg-orbit-700 hover:bg-orbit-600'}`}
                 />
               ))}
             </div>
           </div>

           <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
              <button 
                onClick={handleNext}
                className="flex items-center space-x-2 bg-white text-orbit-900 hover:bg-gray-200 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                {currentStep === steps.length - 1 ? <Check size={18} /> : <ChevronRight size={18} />}
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;