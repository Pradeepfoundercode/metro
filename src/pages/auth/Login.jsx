import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema } from '../../schemas/authSchema'



import loginBg from '../../assets/bg/login_bg.png'
import loginBtn from '../../assets/button/login_btn.png'
import { useAuth } from '../../hooks/useAuth'
import { useLogin } from '../../hooks/useLogin'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const { isAuthenticated } = useAuth()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: '',
      password: '',
      rememberPassword: true,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', {
        replace: true,
      })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = (data) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    })
  }

  return (
    <div className="relative flex h-screen w-screen select-none flex-col justify-end overflow-hidden bg-black font-sans">
      <img
        src={loginBg}
        alt="Metro Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />

      <div className="relative z-20 mx-auto mb-1.5 w-[calc(100%-12px)] rounded-xl border border-cyan-400/50 bg-[#030d22]/85 p-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-sm sm:mb-2.5 sm:w-[calc(100%-24px)] sm:p-3 md:w-[calc(100%-32px)] md:p-3.5">
        <div className="flex flex-col items-stretch justify-between gap-2 sm:gap-3 md:gap-5 lg:flex-row lg:items-center">
          <div className="flex w-full flex-shrink-0 flex-col justify-center rounded-xl border border-red-500 bg-black/85 p-3 px-4 sm:p-3.5 sm:px-5 lg:w-[560px] xl:w-[620px]">
            <ul className="list-none space-y-1 text-[11px] font-bold leading-snug text-white sm:text-[12px] md:text-[12.5px]">
              <li className="flex items-start">
                <span className="mr-1.5">#</span>
                <span>Register and PLAY FOR FREE</span>
              </li>

              <li className="flex items-start">
                <span className="mr-1.5">#</span>
                <span>Get 100 FREE CHIPS on every login.</span>
              </li>

              <li className="flex items-start">
                <span className="mr-1.5">#</span>
                <span>
                  Great PRIZES and GIFTS to be won on surprise competition.
                </span>
              </li>

              <li className="flex items-start">
                <span className="mr-1.5">#</span>
                <span>
                  NO DEPOSITS (or) any charges required to play on the site.
                </span>
              </li>

              <li className="flex items-start">
                <span className="mr-1.5">#</span>
                <span>No Redemption (or) Cash Winnings.</span>
              </li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col items-center justify-end gap-2.5 sm:flex-row sm:gap-4 md:gap-5"
          >
            <div className="flex w-full flex-col gap-1.5 sm:w-auto">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <label className="w-22 select-none text-left text-xs font-black tracking-wider text-white sm:w-26 sm:text-[13px]">
                    USERNAME
                  </label>

                  <div className="relative w-full flex-1 sm:w-56 md:w-68 lg:w-76">
                    <input
                      type="text"
                      {...register('username', {
                        onChange: (event) => {
                          setValue(
                            'username',
                            event.target.value.toUpperCase(),
                            {
                              shouldValidate: true,
                            }
                          )
                        },
                      })}
                      className={`h-7 w-full rounded-[3px] border bg-white px-2.5 text-xs font-semibold uppercase text-black outline-none shadow-inner sm:h-7.5 sm:text-sm ${
                        errors.username
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-gray-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                      autoComplete="username"
                    />
                  </div>
                </div>

                {errors.username && (
                  <span className="ml-22 mt-0.5 text-[11px] font-bold text-red-400 sm:ml-26">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center">
                  <label className="w-22 select-none text-left text-xs font-black tracking-wider text-white sm:w-26 sm:text-[13px]">
                    PASSWORD
                  </label>

                  <div className="relative w-full flex-1 sm:w-56 md:w-68 lg:w-76">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`h-7 w-full rounded-[3px] border bg-white pl-2.5 pr-8 text-xs font-semibold text-black outline-none shadow-inner sm:h-7.5 sm:text-sm ${
                        errors.password
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-gray-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center p-0.5 text-gray-600"
                      title={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                  </div>
                </div>

                {errors.password && (
                  <span className="ml-22 mt-0.5 text-[11px] font-bold text-red-400 sm:ml-26">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="ml-22 flex items-center pt-1 sm:ml-26">
                <label className="flex cursor-pointer select-none items-center gap-1.5">
                  <input
                    type="checkbox"
                    {...register('rememberPassword')}
                    className="h-3.5 w-3.5 cursor-pointer rounded border-gray-400 accent-cyan-500"
                  />

                  <span className="text-[10px] font-bold tracking-wider text-gray-200 sm:text-[11px]">
                    REMEMBER PASSWORD
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center justify-center">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`cursor-pointer border-none bg-transparent p-0 outline-none transition-all duration-150 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] ${
                  loginMutation.isPending
                    ? 'cursor-not-allowed opacity-60'
                    : ''
                }`}
              >
                <img
                  src={loginBtn}
                  alt="LOGIN"
                  className="h-10 w-auto object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] sm:h-11 md:h-12 lg:h-13"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}