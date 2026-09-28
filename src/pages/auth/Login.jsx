import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schemas/authSchema'
import loginBg from '../../assets/bg/login_bg.png'
import loginBtn from '../../assets/button/login_btn.png'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberPassword: true,
    },
  })

  const onSubmit = (data) => {
    console.log('Login form submitted:', data)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans flex flex-col justify-end">
      <img
        src={loginBg}
        alt="Metro Background"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />

      <div className="relative z-20 w-[calc(100%-12px)] sm:w-[calc(100%-24px)] md:w-[calc(100%-32px)] mx-auto mb-1.5 sm:mb-2.5 rounded-xl border border-cyan-400/50 bg-[#030d22]/85 backdrop-blur-sm p-2 sm:p-3 md:p-3.5 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 sm:gap-3 md:gap-5">
          <div className="flex-1 lg:max-w-[450px] rounded-lg border border-[#e63946] bg-black/75 p-2 sm:p-2.5 flex flex-col justify-center">
            <ul className="text-white text-[10.5px] sm:text-[11.5px] md:text-[12px] font-bold leading-snug space-y-0.5 sm:space-y-1 list-none">
              <li className="flex items-start">
                <span className="mr-1.5 text-white">#</span>
                <span>Register and PLAY FOR FREE</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1.5 text-white">#</span>
                <span>Get 100 FREE CHIPS on every login.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1.5 text-white">#</span>
                <span>Great PRIZES and GIFTS to be won on surprise competition.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1.5 text-white">#</span>
                <span>NO DEPOSITS (or) any charges required to play on the site.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1.5 text-white">#</span>
                <span>No Redemption (or) Cash Winnings.</span>
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-4 md:gap-5 flex-1"
          >
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <div className="flex items-center">
                <label className="text-white font-black text-xs sm:text-[13px] tracking-wider w-22 sm:w-26 text-left select-none">
                  USERNAME
                </label>
                <div className="relative flex-1 w-full sm:w-56 md:w-68 lg:w-76">
                  <input
                    type="text"
                    {...register('username')}
                    className={`bg-white rounded-[3px] h-7 sm:h-7.5 px-2.5 text-black text-xs sm:text-sm font-semibold outline-none border ${
                      errors.username
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-gray-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    } w-full shadow-inner`}
                    autoComplete="username"
                  />
                  {errors.username && (
                    <span className="absolute -bottom-3.5 left-0 text-[10px] text-red-400 font-bold whitespace-nowrap">
                      {errors.username.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center mt-1 sm:mt-0.5">
                <label className="text-white font-black text-xs sm:text-[13px] tracking-wider w-22 sm:w-26 text-left select-none">
                  PASSWORD
                </label>
                <div className="relative flex-1 w-full sm:w-56 md:w-68 lg:w-76">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`bg-white rounded-[3px] h-7 sm:h-7.5 pl-2.5 pr-8 text-black text-xs sm:text-sm font-semibold outline-none border ${
                      errors.password
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-gray-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    } w-full shadow-inner`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-0.5 cursor-pointer flex items-center justify-center transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>

                  {errors.password && (
                    <span className="absolute -bottom-3.5 left-0 text-[10px] text-red-400 font-bold whitespace-nowrap">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center ml-22 sm:ml-26 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('rememberPassword')}
                    className="w-3.5 h-3.5 accent-cyan-500 rounded border-gray-400 cursor-pointer"
                  />
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-200 tracking-wider">
                    REMEMBER PASSWORD
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center flex-shrink-0">
              <button
                type="submit"
                className="outline-none border-none bg-transparent p-0 hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 cursor-pointer"
              >
                <img
                  src={loginBtn}
                  alt="LOGIN"
                  className="h-10 sm:h-11 md:h-12 lg:h-13 w-auto object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
