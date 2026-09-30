import React from 'react'

export default function OrientationGuard({ children }) {
  return (
    <>
      <div className="landscape-required">
        <div className="orientation-content">
          <div className="orientation-icon">
            <div className="phone-icon" />
          </div>

          <h1>PLEASE ROTATE YOUR DEVICE</h1>

          <p>
            Metro Games requires Landscape Gaming Mode
            <br />
            for full screen view.
          </p>

          <div className="rotate-message">
            <span className="screen-icon">▭</span>
            <span>Turn Phone Sideways to Play</span>
            <span>📱</span>
            <span>🔄</span>
          </div>
        </div>
      </div>

      <div className="landscape-app">
        {children}
      </div>
    </>
  )
}