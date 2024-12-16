'use client'

import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchNearestStations, fetchDepartures, fetchServices, StationData, DepartureData, StationServiceInfo } from "./MvvApi";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faSync, faPersonWalking, faCoffee, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { Departures } from "./Departures";

const BASE_PATH = process.env.PUBLIC_URL || '';

const App: React.FC = () => {
  const [showKofi, setShowKofi] = useState(false);

  const toggleKofi = () => setShowKofi(!showKofi);

  return (
    <div className="app-container">
      <header className="app-header">
        <a onClick={toggleKofi} className="kofi-button">
          Built for urbanauts, Ride PVBLIC
          <FontAwesomeIcon icon={showKofi ? faWindowClose : faCoffee} className="coffee-icon" fixedWidth />
        </a>
        <img
          src={process.env.PUBLIC_URL + '/images/Logo512.png'}
          alt="PVBLIC."
          className="logo"
          onError={(e) => {
            // Fallback to direct GitHub Pages URL if the first path fails
            e.currentTarget.src = 'https://bmorety.github.io/PVBLIC/images/Logo512.png';
          }}
        />
        <div className="separator" />
      </header>
      <main className={`app-main ${showKofi ? 'show-kofi' : ''}`}>
        {showKofi ? (
          <div className="kofi-container">
            <div className="kofi-text">
              <h2>Support PVBLIC</h2>
              <p>
                Hi, I’m Bruno, and I am working on PVBLIC, a fresh take on the Munich public transport app. Designed for power users, PVBLIC focuses on the essentials while tapping into the collective knowledge of Urbanauts to capture the pulse of urban life.
              </p>
              <p>Upcoming features:
                <ul>
                  <li>Plan your route</li>
                  <li>Share your urbanaut thoughts</li>
                  <li>Let's generate collective narratives about our favorite neighbourhoods</li>
                </ul>
              </p>

              <p>
                Are you an Urbanaut, ready to share your unique insights about your city? If you believe in the power of collective wisdom to improve urban life, your support can make a meaningful difference. Contributions will ensure the continued development of PVBLIC's mission.
              </p>
            </div>
            <iframe
              id="kofi-frame"
              src="https://ko-fi.com/bikebusrepeat/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{ border: 'none', padding: '10px', background: '#FFFFFF' }}
              height="550"
              title="bikebusrepeat"
            />
          </div>
        ) : (
          <Departures></Departures>
        )}

      </main>
      <footer className="app-footer">
        <div className="separator" />
      </footer>

    </div>
  );
};
export default App;
