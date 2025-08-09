// src/components/SideBadges.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MapPin } from 'lucide-react';

export function SideBadges() {
  const [showMapPopup, setShowMapPopup] = useState(false);
  const pathname = usePathname();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.getElementById('map-popup');
      const mapBadge = document.getElementById('map-badge');
      
      if (showMapPopup && popup && !popup.contains(event.target as Node) && 
          mapBadge && !mapBadge.contains(event.target as Node)) {
        setShowMapPopup(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMapPopup]);

  // Don't show badges on checkout and cart pages
  if (pathname === '/checkout' || pathname === '/cart') {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .badge-container {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', 'Helvetica Neue', sans-serif;
        }
        
        .verified-badge {
          width: 37px;
          height: 220px;
          background-color: #e0c67e;
          color: white;
          position: relative;
          box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          border-radius: 0 5px 5px 0;
          cursor: pointer;
          transition: width 0.3s ease, background-color 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', 'Helvetica Neue', sans-serif !important;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.2;
          overflow: hidden;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }

        .verified-badge:hover {
          width: 50px;
          background-color: #c9b06b;
        }
        
        .badge-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: calc(100% - 40px);
          pointer-events: none;
          backface-visibility: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', 'Helvetica Neue', sans-serif !important;
          font-weight: 800;
        }
        
        .badge-container * {
          box-sizing: border-box;
        }
        
        .vertical-text, .verified-icon, .badge-content, .badge-content * {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', 'Helvetica Neue', sans-serif !important;
        }
        
        .map-badge {
          width: 37px;
          min-width: 37px;
          height: 40px;
          background-color: #749cf7;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
          box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          border-radius: 0 5px 5px 0;
          cursor: pointer;
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        
        .map-badge:hover {
          width: 50px;
          background-color: #567edb;
        }
        
        .map-badge svg {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          white-space: nowrap;
          margin-top: 0;
          text-align: center;
          line-height: 1;
          backface-visibility: hidden;
          font-kerning: none;
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: subpixel-antialiased;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', 'Helvetica Neue', sans-serif !important;
          font-weight: 800;
          font-size: 10px;
          position: relative;
          z-index: 1;
        }
        
        .verified-icon {
          width: 20px;
          height: 20px;
          filter: brightness(0) invert(1);
          margin-bottom: 8px;
          flex-shrink: 0;
          display: block;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        .map-popup {
          position: fixed;
          left: 60px;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          z-index: 1001;
          padding: 8px 20px 12px 20px;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
          display: ${showMapPopup ? 'block' : 'none'};
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'San Francisco', 'Helvetica Neue', sans-serif;
        }
        
        .popup-header {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          margin-bottom: -20px;
          margin-top: 8px;
          margin-right: -8px;
        }
        
        .close-popup {
          background: none;
          border: none;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          color: #999;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
          line-height: 1;
        }
        
        .close-popup:hover {
          color: #333;
        }
        
        .popup-content {
          max-height: 80vh;
          overflow-y: auto;
          text-align: center;
        }
        
        .company-name {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 3px;
          margin-top: 15px;
        }
        
        .company-address {
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .company-note {
          font-style: italic;
          font-size: 12px;
          color: #666;
          margin: 3px 0;
        }
        
        .bank-details {
          font-weight: 700;
          margin-top: 12px;
          margin-bottom: 3px;
        }
        
        .google-map {
          text-align: center;
          margin-top: 15px;
          padding: 8px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .footer-links {
          text-align: center;
          margin-top: 12px;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }
        
        .info-link {
          color: #3498db;
          text-decoration: none;
          margin: 0 5px;
        }
        
        .info-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .badge-container {
            display: none;
          }
        }
      `}</style>

      {/* Badge Container */}
      <div className="badge-container">
        {/* Verified Badge - links to review page */}
        <div 
          className="verified-badge" 
          onClick={() => window.location.href = '/bolt-ertekeles'}
        >
          <div className="badge-content">
            <img 
              src="/images/verified_by_customers_icon.png" 
              alt="Verified" 
              className="verified-icon"
            />
            <div className="vertical-text">Vásárlók által értékelt</div>
          </div>
        </div>
        
        {/* Map Badge */}
        <div 
          className="map-badge" 
          id="map-badge"
          onClick={() => setShowMapPopup(true)}
        >
          <MapPin />
        </div>
      </div>

      {/* Map Popup */}
      <div className="map-popup" id="map-popup">
        <div className="popup-header">
          <button 
            className="close-popup" 
            onClick={() => setShowMapPopup(false)}
          >
            ×
          </button>
        </div>
        
        <div className="popup-content">
          <div className="company-name">Jovotech.hu</div>
          <div className="company-address">1. máje 535/50, 46007 Liberec III-Jeřáb</div>
          <div>Adószám: 04688465</div>
          <div>Jogi forma: Gazdasági tevékenység</div>
          <div className="company-note">(Cég székhelye - levelezést kérjük e-mailben küldeni)</div>
          <div>E-mail: support@jovotech.hu</div>
          
          <div className="bank-details">Banki adatok</div>
          <div>Számlaszám: 12600016-10426947-95638648</div>
          <div>IBAN: HU86126000161042694795638648</div>
          <div>BIC/SWIFT: TRWIBEBBXXX</div>
          <div>Bank: WISE EUROPE S.A.</div>
          <div>Bank címe: Rue du Trône 100, 1050 Brussels</div>
          
          <div className="google-map">
            <iframe 
              width="100%" 
              height="390" 
              style={{ borderRadius: '8px', border: 0 }}
              title="Google Map" 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2525.097647031825!2d15.053808915747!3d50.76771097952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470935d5ce4eaf79%3A0xb7b6b6bbf5c6f3f4!2s1.%20m%C3%A1je%20535%2F50%2C%20460%2007%20Liberec%2C%20Czechia!5e0!3m2!1sen!2scz!4v1698267782231"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <div className="footer-links">
            <a href="/aszf" className="info-link">
              Szabályzat
            </a>
            |
            <a href="/visszaru-es-reklamacio" className="info-link">
              Visszaküldések és reklamációk
            </a>
            |
            <a href="/bolt-ertekeles" className="info-link">
              Bolt értékelése
            </a>
          </div>
        </div>
      </div>
    </>
  );
}