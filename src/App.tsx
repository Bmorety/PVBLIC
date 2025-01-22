'use client'

import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchNearestStations, fetchDepartures, fetchServices, StationData, DepartureData, StationServiceInfo } from "./MvvApi";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faSync, faPersonWalking, faCoffee, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { Departures } from "./Departures";

const BASE_PATH = process.env.PUBLIC_URL || '';

declare global {
  interface Window {
    kofiwidget: any; // or a more specific type if you know the structure
  }
}

export { };
const App: React.FC = () => {
  const [showKofi, setShowKofi] = useState(false);

  const toggleKofi = () => setShowKofi(!showKofi);

  useEffect(() => {
    // Create the script element for the Ko-fi widget
    const script1 = document.createElement('script');
    script1.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
    script1.async = true;
    script1.onload = () => {
      // Initialize the Ko-fi widget after the script loads
      if (window.kofiwidget) {
        window.kofiwidget.init('Support me on Ko-fi', '#000000', 'U7U716CC11');
        window.kofiwidget.draw();
      }
    };

    document.body.appendChild(script1);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script1);
    };
  }, []);


  return (
    <div className="app-container">
      <header className="app-header">
        <a onClick={toggleKofi} className="kofi-button">
          Built for urbanauts, go PVBLIC
          {showKofi ? (
            <FontAwesomeIcon icon={faWindowClose} className="coffee-icon" fixedWidth />
          ) : (
            <img
              src={process.env.PUBLIC_URL + '/images/kofi.png'}

              className="koficup"
              onError={(e) => {
                // Fallback to direct GitHub Pages URL if the first path fails
                e.currentTarget.src = 'https://bmorety.github.io/PVBLIC/images/kofi.png';
              }}
            />
          )}
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
        <p className="version">
          Pre-Alpha. Munich MVG.
        </p>

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
                Every coffee you contribute fuels more hours of work to refine and grow this tool. It’s about creating something meaningful for urban explorers like you—empowering a deeper sense of ownership over our cities and their spaces. Together, we’re building a deeper, grassroots understanding that amplifies the collective knowledge shaping urban life.
              </p>
            </div>
            <div className="kofi-supportme-button">
              {/* This will hold the Ko-fi widget */}
            </div>
            <a href="https://ko-fi.com/U7U716CC11" target="_blank" rel="noopener noreferrer">
              <img
                height="36"
                style={{ border: '0px', height: '45px' }}
                src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"

                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
            {/*<iframe
              id="kofi-frame"
              src="https://ko-fi.com/bikebusrepeat/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{ border: 'none', padding: '10px', background: '#FFFFFF' }}
              height="550"
              title="bikebusrepeat"
            />*/}
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
