// landingPage3.ts
export const landingPage3HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Matrix - Basic</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #13141a;
            color: #ffffff;
            height: 100vh;
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        
        /* Star background */
        body:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 0;
            opacity: 0.3;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            position: relative;
            z-index: 1;
            padding: 20px;
            overflow-y: auto;
            min-height: 600px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            position: absolute;
            top: 30px;
            padding: 0 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
        }
        
        /* ENHANCED ORB CONTAINER */
        .orb-container {
            position: relative;
            width: min(250px, 80vw);
            height: min(250px, 80vw);
            margin: 80px auto 40px auto;
            perspective: 1200px;
            transform-style: preserve-3d;
            flex-shrink: 0;
        }
        
        /* ENHANCED ORB */
        .orb {
            width: min(150px, 50vw);
            height: min(150px, 50vw);
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.9) 15%, 
                rgba(255, 234, 130, 0.8) 30%, 
                rgba(255, 183, 101, 0.7) 45%, 
                rgba(255, 100, 80, 0.5) 60%,
                transparent 75%);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 
                0 0 60px rgba(255, 234, 130, 0.4),
                0 0 100px rgba(255, 183, 101, 0.2);
            z-index: 3;
            animation: pulse 4s infinite alternate, rotate 30s infinite linear;
            opacity: 0.9;
            min-width: 80px;
            min-height: 80px;
        }
        
        /* Orb glow ring */
        .orb:before {
            content: '';
            position: absolute;
            top: -15%;
            left: -15%;
            right: -15%;
            bottom: -15%;
            border-radius: 50%;
            background: radial-gradient(circle, 
                transparent 60%, 
                rgba(255, 234, 130, 0.1) 70%, 
                rgba(255, 183, 101, 0.1) 80%, 
                transparent 100%);
            z-index: -1;
            animation: glow 6s infinite alternate;
        }
        
        /* Orb inner core */
        .orb:after {
            content: '';
            position: absolute;
            width: calc(40% + 10px);
            height: calc(40% + 10px);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(255, 240, 180, 0.8) 50%, 
                transparent 100%);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(255, 240, 180, 0.5);
            animation: coreGlow 3s infinite alternate;
        }
        
        @keyframes pulse {
            0% {
                transform: translate(-50%, -50%) scale(0.9);
            }
            100% {
                transform: translate(-50%, -50%) scale(1.1);
            }
        }
        
        @keyframes glow {
            0% {
                opacity: 0.4;
                box-shadow: 0 0 30px rgba(255, 234, 130, 0.2);
            }
            100% {
                opacity: 0.7;
                box-shadow: 0 0 50px rgba(255, 183, 101, 0.4);
            }
        }
        
        @keyframes coreGlow {
            0% {
                opacity: 0.7;
                width: calc(36% + 10px);
                height: calc(36% + 10px);
            }
            100% {
                opacity: 1;
                width: calc(43% + 10px);
                height: calc(43% + 10px);
            }
        }
        
        @keyframes rotate {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 100% 100%;
            }
        }
        
        .main-title {
            font-size: clamp(24px, 5vw, 36px);
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            margin-bottom: 20px;
            color: #ffffff;
            text-transform: uppercase;
        }
        
        .subtitle {
            font-size: 14px;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: 30px;
            color: #b0b0b0;
            text-transform: uppercase;
        }
        
        .feature-list {
            text-align: center;
            margin-bottom: 30px;
            max-width: 600px;
            padding: 0 10px;
        }
        
        .feature-list ul {
            list-style: none;
            margin-top: 15px;
        }
        
        .feature-list li {
            margin-bottom: 10px;
            font-size: 14px;
            color: #d0d0d0;
        }
        
        .nav-buttons {
            display: flex;
            gap: 30px;
            margin-top: 20px;
        }
        
        .nav-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #ffffff;
            cursor: pointer;
        }
        
        .diamond {
            width: 40px;
            height: 40px;
            background-color: transparent;
            border: 2px solid rgba(255, 255, 255, 0.5);
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .diamond-inner {
            width: 10px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .continue-text {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .footer {
            width: 100%;
            text-align: center;
            margin-top: 40px;
            position: relative;
        }
        
        .progress {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .progress-item {
            width: 12px;
            height: 12px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
        }
        
        .progress-item.active {
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .credit {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
            /* Media queries for responsiveness */
        @media (max-height: 700px) {
            .container {
                justify-content: flex-start;
                padding-top: 70px;
            }
            
            .orb-container {
                margin: 20px auto;
            }
            
            .feature-list {
                margin-bottom: 20px;
            }
            
            .nav-buttons {
                margin-top: 10px;
            }
            
            .footer {
                margin-top: 20px;
            }
        }
        
        @media (max-width: 500px) {
            .nav-buttons {
                gap: 15px;
            }
            
            .diamond {
                width: 30px;
                height: 30px;
            }
            
            .progress {
                gap: 10px;
            }
            
            .progress-item {
                width: 10px;
                height: 10px;
            }
        }
        
        /* Hide orb on very small screens */
        @media (max-width: 400px), (max-height: 500px) {
            .orb-container {
                display: none;
            }
            
            .container {
                padding-top: 60px;
            }
            
            .main-title {
                margin-top: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div>NOVA MATRIX</div>
            </div>
        </div>
        
        <div class="orb-container">
            <div class="orb"></div>
        </div>
        
        <h1 class="main-title">INSTRUCTIONS</h1>
        
        <div class="feature-list">
            <p class="subtitle">Begin presenting your data to viewers by:</p>
            <ul>
                <li>✨ Adding a Matrix visual to your report</li>
                <li>✨ Configure the Rows, Columns, and Values fields</li>
                <li>✨ Use the formatting panel to customize your matrix</li>
                <li>✨ Enjoy the power of interactive data exploration!</li>
            </ul>
        </div>
        
        <div class="nav-buttons">
            <a href="#" class="nav-button">
                <div class="diamond">
                    <div class="diamond-inner"></div>
                </div>
                <span class="continue-text">Back</span>
            </a>
            <a href="#" class="nav-button">
                <div class="diamond">
                    <div class="diamond-inner"></div>
                </div>
                <span class="continue-text">Next</span>
            </a>
        </div>
        
        <div class="footer">
            <div class="progress">
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item active"></div>
            </div>
            <div class="credit">Developed by Joshua Biondo</div>
        </div>
    </div>
</body>
</html>`;