import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Smartphone, ShieldCheck, User } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showOtpToast, setShowOtpToast] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(30);
      // Simulate receiving OTP
      setShowOtpToast(true);
      // Removed timeout to keep it visible for user convenience in demo
    }, 1500);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col font-sans relative overflow-hidden">
      
      {/* OTP Toast Simulation */}
      {showOtpToast && (
          <div className="absolute top-4 left-4 right-4 bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl z-50 animate-slide-down flex items-center justify-between">
              <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Messages • now</p>
                  <p className="font-bold text-lg">Your GoBuddy OTP is 1234</p>
              </div>
              <button onClick={() => {
                  setOtp(['1','2','3','4']);
                  setShowOtpToast(false);
              }} className="text-blue-400 font-bold text-sm bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-500/30">Auto-fill</button>
          </div>
      )}

      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[55%] bg-blue-600 rounded-b-[3rem] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/80"></div>
      </div>

      {/* Content Container */}
      <div className="flex-1 z-10 flex flex-col justify-end relative">
        <div className="bg-white h-auto rounded-t-[2.5rem] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-slide-up pb-10">
          
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">GoBuddy</h1>
            <p className="text-gray-500 font-medium">Find your perfect sports partner in minutes.</p>
          </div>

          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mobile Number</label>
                <div className="flex items-center gap-3 border-b-2 border-gray-100 focus-within:border-blue-600 py-3 transition-colors">
                  <span className="text-lg font-bold text-gray-400">🇮🇳 +91</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="999 999 9999"
                    className="flex-1 text-xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
                    autoFocus
                  />
                  <Smartphone className={`text-gray-300 ${phone.length === 10 ? 'text-green-500' : ''}`} />
                </div>
              </div>

              <div className="space-y-3">
                <button 
                    onClick={handleSendOtp}
                    disabled={phone.length < 10 || isLoading}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={20} /></>}
                </button>
              </div>
              
              <p className="text-center text-[10px] text-gray-400 px-8 mt-4 leading-tight">
                For demo access, enter any 10-digit number.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in-right">
              <div className="text-center">
                 <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-2xl mb-4 shadow-sm">
                    <ShieldCheck size={24} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
                 <p className="text-sm text-gray-500 mt-1">Sent to +91 {phone} <button onClick={() => setStep('phone')} className="text-blue-600 font-bold ml-1">Edit</button></p>
              </div>

              <div className="flex justify-between gap-3 px-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-14 h-16 border-2 border-gray-100 rounded-2xl text-center text-2xl font-bold focus:border-blue-600 focus:outline-none bg-gray-50 focus:bg-white transition-all caret-blue-600"
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                  <button 
                    onClick={handleVerifyOtp}
                    disabled={otp.some(d => !d) || isLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                  >
                     {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                  </button>
                  <div className="text-sm font-bold text-gray-400">
                    {timer > 0 ? (
                        <span>Resend OTP in <span className="text-gray-900">00:{timer.toString().padStart(2, '0')}</span></span>
                    ) : (
                        <button onClick={handleSendOtp} className="text-blue-600 hover:underline">Resend OTP</button>
                    )}
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;