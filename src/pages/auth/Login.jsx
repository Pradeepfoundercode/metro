import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../schemas/authSchema";
import loginBg from "../../assets/bg/login_bg.png";
import loginBtn from "../../assets/button/login_btn.png";
import { useAuth } from "../../hooks/useAuth";
import { useLogin } from "../../hooks/useLogin";
import { useFullscreenLandscape } from "../../hooks/useFullscreen";

export default function Login() {
  const { enterFullscreen } = useFullscreenLandscape();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
      rememberPassword: true,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    navigate("/dashboard", {
      replace: true,
    });
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  const handleGoDashboard = async () => {
  await enterFullscreen()

  navigate('/dashboard')
}

  return (
    <button onClick={enterFullscreen} className="game-viewport">
        <div className="game-stage">
          {/* BACKGROUND */}
          <img
            src={loginBg}
            alt="Metro Login Background"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
          />

          {/* CLOSE */}
          <button
  type="button"
  onClick={handleGoDashboard}
  className="absolute right-[16px] top-[14px] z-50 flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full border-2 border-white/70 bg-black/20 text-[30px] leading-none text-white transition hover:bg-black/40 active:scale-95"
>
  ×
</button>

          {/* LOGIN PANEL */}
          <div className="absolute bottom-0 left-[10px] right-[10px] z-20 h-[220px] rounded-t-[14px] border-2 border-white/40 bg-[#030a18]/75 shadow-[0_-5px_30px_rgba(0,0,0,0.35)]">
            {/* LEFT INFO */}
            <div className="absolute left-[23px] top-[38px] flex h-[139px] w-[680px] items-center rounded-[14px] border-2 border-[#d83a18] bg-black/85 px-[26px]">
              <ul className="flex list-none flex-col gap-[5px] text-[14px] font-bold leading-[1.25] text-white">
                <li className="flex items-start">
                  <span className="mr-[9px] w-[14px] shrink-0">#</span>
                  <span>Register and PLAY FOR FREE</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-[9px] w-[14px] shrink-0">#</span>
                  <span>Get 100 FREE CHIPS on every login.</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-[9px] w-[14px] shrink-0">#</span>
                  <span>
                    Great PRIZES and GIFTS to be won on surprise competition.
                  </span>
                </li>

                <li className="flex items-start">
                  <span className="mr-[9px] w-[14px] shrink-0">#</span>
                  <span>
                    NO DEPOSITS (or) any charges required to play on the site.
                  </span>
                </li>

                <li className="flex items-start">
                  <span className="mr-[9px] w-[14px] shrink-0">#</span>
                  <span>No Redemption (or) Cash Winnings.</span>
                </li>
              </ul>
            </div>

            {/* LOGIN FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="absolute left-[880px] top-[45px] flex w-[1080px] items-center"
            >
              <div className="flex w-[720px] flex-col gap-[12px]">
                {/* USERNAME */}
                <div>
                  <div className="flex items-center">
                    <label className="w-[150px] shrink-0 text-left text-[19px] font-black tracking-[1px] text-white">
                      USERNAME
                    </label>

                    <div className="relative w-[565px]">
                      <input
                        type="text"
                        {...register("username", {
                          onChange: (event) => {
                            setValue(
                              "username",
                              event.target.value.toUpperCase(),
                              {
                                shouldValidate: true,
                              },
                            );
                          },
                        })}
                        autoComplete="username"
                        className={`h-[37px] w-full rounded-[4px] border-2 bg-white px-[14px] text-[17px] font-semibold text-black outline-none shadow-inner ${
                          errors.username
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-gray-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        }`}
                      />
                    </div>
                  </div>

                  {errors.username && (
                    <div className="ml-[150px] mt-[3px] text-[14px] font-bold text-red-400">
                      {errors.username.message}
                    </div>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center">
                    <label className="w-[150px] shrink-0 text-left text-[19px] font-black tracking-[1px] text-white">
                      PASSWORD
                    </label>

                    <div className="relative w-[565px]">
                      <input
                         type={showPassword ? "text" : "password"}
                        {...register("password")}
                        autoComplete="current-password"
                        className={`h-[37px] w-full rounded-[4px] border-2 bg-white pl-[14px] pr-[45px] text-[17px] font-semibold text-black outline-none shadow-inner ${
                          errors.password
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-gray-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        }`}
                      />

                      <button
  type="button"
  onClick={() => setShowPassword((value) => !value)}
  className="absolute right-[10px] top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[18px] text-gray-600"
>
  {showPassword ? (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
</button>
                    </div>
                  </div>

                  {errors.password && (
                    <div className="ml-[150px] mt-[3px] text-[14px] font-bold text-red-400">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* REMEMBER */}
                <label className="ml-[150px] flex cursor-pointer items-center gap-[8px] text-[15px] font-bold tracking-[1px] text-white">
                  <input
                    type="checkbox"
                    {...register("rememberPassword")}
                    className="h-[17px] w-[17px] accent-cyan-500"
                  />

                  <span>REMEMBER PASSWORD</span>
                </label>
              </div>

              {/* LOGIN BUTTON */}
              <div className="flex w-[210px] items-center justify-center ml-10">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full cursor-pointer border-none bg-transparent p-0 outline-none transition hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <img
                    src={loginBtn}
                    alt="LOGIN"
                    className="block h-auto w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.75)]"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </button>
  );
}
