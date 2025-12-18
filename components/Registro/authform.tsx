'use client';

import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleSubmit = (type: 'login' | 'register') => {
    console.log(`${type} submitted`);
  };

  return (
    <div className="min-h-screen bg-[#25252b] flex items-center justify-center p-4 font-['Poppins',sans-serif]">
      <div
        className={`relative w-full max-w-[750px] h-[450px] border-2 border-[#ff2770] shadow-[0_0_25px_#ff2770] overflow-hidden transition-all duration-1000 ${
          isActive ? 'active' : ''
        }`}
      >
        {/* Curved Shapes */}
        <div
          className={`absolute right-0 -top-[5px] h-[600px] w-[850px] bg-gradient-to-br from-[#25252b] to-[#ff2770] origin-bottom-right transition-all duration-[1500ms] ${
            isActive
              ? 'rotate-0 skew-y-0 delay-500'
              : 'rotate-[10deg] skew-y-[40deg] delay-[1600ms]'
          }`}
        />
        <div
          className={`absolute left-[250px] top-full h-[700px] w-[850px] bg-[#25252b] border-t-[3px] border-[#ff2770] origin-bottom-left transition-all duration-[1500ms] ${
            isActive
              ? '-rotate-[11deg] skew-y-[-41deg] delay-[1200ms]'
              : 'rotate-0 skew-y-0 delay-500'
          }`}
        />

        {/* Login Form */}
        <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-10">
          <h2
            className={`text-3xl text-center text-white mb-6 transition-all duration-700 ${
              isActive
                ? 'translate-x-[-120%] opacity-0 delay-0'
                : 'translate-x-0 opacity-100 delay-[2100ms]'
            }`}
          >
            Login
          </h2>
          <div>
            <div
              className={`relative w-full h-[50px] mt-6 transition-all duration-700 ${
                isActive
                  ? 'translate-x-[-120%] opacity-0 delay-[100ms]'
                  : 'translate-x-0 opacity-100 delay-[2200ms]'
              }`}
            >
              <input
                type="text"
                required
                className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold border-b-2 border-white pr-6 transition-all duration-500 focus:border-[#ff2770] peer"
              />
              <label className="absolute top-1/2 left-0 -translate-y-1/2 text-base text-white transition-all duration-500 pointer-events-none peer-focus:top-[-5px] peer-focus:text-[#ff2770] peer-valid:top-[-5px] peer-valid:text-[#ff2770]">
                Username
              </label>
              <User className="absolute top-1/2 right-0 -translate-y-1/2 text-white w-[18px] h-[18px] peer-focus:text-[#ff2770] peer-valid:text-[#ff2770]" />
            </div>
            <div
              className={`relative w-full h-[50px] mt-6 transition-all duration-700 ${
                isActive
                  ? 'translate-x-[-120%] opacity-0 delay-[200ms]'
                  : 'translate-x-0 opacity-100 delay-[2300ms]'
              }`}
            >
              <input
                type="password"
                required
                className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold border-b-2 border-white pr-6 transition-all duration-500 focus:border-[#ff2770] peer"
              />
              <label className="absolute top-1/2 left-0 -translate-y-1/2 text-base text-white transition-all duration-500 pointer-events-none peer-focus:top-[-5px] peer-focus:text-[#ff2770] peer-valid:top-[-5px] peer-valid:text-[#ff2770]">
                Password
              </label>
              <Lock className="absolute top-1/2 right-0 -translate-y-1/2 text-white w-[18px] h-[18px] peer-focus:text-[#ff2770] peer-valid:text-[#ff2770]" />
            </div>
            <button
              onClick={() => handleSubmit('login')}
              className={`relative w-full h-[45px] mt-6 bg-transparent rounded-[40px] text-base font-semibold text-white border-2 border-[#ff2770] overflow-hidden z-10 transition-all duration-700 before:content-[''] before:absolute before:h-[300%] before:w-full before:bg-gradient-to-b before:from-[#25252b] before:via-[#ff2770] before:to-[#25252b] before:top-[-100%] before:left-0 before:z-[-1] before:transition-all before:duration-500 hover:before:top-0 ${
                isActive
                  ? 'translate-x-[-120%] opacity-0 delay-[300ms]'
                  : 'translate-x-0 opacity-100 delay-[2400ms]'
              }`}
            >
              Login
            </button>
            <div
              className={`text-sm text-center mt-5 mb-2 text-white transition-all duration-700 ${
                isActive
                  ? 'translate-x-[-120%] opacity-0 delay-[400ms]'
                  : 'translate-x-0 opacity-100 delay-[2500ms]'
              }`}
            >
              <p>
                Don't have an account? <br />
                <button
                  onClick={handleRegisterClick}
                  className="text-[#ff2770] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Login Info */}
        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center text-right pr-10 pl-[150px] pb-[60px]">
          <h2
            className={`text-4xl uppercase leading-tight text-white mb-4 transition-all duration-700 ${
              isActive
                ? 'translate-x-[120%] opacity-0 blur-[10px] delay-0'
                : 'translate-x-0 opacity-100 blur-0 delay-[2000ms]'
            }`}
          >
            WELCOME BACK!
          </h2>
          <p
            className={`text-base text-white transition-all duration-700 ${
              isActive
                ? 'translate-x-[120%] opacity-0 blur-[10px] delay-[100ms]'
                : 'translate-x-0 opacity-100 blur-0 delay-[2100ms]'
            }`}
          >
            We are happy to have you with us again. If you need anything, we are here to help.
          </p>
        </div>

        {/* Register Form */}
        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-[60px]">
          <h2
            className={`text-3xl text-center text-white mb-6 transition-all duration-700 ${
              isActive
                ? 'translate-x-0 opacity-100 blur-0 delay-[1700ms]'
                : 'translate-x-[120%] opacity-0 blur-[10px] delay-0'
            }`}
          >
            Register
          </h2>
          <div>
            <div
              className={`relative w-full h-[50px] mt-6 transition-all duration-700 ${
                isActive
                  ? 'translate-x-0 opacity-100 blur-0 delay-[1800ms]'
                  : 'translate-x-[120%] opacity-0 blur-[10px] delay-[100ms]'
              }`}
            >
              <input
                type="text"
                required
                className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold border-b-2 border-white pr-6 transition-all duration-500 focus:border-[#ff2770] peer"
              />
              <label className="absolute top-1/2 left-0 -translate-y-1/2 text-base text-white transition-all duration-500 pointer-events-none peer-focus:top-[-5px] peer-focus:text-[#ff2770] peer-valid:top-[-5px] peer-valid:text-[#ff2770]">
                Username
              </label>
              <User className="absolute top-1/2 right-0 -translate-y-1/2 text-white w-[18px] h-[18px] peer-focus:text-[#ff2770] peer-valid:text-[#ff2770]" />
            </div>
            <div
              className={`relative w-full h-[50px] mt-6 transition-all duration-700 ${
                isActive
                  ? 'translate-x-0 opacity-100 blur-0 delay-[1900ms]'
                  : 'translate-x-[120%] opacity-0 blur-[10px] delay-[200ms]'
              }`}
            >
              <input
                type="email"
                required
                className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold border-b-2 border-white pr-6 transition-all duration-500 focus:border-[#ff2770] peer"
              />
              <label className="absolute top-1/2 left-0 -translate-y-1/2 text-base text-white transition-all duration-500 pointer-events-none peer-focus:top-[-5px] peer-focus:text-[#ff2770] peer-valid:top-[-5px] peer-valid:text-[#ff2770]">
                Email
              </label>
              <Mail className="absolute top-1/2 right-0 -translate-y-1/2 text-white w-[18px] h-[18px] peer-focus:text-[#ff2770] peer-valid:text-[#ff2770]" />
            </div>
            <div
              className={`relative w-full h-[50px] mt-6 transition-all duration-700 ${
                isActive
                  ? 'translate-x-0 opacity-100 blur-0 delay-[1900ms]'
                  : 'translate-x-[120%] opacity-0 blur-[10px] delay-[300ms]'
              }`}
            >
              <input
                type="password"
                required
                className="w-full h-full bg-transparent border-none outline-none text-base text-white font-semibold border-b-2 border-white pr-6 transition-all duration-500 focus:border-[#ff2770] peer"
              />
              <label className="absolute top-1/2 left-0 -translate-y-1/2 text-base text-white transition-all duration-500 pointer-events-none peer-focus:top-[-5px] peer-focus:text-[#ff2770] peer-valid:top-[-5px] peer-valid:text-[#ff2770]">
                Password
              </label>
              <Lock className="absolute top-1/2 right-0 -translate-y-1/2 text-white w-[18px] h-[18px] peer-focus:text-[#ff2770] peer-valid:text-[#ff2770]" />
            </div>
            <button
              onClick={() => handleSubmit('register')}
              className={`relative w-full h-[45px] mt-6 bg-transparent rounded-[40px] text-base font-semibold text-white border-2 border-[#ff2770] overflow-hidden z-10 transition-all duration-700 before:content-[''] before:absolute before:h-[300%] before:w-full before:bg-gradient-to-b before:from-[#25252b] before:via-[#ff2770] before:to-[#25252b] before:top-[-100%] before:left-0 before:z-[-1] before:transition-all before:duration-500 hover:before:top-0 ${
                isActive
                  ? 'translate-x-0 opacity-100 blur-0 delay-[2000ms]'
                  : 'translate-x-[120%] opacity-0 blur-[10px] delay-[400ms]'
              }`}
            >
              Register
            </button>
            <div
              className={`text-sm text-center mt-5 mb-2 text-white transition-all duration-700 ${
                isActive
                  ? 'translate-x-0 opacity-100 blur-0 delay-[2100ms]'
                  : 'translate-x-[120%] opacity-0 blur-[10px] delay-[500ms]'
              }`}
            >
              <p>
                Already have an account? <br />
                <button
                  onClick={handleLoginClick}
                  className="text-[#ff2770] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Register Info */}
        <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center text-left pl-10 pr-[150px] pb-[60px] pointer-events-none">
          <h2
            className={`text-4xl uppercase leading-tight text-white mb-4 transition-all duration-700 ${
              isActive
                ? 'translate-x-0 opacity-100 blur-0 delay-[1700ms]'
                : 'translate-x-[-120%] opacity-0 blur-[10px] delay-0'
            }`}
          >
            WELCOME!
          </h2>
          <p
            className={`text-base text-white transition-all duration-700 ${
              isActive
                ? 'translate-x-0 opacity-100 blur-0 delay-[1800ms]'
                : 'translate-x-[-120%] opacity-0 blur-[10px] delay-[100ms]'
            }`}
          >
            We're delighted to have you here. If you need any assistance, feel free to reach out.
          </p>
        </div>
      </div>
    </div>
  );
}